#!/usr/bin/env node
/**
 * data-testid Checker
 * Đọc schema JSON → lấy required_testids → quét tất cả file .vue trong src/
 * → báo cáo testid nào còn thiếu, testid nào thừa (có trong code nhưng không có trong schema)
 *
 * Usage: node test/checker/testid-checker.js test/schemas/json-to-postgresql.schema.json src/
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
  gray: "\x1b[90m",
  bold: "\x1b[1m",
};

// ─── Đọc tất cả file .vue đệ quy ─────────────────────────────────────────────
function getAllVueFiles(dir, result = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Bỏ qua node_modules
      if (entry.name === "node_modules") continue;
      getAllVueFiles(fullPath, result);
    } else if (entry.isFile() && entry.name.endsWith(".vue")) {
      result.push(fullPath);
    }
  }
  return result;
}

// ─── Parse data-testid từ nội dung file Vue ──────────────────────────────────
// Tìm cả 2 dạng: data-testid="abc" và :data-testid="'abc'" hoặc data-testid='abc'
function extractTestIds(content) {
  const found = new Set();

  // Dạng tĩnh: data-testid="abc" hoặc data-testid='abc'
  const staticRegex = /data-testid=["']([^"']+)["']/g;
  let match;
  while ((match = staticRegex.exec(content)) !== null) {
    found.add(match[1]);
  }

  // Dạng binding tĩnh: :data-testid="'abc'"
  const bindStaticRegex = /:data-testid="'([^']+)'"/g;
  while ((match = bindStaticRegex.exec(content)) !== null) {
    found.add(match[1]);
  }

  return found;
}

// ─── Main ────────────────────────────────────────────────────────────────────
function checkTestIds(schemaPath, srcDir) {
  // Đọc schema
  const absSchemaPath = path.resolve(schemaPath);
  if (!fs.existsSync(absSchemaPath)) {
    console.error(`Schema không tồn tại: ${absSchemaPath}`);
    process.exit(1);
  }

  let schema;
  try {
    schema = JSON.parse(fs.readFileSync(absSchemaPath, "utf-8"));
  } catch (e) {
    console.error(`JSON schema không hợp lệ: ${e.message}`);
    process.exit(1);
  }

  const requiredTestIds = new Set(schema.required_testids || []);
  const feature = schema.feature || "unknown";

  console.log(`\n${c.bold}${c.cyan}data-testid Checker${c.reset}`);
  console.log(`Feature  : ${c.bold}${feature}${c.reset}`);
  console.log(`Schema   : ${schemaPath}`);
  console.log(`Src dir  : ${srcDir}`);
  console.log(`Required : ${requiredTestIds.size} testid(s)\n`);

  // Quét file .vue
  const absSrcDir = path.resolve(srcDir);
  if (!fs.existsSync(absSrcDir)) {
    console.error(`Thư mục src không tồn tại: ${absSrcDir}`);
    process.exit(1);
  }

  const vueFiles = getAllVueFiles(absSrcDir);
  console.log(
    `${c.gray}Đang quét ${vueFiles.length} file .vue...${c.reset}\n`
  );

  // Thu thập tất cả testid tìm thấy trong code (kèm file chứa nó)
  const foundTestIds = new Map(); // testid → [filePath, ...]
  for (const filePath of vueFiles) {
    const content = fs.readFileSync(filePath, "utf-8");
    const ids = extractTestIds(content);
    for (const id of ids) {
      if (!foundTestIds.has(id)) {
        foundTestIds.set(id, []);
      }
      foundTestIds.get(id).push(path.relative(process.cwd(), filePath));
    }
  }

  // ─── So sánh ─────────────────────────────────────────────────────────────
  const missing = []; // có trong schema, chưa có trong code
  const found = []; // có trong schema VÀ có trong code

  for (const id of requiredTestIds) {
    if (foundTestIds.has(id)) {
      found.push({ id, files: foundTestIds.get(id) });
    } else {
      missing.push(id);
    }
  }

  // testid có trong code nhưng không khai báo trong schema (cảnh báo tham khảo)
  const extra = [];
  for (const [id, files] of foundTestIds) {
    if (!requiredTestIds.has(id)) {
      extra.push({ id, files });
    }
  }

  // ─── Báo cáo ─────────────────────────────────────────────────────────────
  console.log(`${c.bold}[✓] Đã cấy đúng (${found.length}/${requiredTestIds.size})${c.reset}`);
  for (const { id, files } of found) {
    console.log(`  ${c.green}✓${c.reset} ${id}`);
    for (const f of files) {
      console.log(`      ${c.gray}→ ${f}${c.reset}`);
    }
  }

  if (missing.length > 0) {
    console.log(
      `\n${c.bold}${c.red}[✗] Còn thiếu – DEV chưa cấy (${missing.length})${c.reset}`
    );
    for (const id of missing) {
      console.log(`  ${c.red}✗${c.reset} ${id}`);
    }
  }

  if (extra.length > 0) {
    console.log(
      `\n${c.bold}${c.yellow}[⚠] Thừa – có trong code nhưng không có trong schema (${extra.length})${c.reset}`
    );
    for (const { id, files } of extra) {
      console.log(`  ${c.yellow}⚠${c.reset} ${id}`);
      for (const f of files) {
        console.log(`      ${c.gray}→ ${f}${c.reset}`);
      }
    }
  }

  // ─── Tổng kết ─────────────────────────────────────────────────────────────
  console.log("\n" + "─".repeat(50));
  const coverage = Math.round((found.length / requiredTestIds.size) * 100);
  if (missing.length === 0) {
    console.log(
      `${c.green}${c.bold}✓ Coverage 100% — DEV đã cấy đủ tất cả data-testid!${c.reset}`
    );
  } else {
    console.log(
      `${c.red}${c.bold}✗ Coverage ${coverage}% — Còn ${missing.length} testid chưa được cấy!${c.reset}`
    );
    process.exit(1);
  }
}

// ─── Entry point ──────────────────────────────────────────────────────────────
const schemaPath = process.argv[2];
const srcDir = process.argv[3] || "src";

if (!schemaPath) {
  console.error(
    "Usage: node test/checker/testid-checker.js <schema.json> [src-dir]"
  );
  process.exit(1);
}

checkTestIds(schemaPath, srcDir);
