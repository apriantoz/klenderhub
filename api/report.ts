// api/report.ts

export const config = {
  runtime: 'edge',
};

// 1. Definisi Tipe Data Body Request
interface ReportRequestBody {
  name?: string;
  wa?: string;
  room?: string;
  message?: string;
  token?: string;
}

// 2. Definisi Tipe Data Response Turnstile
interface TurnstileResponse {
  success: boolean;
  'error-codes'?: string[];
}

export async function POST(req: Request) {
  try {
    // Cast hasil req.json() ke ReportRequestBody
    const body = (await req.json()) as ReportRequestBody;
    const { name, wa, room, message, token: turnstileToken } = body;

    // 1. Validasi keberadaan token Turnstile
    if (!turnstileToken) {
      return Response.json(
        { error: "Verifikasi keamanan (Turnstile) diperlukan." },
        { status: 400 }
      );
    }

    // 2. Verifikasi token ke server Cloudflare
    const secretKey = process.env.TURNSTILE_SECRET_KEY;
    if (secretKey) {
      const formData = new URLSearchParams();
      formData.append("secret", secretKey);
      formData.append("response", turnstileToken);

      const turnstileRes = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          body: formData,
        }
      );

      // Cast hasil JSON Cloudflare ke TurnstileResponse
      const turnstileResult = (await turnstileRes.json()) as TurnstileResponse;

      if (!turnstileResult.success) {
        return Response.json(
          { error: "Verifikasi bot gagal. Silakan coba lagi." },
          { status: 400 }
        );
      }
    }

    // 3. Cek Konfigurasi Bot Telegram
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return Response.json(
        { error: "Konfigurasi Telegram Bot belum lengkap di server." },
        { status: 500 }
      );
    }

    // 4. Format pesan Telegram
    const cleanWA = wa ? wa.replace(/^0+/, "").replace(/^62+/, "") : "";

    const textPayload = 
      `🚨 *LAPORAN KENDALA LAB*\n\n` +
      `👤 *Pengirim:* ${name || "Anonim"}\n` +
      `${cleanWA ? `📱 *WhatsApp:* wa.me/62${cleanWA}\n` : ""}` +
      `📍 *Lab/Ruangan:* ${room || "Umum"}\n` +
      `💬 *Pesan:* ${message || "-"}\n\n` +
      `🕒 _Waktu: ${new Date().toLocaleString("id-ID")}_`;

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: textPayload,
        parse_mode: "Markdown",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Telegram Error:", errorData);
      return Response.json({ error: "Gagal mengirim ke Telegram." }, { status: 500 });
    }

    return Response.json({ success: true, message: "Pesan terkirim!" });
  } catch (error) {
    console.error("Server Error:", error);
    return Response.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}