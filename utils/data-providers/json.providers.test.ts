import { expect, test } from "vitest";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
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

test.each(["relative", "absolute"])("reads JSON data using a %s file path", async (pathType) => {
  const directory = await mkdtemp(path.join(tmpdir(), "json-provider-"));
  try {
    const filePath = path.join(directory, "data.json");
    await writeFile(filePath, '[{"name":"Demo","enabled":true}]', "utf8");
    const inputPath = pathType === "relative"
      ? path.relative(process.cwd(), filePath)
      : filePath;

    const data = await new JsonProvider(inputPath).getJsonData();

    expect(data).toEqual([{ name: "Demo", enabled: true }]);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
