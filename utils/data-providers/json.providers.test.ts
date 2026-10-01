import { expect, test } from "vitest";
import JsonProvider from "./json.providers";

test("Math.sqrt works for perfect squares", () => {
  expect(Math.sqrt(4)).toBe(2);
  expect(Math.sqrt(144)).toBe(12);
  expect(Math.sqrt(0)).toBe(0);
});

test("jsonProviders.getJsonData", async () => {
  const jsonProviders = new JsonProvider("./data/login-data.json");
  const data = await jsonProviders.getJsonData();
  console.log("Data:", data);
  expect(data).toBeDefined();
});

