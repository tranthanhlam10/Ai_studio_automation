import { readFile } from "node:fs/promises";
import path from "node:path";
import fs from "fs";

type ValidationResult =
  | { valid: true; data: unknown[] }
  | { valid: false; reason: string };

export default class JsonProvider {
  private readonly filePath: string;
  constructor(filePath: string) {
    this.filePath = path.resolve(filePath);
  }

  async getJsonData() {
    const validationResult = this.validateJsonArrayFile(this.filePath);
    if (!validationResult.valid) {
      throw new Error(validationResult.reason);
    }
    const content = await readFile(this.filePath, "utf8");
    return JSON.parse(content);
  }

  validateJsonArrayFile(filePath: string): ValidationResult {
    if (!fs.existsSync(filePath)) {
      return { valid: false, reason: `File not found: ${filePath}` };
    }

    const raw = fs.readFileSync(filePath, "utf-8");

    if (raw.trim().length === 0) {
      return { valid: false, reason: `File is empty: ${filePath}` };
    }

    let data: unknown;
    try {
      data = JSON.parse(raw);
    } catch (error) {
      return {
        valid: false,
        reason: `Invalid JSON format: ${(error as Error).message}`,
      };
    }

    if (!Array.isArray(data)) {
      return {
        valid: false,
        reason: `Expected a JSON array, received: ${typeof data}`,
      };
    }

    if (data.length === 0) {
      return { valid: false, reason: `JSON array is empty` };
    }

    return { valid: true, data };
  }
}
