#!/usr/bin/env node
/**
 * Playwright Test Generator
 * Đọc JSON Flow Schema → sinh ra file .spec.ts Playwright hoàn chỉnh
 * Template-based, deterministic — không dùng AI
 *
 * Usage: node test/generator/playwright-generator.js test/schemas/json-to-postgresql.schema.json test/generated/
 */

const fs = require("fs");
const path = require("path");

// ─── Màu terminal ────────────────────────────────────────────────────────────
const c = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
  bold: "\x1b[1m",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function indent(level, str) {
  return "  ".repeat(level) + str;
}

function escapeStr(str) {
  return str.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$");
}

// Lấy selector theo data-testid
function sel(testid) {
  return `page.locator('[data-testid="${testid}"]')`;
}

// ─── Action Code Generators ──────────────────────────────────────────────────
// Mỗi hàm nhận (step, testData) → trả về mảng dòng code

function gen_navigate(step, testData, schema) {
  const lines = [];
  lines.push(`// Step ${step.id}: navigate đến tool (Mô phỏng user click sidebar)`);
  lines.push(`await page.goto(BASE_URL);`);
  
  const toolName = schema.feature.replace(/-/g, "");
  
  if (schema.groupKey) {
    lines.push(`// Mở group ${schema.groupKey} trên sidebar`);
    lines.push(`await page.locator('[data-testid="menu-group-${schema.groupKey}"]').hover();`);
  }
  
  lines.push(`// Click chọn tool ${toolName}`);
  lines.push(`await page.locator('[data-testid="menu-item-${toolName}"]').click();`);
  // Đợi tab mở lên ổn định
  lines.push(`await page.waitForTimeout(500);`);
  
  return lines;
}

function gen_fill_input(step, testData) {
  const lines = [];
  const testid = step.target.testid;
  let value = "";
  if (step.data?.ref) {
    value = escapeStr(testData[step.data.ref] ?? "");
  } else if (step.data?.value !== undefined) {
    value = escapeStr(String(step.data.value));
  }
  lines.push(`// Step ${step.id}: fill_input → [data-testid="${testid}"]`);
  lines.push(`await ${sel(testid)}.locator('input').fill(\`${value}\`);`);
  if (step.expect?.value !== undefined) {
    lines.push(
      `await expect(${sel(testid)}.locator('input')).toHaveValue(\`${escapeStr(String(step.expect.value))}\`);`
    );
  }
  return lines;
}

function gen_fill_editor(step, testData) {
  const lines = [];
  const testid = step.target.testid;
  let value = "";
  if (step.data?.ref) {
    value = escapeStr(testData[step.data.ref] ?? "");
  } else if (step.data?.value !== undefined) {
    value = escapeStr(String(step.data.value));
  }
  lines.push(`// Step ${step.id}: fill_editor → [data-testid="${testid}"] (Monaco)`);
  // Monaco editor cần click trước rồi dùng keyboard để nhập
  lines.push(`const editor_${testid.replace(/-/g, "_")} = ${sel(testid)};`);
  lines.push(`await editor_${testid.replace(/-/g, "_")}.click();`);
  lines.push(`await page.keyboard.press('Control+a');`);
  lines.push(`await page.keyboard.type(\`${value}\`);`);
  if (step.expect?.has_content) {
    lines.push(`await expect(${sel(testid)}).not.toBeEmpty();`);
  }
  return lines;
}

function gen_click_button(step, testData) {
  const lines = [];
  const testid = step.target.testid;
  lines.push(`// Step ${step.id}: click_button → [data-testid="${testid}"]`);
  lines.push(`await ${sel(testid)}.click();`);

  if (step.expect?.toast_type) {
    const toastType = step.expect.toast_type; // "success" | "error"
    lines.push(
      `// Chờ toast message xuất hiện (type: ${toastType})`
    );
    lines.push(
      `await expect(page.locator('.td-toast-${toastType}')).toBeVisible({ timeout: 5000 });`
    );
  }

  if (step.expect?.element_has_content) {
    const outputTestid = step.expect.element_has_content;
    lines.push(
      `await expect(${sel(outputTestid)}).not.toBeEmpty();`
    );
  }

  if (step.expect?.output_contains) {
    const { testid: outTestid, text } = step.expect.output_contains;
    lines.push(
      `await expect(${sel(outTestid)}).toContainText(\`${escapeStr(text)}\`);`
    );
  }

  if (step.expect?.clipboard_has_content) {
    lines.push(`await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);`);
    lines.push(`await page.waitForTimeout(200);`);
    lines.push(`const clipboardText = await page.evaluate(() => navigator.clipboard.readText());`);
    lines.push(`expect(clipboardText.length).toBeGreaterThan(0);`);
  }

  return lines;
}

