import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "ranzo-admin-2026";

function auth(req: NextRequest) {
  return req.headers.get("Authorization") === `Bearer ${ADMIN_SECRET}`;
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let name = "", email = "", service = "", message = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      name = (formData.get("name") as string) || "";
      email = (formData.get("email") as string) || "";
      service = (formData.get("service") as string) || "";
      message = (formData.get("message") as string) || (formData.get("requirements") as string) || "";
    } else {
      const body = await req.json();
      name = body.name || "";
      email = body.email || "";
      service = body.service || "";
      message = body.message || body.requirements || "";
    }

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await prisma.message.create({
      data: { name, email, brand: service, message },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Submit error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const messages = await prisma.message.findMany({ orderBy: { date: "desc" } });
    const submissions = messages.map((m) => ({
      id: m.id,
      form_name: "contact",
      created_at: m.date.toISOString(),
      data: { name: m.name, email: m.email, service: m.brand, message: m.message },
      read: m.read,
    }));
    return NextResponse.json({ submissions });
  } catch (err) {
    console.error("GET submissions error:", err);
    return NextResponse.json({ submissions: [] });
  }
}

export async function DELETE(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  try {
    await prisma.message.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
