import { buildScriptPostgreSQLScript } from "./buildScriptPostgreSQLScript.js";

// --- DOM Elements ---
const jsonInput = document.getElementById("jsonInput");
const convertButton = document.getElementById("convertButton");
const sqlOutput = document.getElementById("sqlOutput");
const tableNameInput = document.getElementById("tableName");
const schemaNameInput = document.getElementById("schemaName");
const primaryKeyFieldInput = document.getElementById("primaryKeyField");

// --- State ---
let jsonData = null;

// --- Configuration (Hardcoded for now - Adapt based on original config.js) ---
const webConfig = {
  tableName: "your_table", // Default table name (from original config)
  schemaName: null, // Default schema (optional, from original config)
  primaryKeyField: null, // Set to the primary key column name to enable DELETE script (e.g., 'id')
  enableCreateTable: false, // Set to true to generate CREATE TABLE script
  // Add other config parameters here if needed, based on original config.js
  // e.g., dateTimeFormat, specific column handling rules
};
// --- Event Listeners ---

// Listener for the convert button click
convertButton.addEventListener("click", handleConvert);

// --- Functions ---

/**
 * Handles the file selection event. Reads the file content.
/**
 * Handles the conversion process when the button is clicked.
 */
function handleConvert() {
  try {
    jsonData = JSON.parse(jsonInput.value);
  } catch (error) {
    sqlOutput.value = `Lỗi phân tích cú pháp JSON: ${error.message}\n\nVui lòng kiểm tra định dạng JSON của bạn.`;
    jsonData = null;
    return;
  }

  if (!jsonData) {
    sqlOutput.value = "Lỗi: Vui lòng nhập một JSON hợp lệ trước.";
    return;
  }

  // Get values from input fields
  const tableName = tableNameInput.value;
  const schemaName = schemaNameInput.value;
  const primaryKeyField = primaryKeyFieldInput.value;

  // Update config
  webConfig.tableName = tableName;
  webConfig.schemaName = schemaName;
  webConfig.primaryKeyField = primaryKeyField;

  try {
    // Call the main conversion function
    const sqlScript = convertToPostgresSQL(jsonData, webConfig);
    sqlOutput.value = sqlScript;
  } catch (error) {
    console.error("Conversion Error:", error); // Log detailed error to console
    sqlOutput.value = `Lỗi trong quá trình chuyển đổi: ${error.message}\n\nKiểm tra console (F12) để biết thêm chi tiết.`;
  }
}

/**
 * Converts parsed JSON data into PostgreSQL INSERT statements.
 * (This function needs to be adapted from the original src/convertToPostgresSQL.js)
 *
 * @param {object|array} data - The parsed JSON data.
 * @param {object} config - Configuration object (tableName, schemaName, etc.).
 * @returns {string} The generated SQL INSERT script.
 */
function convertToPostgresSQL(source, config) {
  let result = null;
  try {
    if (source && Array.isArray(source)) {
      result = buildScriptPostgreSQLScript(source, config);
    }
  } catch (error) {
    console.error("Error in convertToPostgresSQL:", error);
  }
  return result;
}