function gen_toggle_switch(step, testData) {
  const lines = [];
  const testid = step.target.testid;
  const targetValue = step.data?.value ?? true;
  lines.push(
    `// Step ${step.id}: toggle_switch → [data-testid="${testid}"] = ${targetValue}`
  );
  // TDCheckbox switch variant: click vào button bên trong
  lines.push(
    `const switchBtn_${testid.replace(/-/g, "_")} = ${sel(testid)}.locator('button.td-theme-toggle-switch');`
  );
  // Chỉ click nếu trạng thái hiện tại khác targetValue
  if (targetValue === true) {
    lines.push(
      `const isActive_${testid.replace(/-/g, "_")} = await ${sel(testid)}.locator('.td-switch-dark').count() > 0;`
    );
    lines.push(
      `if (!isActive_${testid.replace(/-/g, "_")}) { await switchBtn_${testid.replace(/-/g, "_")}.click(); }`
    );
  } else {
    lines.push(
      `const isActive_${testid.replace(/-/g, "_")} = await ${sel(testid)}.locator('.td-switch-dark').count() > 0;`
    );
    lines.push(
      `if (isActive_${testid.replace(/-/g, "_")}) { await switchBtn_${testid.replace(/-/g, "_")}.click(); }`
    );
  }

  if (step.expect?.checked !== undefined) {
    if (step.expect.checked) {
      lines.push(
        `await expect(${sel(testid)}.locator('.td-switch-dark')).toBeVisible();`
      );
    } else {
      lines.push(
        `await expect(${sel(testid)}.locator('.td-switch-dark')).not.toBeVisible();`
      );
    }
  }
  return lines;
}

function gen_check_checkbox(step, testData) {
  const lines = [];
  const testid = step.target.testid;
  const checked = step.data?.value ?? true;
  lines.push(
    `// Step ${step.id}: check_checkbox → [data-testid="${testid}"] = ${checked}`
  );
  lines.push(
    `await ${sel(testid)}.locator('input[type="checkbox"]').setChecked(${checked});`
  );
  if (step.expect?.checked !== undefined) {
    lines.push(
      `await expect(${sel(testid)}.locator('input[type="checkbox"]')).${step.expect.checked ? "" : "not."}toBeChecked();`
    );
  }
  return lines;
}

function gen_select_combobox(step, testData) {
  const lines = [];
  const testid = step.target.testid;
  let value = "";
  if (step.data?.ref) {
    value = escapeStr(testData[step.data.ref] ?? "");
  } else if (step.data?.value !== undefined) {
    value = escapeStr(String(step.data.value));
  }
  lines.push(
    `// Step ${step.id}: select_combobox → [data-testid="${testid}"] chọn "${value}"`
  );
  // TDComboBox: click wrapper để mở dropdown, sau đó click option
  lines.push(`await ${sel(testid)}.locator('.td-combobox-control').click();`);
  lines.push(
    `await ${sel(testid)}.locator('.td-dropdown-item', { hasText: \`${value}\` }).click();`
  );
  return lines;
}

function gen_select_radio(step, testData) {
  const lines = [];
  const testid = step.target.testid;
  let value = "";
  if (step.data?.ref) {
    value = escapeStr(testData[step.data.ref] ?? "");
  } else if (step.data?.value !== undefined) {
    value = escapeStr(String(step.data.value));
  }
  lines.push(
    `// Step ${step.id}: select_radio → [data-testid="${testid}"] chọn value "${value}"`
  );
  lines.push(
    `await ${sel(testid)}.locator(\`input[value="${value}"]\`).click();`
  );
  return lines;
}

function gen_upload_file(step, testData) {
  const lines = [];
  const testid = step.target.testid;
  let filePath = step.data?.value || step.data?.ref || "test/fixtures/sample.json";
  lines.push(`// Step ${step.id}: upload_file → [data-testid="${testid}"]`);
  lines.push(
    `await ${sel(testid)}.locator('input[type="file"]').setInputFiles(\`${escapeStr(filePath)}\`);`
  );
  return lines;
}

function gen_assert_text(step, testData) {
  const lines = [];
  const testid = step.target.testid;
  let text = step.data?.value || step.data?.ref || "";
  lines.push(`// Step ${step.id}: assert_text → [data-testid="${testid}"]`);
  lines.push(
    `await expect(${sel(testid)}).toContainText(\`${escapeStr(String(text))}\`);`
  );
  return lines;
}

function gen_assert_visible(step) {
  const lines = [];
  const testid = step.target.testid;
  lines.push(`// Step ${step.id}: assert_visible → [data-testid="${testid}"]`);
  lines.push(`await expect(${sel(testid)}).toBeVisible();`);
  return lines;
}

function gen_assert_hidden(step) {
  const lines = [];
  const testid = step.target.testid;
  lines.push(`// Step ${step.id}: assert_hidden → [data-testid="${testid}"]`);
  lines.push(`await expect(${sel(testid)}).not.toBeVisible();`);
  return lines;
}

