import path from "node:path";
import process from "node:process";
import { authenticate } from "@google-cloud/local-auth";
import { google } from "googleapis";

export default class GGsheetProviders {
  static CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");
  readonly sheets: any;
  readonly auth: any;
  protected readonly SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

    constructor() {
      this.auth = authenticate({
        scopes: this.SCOPES,
        keyfilePath: GGsheetProviders.CREDENTIALS_PATH,
      });
      this.sheets = google.sheets({ version: "v4", auth: this.auth });
    }

    async getSheets() {
      const result = await this.sheets.spreadsheets.values.get({
        spreadsheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
        range: "Class Data!A2:E",
      });

      const rows = result.data.values;
      if (!rows || rows.length === 0) {
        console.log("No data found.");
        return;
      }
      console.log("Name, Major:");
      // Print the name and major of each student.
      rows.forEach((row: any[]) => {
        // Print columns A and E, which correspond to indices 0 and 4.
        console.log(`${row[0]}, ${row[4]}`);
      });
      return result.data.values;
    }
}








