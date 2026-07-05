#!/usr/bin/env node
/**
 * Schema Validator
 * Kiểm tra một JSON Flow Schema có đúng format không
 * Usage: node test/validator/schema-validator.js test/schemas/json-to-postgresql.schema.json
 */

const fs = require("fs");
const path = require("path");

// ─── Màu terminal ────────────────────────────────────────────────────────────
const c = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
};

const VALID_ACTIONS = [
  "navigate",
  "fill_input",
  "fill_editor",
  "click_button",
  "toggle_switch",
  "check_checkbox",
  "select_combobox",
  "select_radio",
  "upload_file",
  "assert_text",
  "assert_visible",
  "assert_hidden",
  "assert_toast",
];

const VALID_FLOW_TYPES = ["happy_path", "negative_path"];

const REQUIRED_ROOT_FIELDS = [
  "feature",
  "version",
  "pbi_ref",
  "description",
  "base_url",
  "route",
  "required_testids",
  "flows",
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function error(msg) {
  console.error(`  ${c.red}✗${c.reset} ${msg}`);
}

function warn(msg) {
  console.warn(`  ${c.yellow}⚠${c.reset} ${msg}`);
}

function ok(msg) {
  console.log(`  ${c.green}✓${c.reset} ${msg}`);
}

// ─── Validate ────────────────────────────────────────────────────────────────
function validateSchema(schema, filePath) {
  let errorCount = 0;
  let warnCount = 0;

  console.log(`\n${c.bold}${c.cyan}Validating:${c.reset} ${filePath}\n`);

  // 1. Kiểm tra các trường bắt buộc ở root
  console.log(`${c.bold}[1] Root fields${c.reset}`);
  for (const field of REQUIRED_ROOT_FIELDS) {
    if (schema[field] === undefined || schema[field] === null) {
      error(`Thiếu trường bắt buộc: "${field}"`);
      errorCount++;
    } else {
      ok(`"${field}" tồn tại`);
    }
  }

  // 2. Kiểm tra required_testids
  console.log(`\n${c.bold}[2] required_testids${c.reset}`);
  if (Array.isArray(schema.required_testids)) {
    if (schema.required_testids.length === 0) {
      warn("required_testids rỗng — feature này không có element tương tác?");
      warnCount++;
    } else {
      const invalidIds = schema.required_testids.filter(
        (id) => typeof id !== "string" || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)
      );
      if (invalidIds.length > 0) {
        error(
          `Các testid không đúng format kebab-case: ${invalidIds.join(", ")}`
        );
        errorCount++;
      } else {
        ok(`${schema.required_testids.length} testid hợp lệ (kebab-case)`);
      }
    }
  }

  // 3. Kiểm tra flows
  console.log(`\n${c.bold}[3] Flows${c.reset}`);
  if (!Array.isArray(schema.flows) || schema.flows.length === 0) {
    error("Không có flow nào được định nghĩa");
    errorCount++;
  } else {
    const hasHappyPath = schema.flows.some((f) => f.type === "happy_path");
    if (!hasHappyPath) {
      warn("Không có flow nào kiểu happy_path");
      warnCount++;
    }

    const flowIds = new Set();
    for (const flow of schema.flows) {
      // Kiểm tra id
      if (!flow.id) {
        error(`Một flow thiếu trường "id"`);
        errorCount++;
        continue;
      }
      if (flowIds.has(flow.id)) {
        error(`ID flow trùng lặp: "${flow.id}"`);
        errorCount++;
      }
      flowIds.add(flow.id);

      // Kiểm tra type
      if (!VALID_FLOW_TYPES.includes(flow.type)) {
        error(
          `Flow "${flow.id}": type không hợp lệ "${flow.type}". Cho phép: ${VALID_FLOW_TYPES.join(", ")}`
        );
        errorCount++;
      }

      // Kiểm tra name
      if (!flow.name || typeof flow.name !== "string") {
        error(`Flow "${flow.id}": thiếu trường "name"`);
        errorCount++;
      }

      // Kiểm tra steps
      if (!Array.isArray(flow.steps) || flow.steps.length === 0) {
        error(`Flow "${flow.id}": không có bước nào (steps rỗng)`);
        errorCount++;
        continue;
      }

      // Kiểm tra từng step
      const stepIds = new Set();
      for (const step of flow.steps) {
        if (!step.id) {
          error(`Flow "${flow.id}": một step thiếu trường "id"`);
          errorCount++;
          continue;
        }
        if (stepIds.has(step.id)) {
          error(`Flow "${flow.id}", Step "${step.id}": ID step trùng lặp`);
          errorCount++;
        }
        stepIds.add(step.id);

        // Kiểm tra action
        if (!VALID_ACTIONS.includes(step.action)) {
          error(
            `Flow "${flow.id}", Step "${step.id}": action không hợp lệ "${step.action}"`
          );
          error(`  → Các action hợp lệ: ${VALID_ACTIONS.join(", ")}`);
          errorCount++;
        }

        // Kiểm tra target
        if (!step.target || typeof step.target !== "object") {
          error(
            `Flow "${flow.id}", Step "${step.id}": thiếu hoặc sai định dạng "target"`
          );
          errorCount++;
        } else if (
          step.action !== "navigate" &&
          step.target.testid === undefined
        ) {
          error(
            `Flow "${flow.id}", Step "${step.id}": action "${step.action}" cần target.testid`
          );
          errorCount++;
        } else if (
          step.action !== "navigate" &&
          step.target.testid !== null &&
          !schema.required_testids.includes(step.target.testid)
        ) {
          // testid dùng trong step nhưng không khai báo trong required_testids
          warn(
            `Flow "${flow.id}", Step "${step.id}": testid "${step.target.testid}" không có trong required_testids`
          );
          warnCount++;
        }

        // Kiểm tra step có data.ref thì test_data phải có key đó
        if (step.data?.ref) {
          const testData = flow.test_data || {};
          if (!testData.hasOwnProperty(step.data.ref)) {
            error(
              `Flow "${flow.id}", Step "${step.id}": data.ref "${step.data.ref}" không tồn tại trong test_data`
            );
            errorCount++;
          }
        }
      }

      ok(
        `Flow "${flow.id}" (${flow.type}): ${flow.steps.length} bước — OK`
      );
    }
  }

  // ─── Kết quả ───────────────────────────────────────────────────────────────
  console.log("\n" + "─".repeat(50));
  if (errorCount === 0 && warnCount === 0) {
    console.log(`${c.green}${c.bold}✓ Schema hợp lệ hoàn toàn!${c.reset}`);
  } else if (errorCount === 0) {
    console.log(
      `${c.yellow}${c.bold}⚠ Schema hợp lệ nhưng có ${warnCount} cảnh báo${c.reset}`
    );
  } else {
    console.log(
      `${c.red}${c.bold}✗ Schema KHÔNG hợp lệ: ${errorCount} lỗi, ${warnCount} cảnh báo${c.reset}`
    );
    process.exit(1);
  }
}

// ─── Entry point ─────────────────────────────────────────────────────────────
const schemaPath = process.argv[2];
if (!schemaPath) {
  console.error(
    "Usage: node test/validator/schema-validator.js <path-to-schema.json>"
  );
  process.exit(1);
}

const absPath = path.resolve(schemaPath);
if (!fs.existsSync(absPath)) {
  console.error(`File không tồn tại: ${absPath}`);
  process.exit(1);
}

let schema;
try {
  schema = JSON.parse(fs.readFileSync(absPath, "utf-8"));
} catch (e) {
  console.error(`JSON không hợp lệ: ${e.message}`);
  process.exit(1);
}

validateSchema(schema, schemaPath);
