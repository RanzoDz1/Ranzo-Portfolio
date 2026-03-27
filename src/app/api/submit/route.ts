import { NextResponse } from "next/server";
import { Redis } from "ioredis";
import { Resend } from "resend";
import { put } from "@vercel/blob";

const ADMIN_SECRET = process.env.ADMIN_SECRET;
const KV_KEY = "ranzo_submissions";
const NOTIFICATION_EMAIL = "ranzodzt@gmail.com";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_build_key");

const redisUrl = process.env.REDIS_URL;
let kvClient: Redis | null = null;
let isKvConfigured = false;

if (redisUrl) {
    try {
        // Standard ioredis configuration (allows async offline queue while connecting)
        kvClient = new Redis(redisUrl, {
            maxRetriesPerRequest: 1,
        });
        isKvConfigured = true;
    } catch (e) {
        console.error("Manual KV client initialization failed:", e);
    }
}

// Local fallback for development when KV is not set
let localSubmissions: any[] = [];

export async function POST(request: Request) {
    let blobLog = "";
    let kvLog = "";
    try {
        const contentType = request.headers.get("content-type") || "";
        let submissionData: any = {};
        let attachmentUrl: string | null = null;
        let blobErrorMsg: string | null = null;

        if (contentType.includes("multipart/form-data")) {
            const formData = await request.formData();

            formData.forEach((value, key) => {
                if (key !== "attachment") {
                    submissionData[key] = value;
                }
            });

            const file = formData.get("attachment") as File;
            if (file && file.size > 0 && file.name) {
                try {
                    console.log(`Uploading file ${file.name} to Vercel Blob`);
                    blobLog += `Attempting upload ${file.name} (${file.size} bytes). `;
                    const blob = await put(file.name, file, { access: "public" });
                    attachmentUrl = blob.url;
                    blobLog += `Success. `;
                } catch (blobError: any) {
                    blobErrorMsg = blobError.message || String(blobError);
                    blobLog += `Failed: ${blobErrorMsg}. `;
                    console.error("Vercel Blob upload failed:", blobErrorMsg);
                }
            } else {
                blobLog += "No valid file attached. ";
            }
        } else {
            submissionData = await request.json();
            blobLog += "Not multipart/form-data. ";
        }

        const submission = {
            id: `online-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            created_at: new Date().toISOString(),
            form_name: submissionData["form-name"] || submissionData.form_name || "unknown",
            data: {
                ...submissionData,
                attachment: attachmentUrl || submissionData.attachment || null,
            },
        };

        // 1. Save to database
        let kvConnected = false;
        if (isKvConfigured && kvClient) {
            try {
                // Remove ping, just do standard operations and allow ioredis offline queue to handle connection await
                await kvClient.lpush(KV_KEY, JSON.stringify(submission));
                await kvClient.ltrim(KV_KEY, 0, 499);
                kvConnected = true;
                kvLog = "Saved to Redis successfully.";
            } catch (kvError: any) {
                kvLog = `Redis TCP Error: ${kvError.message || kvError}`;
                console.warn("Redis save failed, using memory fallback:", kvError);
                localSubmissions.unshift(submission);
            }
        } else {
            kvLog = "REDIS_URL not provided to environment.";
            localSubmissions.unshift(submission);
        }

        // 2. Send email notification via Resend
        if (process.env.RESEND_API_KEY) {
            try {
                const { data, error } = await resend.emails.send({
                    from: 'Ranzo Portfolio <notifications@ranzodz.com>',
                    to: [NOTIFICATION_EMAIL],
                    replyTo: submission.data.email,
                    subject: `New ${submission.form_name.toUpperCase()} from ${submission.data.name}`,
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                            <h2 style="color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">New Form Submission</h2>
                            <p><strong>Form Type:</strong> ${submission.form_name}</p>
                            <p><strong>Name:</strong> ${submission.data.name}</p>
                            <p><strong>Email:</strong> <a href="mailto:${submission.data.email}">${submission.data.email}</a></p>
                            ${submission.data.service ? `<p><strong>Requested Service:</strong> ${submission.data.service}</p>` : ''}
                            
                            <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin-top: 20px;">
                                <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; color: #6b7280;">Requirements / Message:</h3>
                                <p style="white-space: pre-wrap; font-size: 15px; line-height: 1.5; color: #111827;">${submission.data.requirements || submission.data.message || "No content provided."}</p>
                            </div>

                            ${attachmentUrl ? `
                            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
                                <a href="${attachmentUrl}" style="display: inline-block; background: #3b82f6; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">View Attachment</a>
                            </div>
                            ` : `<p style="margin-top: 20px; font-size: 13px; color: #dc2626;">No attachment received. ${blobErrorMsg ? `(Server Error: ${blobErrorMsg})` : ''}</p>`}

                            <p style="margin-top: 30px; font-size: 12px; color: #9ca3af;">
                                Sent from Ranzo Portfolio Admin Dashboard - ${new Date(submission.created_at).toLocaleString()}<br/>
                                Storage Status: KV(${kvConnected ? 'Yes' : 'No'}) | Blob(${attachmentUrl ? 'Yes' : 'No'})
                            </p>
                            <p style="font-size: 10px; color: #ccc;">Diagnostics:<br/>Blob: ${blobLog}<br/>KV: ${kvLog}</p>
                        </div>
                    `
                });

                if (error) console.error("Resend API error:", error);
            } catch (emailErr) {
                console.error("Failed to trigger email notification:", emailErr);
            }
        }

        return NextResponse.json({ success: true, submission, diagnostics: { blob: blobLog, kv: kvLog } });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function GET(request: Request) {
    const authHeader = request.headers.get("authorization") || "";
    if (authHeader !== `Bearer ${ADMIN_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let remoteSubmissions: any[] = [];
    let kvConnected = false;
    let kvErrorLog = "";

    if (isKvConfigured && kvClient) {
        try {
            await kvClient.ping(); // Await connection establishment here
            const results = await kvClient.lrange(KV_KEY, 0, 499);
            remoteSubmissions = results.map((r: any) => typeof r === "string" ? JSON.parse(r) : r);
            kvConnected = true;
        } catch (e: any) {
            kvErrorLog = e.message || String(e);
            console.error("KV fetch failed:", e);
        }
    } else {
        kvErrorLog = "Not configured or missing REDIS_URL";
    }

    const allSubmissions = kvConnected ? remoteSubmissions : [...localSubmissions, ...remoteSubmissions];

    return NextResponse.json({
        submissions: allSubmissions,
        storage: {
            type: kvConnected ? "persistent" : "volatile",
            is_kv_connected: kvConnected,
            is_blob_connected: !!process.env.BLOB_READ_WRITE_TOKEN,
            is_resend_connected: !!process.env.RESEND_API_KEY,
            kv_error: kvErrorLog
        }
    });
}

export async function DELETE(request: Request) {
    const authHeader = request.headers.get("authorization") || "";
    if (authHeader !== `Bearer ${ADMIN_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    try {
        if (isKvConfigured && kvClient) {
            const results = await kvClient.lrange(KV_KEY, 0, -1);
            const submissions = results.map((r: any) => typeof r === "string" ? JSON.parse(r) : r);
            const filtered = submissions.filter((s: any) => s.id !== id);

            if (filtered.length < submissions.length) {
                await kvClient.del(KV_KEY);
                if (filtered.length > 0) {
                    await kvClient.rpush(KV_KEY, ...filtered.map((s: any) => JSON.stringify(s)));
                }
            }
        } else {
            localSubmissions = localSubmissions.filter((s) => s.id !== id);
        }
    } catch (err) { }

    return NextResponse.json({ success: true });
}
