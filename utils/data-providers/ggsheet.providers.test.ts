
import { expect, test } from "vitest";
import GGsheetProviders from "./ggsheet.providers";

test("Math.sqrt works for perfect squares", () => {
  expect(Math.sqrt(4)).toBe(2);
  expect(Math.sqrt(144)).toBe(12);
  expect(Math.sqrt(0)).toBe(0);
});

test("ggsheetProviders.getGgsheetData", async () => {
  const ggsheetProviders = new GGsheetProviders();
  const data = await ggsheetProviders.getSheets();
  console.log("Data:", data);
  console.log("Data-type:", typeof data);
  expect(data).toBeDefined();
});