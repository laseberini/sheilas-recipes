// Sheila's Recipes - Memories
// Paste into the Google Sheet's Extensions > Apps Script, run setup() once, then deploy as a web app
// (Execute as: Me, Who has access: Anyone). The site sends new memories here and reads approved ones.
// A memory only appears on the site once its "Approved" box is ticked in the sheet.

const SHEET = "Memories";
const HEAD = ["Submitted", "Recipe ID", "Recipe", "Name", "Memory", "Approved"];
const APPROVED_COL = 6;

function setup() {
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName(SHEET) || ss.insertSheet(SHEET, 0);
  sh.getRange(1, 1, 1, HEAD.length).setValues([HEAD]).setFontWeight("bold");
  sh.setFrozenRows(1);
  // (No checkboxes down the whole column: Sheets would count them as filled rows and add new
  // memories at the very bottom. Each new row gets its own checkbox in doPost.)
  sh.setColumnWidth(5, 480);
  sh.getRange("E:E").setWrap(true);
  const blank = ss.getSheetByName("Sheet1");
  if (blank && blank.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(blank);
}

function sheet_() {
  const sh = SpreadsheetApp.getActive().getSheetByName(SHEET);
  if (!sh) throw new Error("Run setup() first");
  return sh;
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

// What people type is stored as plain text (never as a formula) and kept to a sensible length.
function plain_(s, max) {
  s = String(s || "").replace(/\r/g, "").trim().slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

// A new memory from the site: added unticked, for the family to read first.
function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.website) return json_({ ok: true }); // the hidden field only robots fill in
    const id = String(d.recipe || "").replace(/[^\w-]/g, "").slice(0, 80);
    const name = plain_(d.name, 60);
    const text = plain_(d.text, 1500);
    if (!id || !name || !text) return json_({ ok: false, error: "Please add your name and your memory." });
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const sh = sheet_();
      sh.appendRow([new Date(), id, plain_(d.title, 120), name, text, false]);
      sh.getRange(sh.getLastRow(), APPROVED_COL).insertCheckboxes();
    } finally {
      lock.releaseLock();
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: "Sorry, that didn't send. Please try again." });
  }
}

// The approved memories, for the site (cached for a minute).
function doGet() {
  const cache = CacheService.getScriptCache();
  const hit = cache.get("approved");
  if (hit) return ContentService.createTextOutput(hit).setMimeType(ContentService.MimeType.JSON);
  const memories = sheet_().getDataRange().getValues().slice(1)
    .filter((r) => r[APPROVED_COL - 1] === true && r[1] && r[4])
    .map((r) => ({ recipe: String(r[1]), name: String(r[3]), text: String(r[4]), at: r[0] instanceof Date ? r[0].toISOString() : null }));
  const out = JSON.stringify({ ok: true, memories });
  cache.put("approved", out, 60);
  return ContentService.createTextOutput(out).setMimeType(ContentService.MimeType.JSON);
}
