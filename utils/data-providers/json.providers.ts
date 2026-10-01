import { readFile } from "node:fs/promises";
import path from "node:path";

export default class JsonProvider {

    private readonly filePath: string;
    constructor(filePath: string) {
        // Resolve relative paths from the directory where the command is run.
        this.filePath = path.resolve(filePath);
    }
    
    async getJsonData() {
        const content = await readFile(this.filePath, "utf8");
        return JSON.parse(content);
    }
  
}

