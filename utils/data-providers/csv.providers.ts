import path from "path";
import fs from "fs";
import { parse } from "csv-parse/sync";


export default class CsvProviders {
    

  static getCsvData(fileName: string): string {
    return fs.readFileSync(
      path.resolve(__dirname, `./data-test/${fileName}.csv`),
      "utf8",
    );
  }

  static getCsvDataByRow(fileName: string, row: number): string {
    return fs
      .readFileSync(
        path.resolve(__dirname, `./data-test/${fileName}.csv`),
        "utf8",
      )
      .split("\n")[row];
  }

  static getCsvDataByColumn(fileName: string, column: number): string[] {
    /**
     * Hàm getCsvDataByColumn đọc dữ liệu từ file CSV và trả về một mảng các giá trị của cột được chỉ định.
     * hàm resolve được sử dụng để tạo đường dẫn tuyệt đối đến file CSV dựa trên __dirname và tên file được cung cấp.
     * hàm readFileSync được sử dụng để đọc nội dung của file CSV dưới dạng chuỗi UTF-8.
     * Kết quả trả về của hàm readFileSync được tách thành các dòng bằng cách sử dụng phương thức split("\n").
     * Và kiểu dữ liệu của hàm readFileSync là string, sau đó mỗi dòng được tách thành các giá trị bằng cách sử dụng phương thức split(",") và lấy giá trị của cột được chỉ định bằng cách sử dụng chỉ số cột.
     */
    const data = fs
      .readFileSync(
        path.resolve(__dirname, `./data-test/${fileName}.csv`),
        "utf8",
      )
      .split("\n");
    return data.map((row) => row.split(",")[column]);
  }

  static getCsvDataByColumnAndRow(
    fileName: string,
    column: number,
    row: number,
  ): string {
    const data = fs
      .readFileSync(
        path.resolve(__dirname, `./data-test/${fileName}.csv`),
        "utf8",
      )
      .split("\n");
    return data[row].split(",")[column];
  }

  static getCsvDataByColumnAndRowWithHeader(
    fileName: string,
    columnName: string,
    row: number,
  ): string {
    const data = fs
      .readFileSync(
        path.resolve(__dirname, `./data-test/${fileName}.csv`),
        "utf8",
      )
      .split("\n");
    const headers = data[0].split(",");
    const columnIndex = headers.indexOf(columnName);
    return data[row].split(",")[columnIndex];
  }

  static getCsvDataByColumnAndRowWithHeaderAndValue(
    fileName: string,
    columnName: string,
    row: number,
    value: string,
  ): boolean {
    const data = fs
      .readFileSync(
        path.resolve(__dirname, `./data-test/${fileName}.csv`),
        "utf8",
      )
      .split("\n");
    const headers = data[0].split(",");
    const columnIndex = headers.indexOf(columnName);
    return data[row].split(",")[columnIndex] === value;
  }

  static parseCsvData(fileName: string): Record<string, string>[] {
    const content = fs
      .readFileSync(
        path.resolve(__dirname, `./data-test/${fileName}.csv`),
        "utf8",
      )
    return parse(content, {
      columns: true,
      skip_empty_lines: true,
      bom: true,
    });
  }
}

