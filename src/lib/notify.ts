import 'server-only';

/** Best-effort email notification via Resend. Does nothing unless RESEND_API_KEY and NOTIFY_TO_EMAIL are set. */
export async function notifyByEmail(subject: string, text: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_TO_EMAIL;
  if (!key || !to) return;
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.NOTIFY_FROM_EMAIL || 'Thirsty Dreamer <onboarding@resend.dev>',
        to: [to],
        subject,
        text,
      }),
    });
  } catch (err) {
    console.error('Email notification failed', err);
  }
}
