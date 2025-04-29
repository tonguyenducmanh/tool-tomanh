import jsonSource from "../input/input.json" with { type: "json" };
import config from "../config/config.js";

// file tự viết
import { logFile, logFileWithOuputPath } from "./logFile.js";

import { buildScriptPostgreSQLScript } from "./buildScriptPostgreSQLScript.js";


/**
 * hàm chạy đầu tiên của tool
 */
export async function convertToPostgresSQL() {
  try {
    let source = buildSourceArray();
    if (source && Array.isArray(source)) {
      let script = buildScriptPostgreSQLScript(source, config);
      if (script) {
        await logFileWithOuputPath(script, config.outputGenScript);
      }
    }
  }catch (error) {
    await logFile(error, "runTool");
  }
}

/**
 * tạo ra mảng record để insert
 * @returns mảng record cần insert
 */
function buildSourceArray() {
  let source = [];
  if (jsonSource) {
    if (Array.isArray(jsonSource)) {
      source = jsonSource;
    } else {
      source = [jsonSource];
    }
  }
  return source;
}
