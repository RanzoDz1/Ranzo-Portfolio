# Ranzo Portfolio

Persönliches Portfolio mit Projektübersicht, Kontaktformular und geschütztem Admin-Bereich für eingehende Anfragen.

**Live:** https://ranzo-portfolio.vercel.app

## Stack

Next.js 16, TypeScript, Prisma, Resend, Deployment über Vercel

## Features

- Responsive Portfolio-Seite mit Projektübersicht
- Kontaktformular mit E-Mail-Benachrichtigung über Resend
- Geschützter Admin-Bereich unter /admin zur Verwaltung der Anfragen
- Persistenz der Anfragen über Prisma

## Setup

    npm install
    npm run dev

## Konfiguration

Schlüssel und Zugangsdaten werden ausschließlich über Umgebungsvariablen gesetzt,
in Vercel unter Settings, Environment Variables. Unter anderem RESEND_API_KEY für
den Versand der Benachrichtigungen sowie die Zugangsdaten für den Admin-Bereich.

Nach dem Anlegen der Variablen unter Deployments einmal Redeploy auslösen.
