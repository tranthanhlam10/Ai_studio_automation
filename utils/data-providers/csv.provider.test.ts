import { expect, test } from "vitest";
import CsvProviders from "./csv.providers";


test("Math.sqrt works for perfect squares", () => {
  expect(Math.sqrt(4)).toBe(2);
  expect(Math.sqrt(144)).toBe(12);
  expect(Math.sqrt(0)).toBe(0);
});


test("csvProviders.getCsvData", () => { 
  const data = CsvProviders.getCsvData("csv-test");
  console.log("Data:", data);
  console.log("Data-type:", typeof data);
  expect(CsvProviders.getCsvData("csv-test")).toBe("ID,Testname,Data\n1,Test đăng nhập thành công,lamtt\n2,Test đăng nhập thành công,giangnt\n3,Test đăng nhập thành công,nganltk\n");
});

test("csvProviders.getCsvDataByRow", () => { 
  const row1 = CsvProviders.getCsvDataByRow("csv-test", 1);
  console.log("Row 1:", row1);
  console.log("Data-type:", typeof row1);
  expect(CsvProviders.getCsvDataByRow("csv-test", 1)).toBe("1,Test đăng nhập thành công,lamtt\n");
});

test("csvProviders.getCsvDataByColumn", () => { 
  const column1 = CsvProviders.getCsvDataByColumn("csv-test", 3);
  console.log("Column 1:", column1);
  console.log("Data-type:", typeof column1);
  expect(CsvProviders.getCsvDataByColumn("csv-test", 1)).toEqual(["1", "2", "3"]);
});

// test("csvProviders.getCsvDataByColumnAndRow", () => { 
//   const column1 = CsvProviders.getCsvDataByColumnAndRow("csv-test", 3, 1);
//   console.log("Column 1:", column1);
//   console.log("Data-type:", typeof column1);
//   expect(CsvProviders.getCsvDataByColumnAndRow("csv-test", 3, 1)).toBe("Test đăng nhập thành công");
// });

// test("csvProviders.getCsvDataByColumnAndRowWithHeader", () => { 
//   const column1 = CsvProviders.getCsvDataByColumnAndRowWithHeader("csv-test", "Testname", 1);
//   console.log("Column 1:", column1);
//   console.log("Data-type:", typeof column1);
//   expect(CsvProviders.getCsvDataByColumnAndRowWithHeader("csv-test", "Testname", 1)).toBe("Test đăng nhập thành công");
// });

// test("csvProviders.getCsvDataByColumnAndRowWithHeaderAndValue", () => { 
//   const column1 = CsvProviders.getCsvDataByColumnAndRowWithHeaderAndValue("csv-test", "Testname", "Test đăng nhập thành công", 1);
//   console.log("Column 1:", column1);
//   console.log("Data-type:", typeof column1);
//   expect(CsvProviders.getCsvDataByColumnAndRowWithHeaderAndValue("csv-test", "Testname", "Test đăng nhập thành công", 1)).toBe("lamtt");
// });    

test("csvProviders.parseCsvData", () => { 
  const data = CsvProviders.parseCsvData("csv-test");
  console.log("Data:", data);
  console.log("Data-type:", typeof data);
  expect(CsvProviders.parseCsvData("csv-test")).toEqual([["ID", "Testname", "Data"], ["1", "Test đăng nhập thành công", "lamtt"], ["2", "Test đăng nhập thành công", "giangnt"], ["3", "Test đăng nhập thành công", "nganltk"]]);
});    


