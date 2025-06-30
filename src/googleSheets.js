import { google } from 'googleapis';

export async function appendToSheet({
  serviceAccountJson,
  spreadsheetId,
  values,
  sheetName = 'contact',
}) {
  try {
    const credentials = JSON.parse(serviceAccountJson);
    const scopes = ['https://www.googleapis.com/auth/spreadsheets'];
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes,
    });
    const sheets = google.sheets({ version: 'v4', auth });
    const range = `'${sheetName}'!A1`;
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [values],
      },
    });
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
} 