/**
 * Wedding RSVP endpoint — Google Apps Script web app.
 *
 * Tab "RSVP" (one row per browser submission, updated in place when a guest changes their answer):
 *   Guest Name | Status | Count of Members | <one column per meal> | Updated Date | Submission ID
 * Tab "Summary": live totals (guests attending, each meal, declined, not sure).
 *
 * Deploy: Deploy → New deployment → Web app → Execute as: Me, Who has access: Anyone.
 * The endpoint only writes. It never returns sheet contents; the sheet itself stays private.
 */

var SHEET_NAME = 'RSVP';
var SUMMARY_NAME = 'Summary';
var MAX_ATTENDEES = 15;          // keep in sync with rsvp.maxAttendees in src/config/wedding.ts
// Keep ids in sync with rsvp.meals in src/config/wedding.ts. Labels become column headers.
var MEALS = [
  { id: 'beef-biriyani', label: 'Beef biriyani' },
  { id: 'neychoru-stew', label: 'Neychoru + stew curry' },
];
var MAX_NAME_LENGTH = 60;
var MAX_BODY_LENGTH = 2000;
var MAX_WRITES_PER_ID = 10;      // per 10 minutes, simple abuse protection
var STATUS_LABELS = { attending: 'Attending', declined: 'Declined', maybe: 'Not sure yet' };

function headers() {
  return ['Guest Name', 'Status', 'Count of Members']
    .concat(MEALS.map(function (m) { return m.label; }))
    .concat(['Updated Date', 'Submission ID']);
}

function doPost(e) {
  try {
    var body = e && e.postData && e.postData.contents;
    if (!body || body.length > MAX_BODY_LENGTH) return reply(false, 'Invalid request.');

    var data;
    try {
      data = JSON.parse(body);
    } catch (err) {
      return reply(false, 'Invalid request.');
    }
    if (!data || typeof data !== 'object') return reply(false, 'Invalid request.');

    // Honeypot: real browsers send an empty string.
    if (data.website) return reply(false, 'Invalid request.');

    var submissionId = String(data.submissionId || '');
    if (!/^[A-Za-z0-9-]{8,64}$/.test(submissionId)) return reply(false, 'Invalid request.');

    var status = String(data.status || '');
    if (!STATUS_LABELS.hasOwnProperty(status)) return reply(false, 'Invalid response.');

    var count = 0;
    var mealCounts = MEALS.map(function () { return 0; });

    if (status === 'attending') {
      count = Number(data.count);
      if (!isInteger(count) || count < 1 || count > MAX_ATTENDEES) return reply(false, 'Invalid attendee count.');

      var meals = data.meals;
      if (!meals || typeof meals !== 'object' || Array.isArray(meals)) return reply(false, 'Invalid meal choices.');
      var total = 0;
      for (var i = 0; i < MEALS.length; i++) {
        var q = meals[MEALS[i].id] == null ? 0 : Number(meals[MEALS[i].id]);
        if (!isInteger(q) || q < 0 || q > MAX_ATTENDEES) return reply(false, 'Invalid meal choices.');
        mealCounts[i] = q;
        total += q;
      }
      // Server-side check: meals must add up to the number of people attending.
      if (total !== count) return reply(false, 'Meal choices must match the number of guests.');
    }

    var guestName = sanitizeName(data.guestName);

    var cache = CacheService.getScriptCache();
    var rateKey = 'rate_' + submissionId;
    var writes = Number(cache.get(rateKey) || 0);
    if (writes >= MAX_WRITES_PER_ID) return reply(false, 'Too many attempts. Please try again later.');

    var lock = LockService.getScriptLock();
    if (!lock.tryLock(10000)) return reply(false, 'Busy. Please try again.');
    try {
      var sheet = getSheet();
      var row = [guestName, STATUS_LABELS[status], count].concat(mealCounts).concat([new Date(), submissionId]);
      var existing = findRow(sheet, submissionId, row.length);
      if (existing) {
        sheet.getRange(existing, 1, 1, row.length).setValues([row]);
      } else {
        sheet.appendRow(row);
      }
      SpreadsheetApp.flush(); // make sure the write is committed before we report success
    } finally {
      lock.releaseLock();
    }

    cache.put(rateKey, String(writes + 1), 600);
    return reply(true);
  } catch (err) {
    console.error(err);
    return reply(false, 'Could not save your response.');
  }
}

/** Health check only, never exposes data. */
function doGet() {
  return reply(true, 'RSVP endpoint is running.');
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    var h = headers();
    sheet.appendRow(h);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, h.length).setFontWeight('bold');
  }
  ensureSummary(ss);
  return sheet;
}

/** Private totals tab for the host. Created once; formulas keep it current. */
function ensureSummary(ss) {
  if (ss.getSheetByName(SUMMARY_NAME)) return;
  var s = ss.insertSheet(SUMMARY_NAME);
  var r = "'" + SHEET_NAME + "'!";
  var rows = [
    ['Total', 'Value'],
    ['Responses', '=COUNTA(' + r + 'A2:A)'],
    ['Guests attending', '=SUMIF(' + r + 'B2:B,"Attending",' + r + 'C2:C)'],
    ['Households attending', '=COUNTIF(' + r + 'B2:B,"Attending")'],
    ['Not sure yet', '=COUNTIF(' + r + 'B2:B,"Not sure yet")'],
    ['Unable to attend', '=COUNTIF(' + r + 'B2:B,"Declined")'],
  ];
  MEALS.forEach(function (m, i) {
    var col = columnLetter(4 + i);
    rows.push([m.label + ' (meals)', '=SUM(' + r + col + '2:' + col + ')']);
  });
  s.getRange(1, 1, rows.length, 2).setValues(rows);
  s.getRange(1, 1, 1, 2).setFontWeight('bold');
  s.setColumnWidth(1, 220);
}

function findRow(sheet, submissionId, idColumn) {
  var last = sheet.getLastRow();
  if (last < 2) return 0;
  var match = sheet
    .getRange(2, idColumn, last - 1, 1)
    .createTextFinder(submissionId)
    .matchEntireCell(true)
    .findNext();
  return match ? match.getRow() : 0;
}

function sanitizeName(value) {
  var name = String(value == null ? '' : value)
    .replace(/[\u0000-\u001F\u007F<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_NAME_LENGTH);
  // Stop names like "=HYPERLINK(...)" being treated as spreadsheet formulas.
  if (/^[=+\-@]/.test(name)) name = "'" + name;
  return name || 'Guest';
}

function columnLetter(n) {
  var s = '';
  while (n > 0) {
    var m = (n - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

function isInteger(n) {
  return typeof n === 'number' && isFinite(n) && Math.floor(n) === n;
}

function reply(ok, message) {
  var payload = { ok: ok };
  if (message) payload[ok ? 'message' : 'error'] = message;
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