function gen_assert_toast(step) {
  const lines = [];
  const toastType = step.data?.value || "success";
  lines.push(`// Step ${step.id}: assert_toast → type="${toastType}"`);
  lines.push(
    `await expect(page.locator('.td-toast-${toastType}')).toBeVisible({ timeout: 5000 });`
  );
  return lines;
}

// ─── Action Dispatcher ────────────────────────────────────────────────────────
function generateStepCode(step, testData, schema) {
  switch (step.action) {
    case "navigate":
      return gen_navigate(step, testData, schema);
    case "fill_input":
      return gen_fill_input(step, testData);
    case "fill_editor":
      return gen_fill_editor(step, testData);
    case "click_button":
      return gen_click_button(step, testData);
    case "toggle_switch":
      return gen_toggle_switch(step, testData);
    case "check_checkbox":
      return gen_check_checkbox(step, testData);
    case "select_combobox":
      return gen_select_combobox(step, testData);
    case "select_radio":
      return gen_select_radio(step, testData);
    case "upload_file":
      return gen_upload_file(step, testData);
    case "assert_text":
      return gen_assert_text(step, testData);
    case "assert_visible":
      return gen_assert_visible(step);
    case "assert_hidden":
      return gen_assert_hidden(step);
    case "assert_toast":
      return gen_assert_toast(step);
    default:
      return [`// [UNKNOWN ACTION] ${step.action} — bỏ qua`];
  }
}

// ─── Generate toàn bộ file .spec.ts ──────────────────────────────────────────
function generateSpecFile(schema) {
  const lines = [];

  // Header
  lines.push(`// ============================================================`);
  lines.push(`// AUTO-GENERATED by test/generator/playwright-generator.js`);
  lines.push(`// Feature : ${schema.feature}`);
  lines.push(`// PBI     : ${schema.pbi_ref}`);
  lines.push(`// Version : ${schema.version}`);
  lines.push(`// DO NOT EDIT MANUALLY — Chỉnh sửa schema rồi gen lại`);
  lines.push(`// ============================================================`);
  lines.push(``);
  lines.push(`import { test, expect } from '@playwright/test';`);
  lines.push(``);
  lines.push(`const BASE_URL = process.env.BASE_URL || '${schema.base_url}';`);
  lines.push(``);

  // Describe block
  lines.push(
    `test.describe('[${schema.pbi_ref}] ${schema.description}', () => {`
  );
  lines.push(``);

  // Sinh test case cho từng flow
  for (const flow of schema.flows) {
    const testData = flow.test_data || {};
    const tag = flow.type === "happy_path" ? "@happy" : "@negative";

    lines.push(
      indent(
        1,
        `test('${flow.id} – ${flow.name} ${tag}', async ({ page }) => {`
      )
    );

    for (const step of flow.steps) {
      const stepLines = generateStepCode(step, testData, schema);
      for (const line of stepLines) {
        lines.push(indent(2, line));
      }
      lines.push(""); // khoảng trống giữa các step
    }

    lines.push(indent(1, `});`));
    lines.push(``);
  }

  lines.push(`});`);
  lines.push(``);

  return lines.join("\n");
}

// ─── Entry point ──────────────────────────────────────────────────────────────
const schemaPath = process.argv[2];
const outputDir = process.argv[3] || "test/generated";

if (!schemaPath) {
  console.error(
    "Usage: node test/generator/playwright-generator.js <schema.json> [output-dir]"
  );
  process.exit(1);
}

const absSchema = path.resolve(schemaPath);
if (!fs.existsSync(absSchema)) {
  console.error(`Schema không tồn tại: ${absSchema}`);
  process.exit(1);
}

let schema;
try {
  schema = JSON.parse(fs.readFileSync(absSchema, "utf-8"));
} catch (e) {
  console.error(`JSON không hợp lệ: ${e.message}`);
  process.exit(1);
}

// Tạo output dir nếu chưa có
const absOutputDir = path.resolve(outputDir);
if (!fs.existsSync(absOutputDir)) {
  fs.mkdirSync(absOutputDir, { recursive: true });
}

const specContent = generateSpecFile(schema);
const outputFileName = `${schema.feature}.spec.ts`;
const outputPath = path.join(absOutputDir, outputFileName);
fs.writeFileSync(outputPath, specContent, "utf-8");

console.log(
  `\n${c.green}${c.bold}✓ Generated:${c.reset} ${path.relative(process.cwd(), outputPath)}`
);
console.log(`  ${c.gray}Features : ${schema.feature}${c.reset}`);
console.log(`  ${c.gray}Flows    : ${schema.flows.length}${c.reset}`);
const totalSteps = schema.flows.reduce((acc, f) => acc + f.steps.length, 0);
console.log(`  ${c.gray}Steps    : ${totalSteps}${c.reset}`);
console.log(
  `\nChạy test: npx playwright test ${path.relative(process.cwd(), outputPath)}\n`
);
