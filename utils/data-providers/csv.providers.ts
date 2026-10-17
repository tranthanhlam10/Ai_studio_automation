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
     * getCsvDataByColumn reads a CSV file and returns the values from the specified column.
     * resolve builds an absolute path to the CSV file from __dirname and the supplied name.
     * readFileSync reads the CSV file as a UTF-8 string.
     * The returned string is split into rows with split("\n").
     * Each row is split into values with split(","), then the selected column is read by index.
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

