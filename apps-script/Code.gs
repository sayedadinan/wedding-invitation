/**
 * Wedding RSVP endpoint — Google Apps Script web app.
 *
 * Sheet tab "RSVP" columns:
 *   A Guest Name | B Status | C Count of Members | D Updated Date | E Submission ID
 *
 * Deploy: Deploy → New deployment → Web app → Execute as: Me, Who has access: Anyone.
 * The endpoint only writes. It never returns sheet contents.
 */

var SHEET_NAME = 'RSVP';
var HEADERS = ['Guest Name', 'Status', 'Count of Members', 'Updated Date', 'Submission ID'];
var MAX_ATTENDEES = 15;          // keep in sync with src/config/wedding.ts
var MAX_NAME_LENGTH = 60;
var MAX_BODY_LENGTH = 2000;
var MAX_WRITES_PER_ID = 10;      // per 10 minutes, simple abuse protection
var STATUS_LABELS = { attending: 'Attending', declined: 'Declined' };

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

    var count = Number(data.count);
    if (status === 'declined') {
      count = 0;
    } else if (!isInteger(count) || count < 1 || count > MAX_ATTENDEES) {
      return reply(false, 'Invalid attendee count.');
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
      var row = [guestName, STATUS_LABELS[status], count, new Date(), submissionId];
      var existing = findRow(sheet, submissionId);
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
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sheet;
}

function findRow(sheet, submissionId) {
  var last = sheet.getLastRow();
  if (last < 2) return 0;
  var match = sheet
    .getRange(2, 5, last - 1, 1)
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

function isInteger(n) {
  return typeof n === 'number' && isFinite(n) && Math.floor(n) === n;
}

function reply(ok, message) {
  var payload = { ok: ok };
  if (message) payload[ok ? 'message' : 'error'] = message;
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
