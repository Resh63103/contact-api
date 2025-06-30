import fetch from 'node-fetch';

export async function sendSlackNotification({ webhookUrl, text }) {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) {
      throw new Error(`Slack webhook error: ${response.statusText}`);
    }
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
} 