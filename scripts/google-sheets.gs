/* ============================================================
   Grow Medico - Audit LP Leads - Google Apps Script

   Paste into Extensions → Apps Script of the target spreadsheet, then
   Deploy → New deployment → Web app (Execute as: Me, Access: Anyone).
   The /exec URL goes in GOOGLE_SHEETS_WEBHOOK_URL.

   Accepts payloads from lib/googleSheets.ts:

     action: "lead"  (app/api/lead — booking form, before payment)
       { timestamp, name, phone }          → new row, "Not Paid"

     action: "paid"  (app/api/razorpay/verify + webhook)
       { timestamp, name, phone }          → that number's row → "Paid"

   "paid" can arrive twice (verify and webhook) — the second is a no-op.
   If no row matches the number, a new "Paid" row is added so nothing is lost.

   Rows are written by header name instead of fixed column position so the
   tab can tolerate extra manual columns without breaking submissions.
   ============================================================ */

var LEAD_HEADERS = ['Timestamp', 'Name', 'Phone', 'Payment Status'];
var LEAD_WIDTHS = [190, 220, 170, 150];

var DEFAULT_TAB = 'Audit LP Leads';
var DEFAULT_HEADER_COLOR = '#0B3D2E';

var PAID = 'Paid';
var NOT_PAID = 'Not Paid';

var STATUS_COLORS = {
  'Paid': { bg: '#d9f7ea', fg: '#0b6b45' },
  'Not Paid': { bg: '#fde2e2', fg: '#a61b1b' }
};

function authorize() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  Logger.log('Authorized: ' + ss.getName());
}

function doGet() {
  return _json({ status: 'Grow Medico Audit LP API is live' });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return _json({ error: 'Empty request body' });
    }

    var data = JSON.parse(e.postData.contents);

    // A lead and its payment can arrive seconds apart; serialise writes so
    // "paid" never misses a row that is still being added.
    lock.waitLock(20000);

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var ts = data.timestamp || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    var sheet = getOrCreateLeadSheet(ss, DEFAULT_TAB);

    var row = data.action === 'paid'
      ? markPaid(sheet, data, ts)
      : appendLeadRow(sheet, data, ts);

    return _json({ success: true, tab: DEFAULT_TAB, action: data.action || 'lead', row: row });
  } catch (err) {
    return _json({ error: err.toString() });
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}

function setupSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(DEFAULT_TAB);

  if (!sheet) {
    createLeadSheet(ss, DEFAULT_TAB);
    Logger.log('Created: ' + DEFAULT_TAB);
  } else {
    _ensureHeaders(sheet, LEAD_HEADERS, DEFAULT_HEADER_COLOR);
    Logger.log('OK: ' + DEFAULT_TAB);
  }

  Logger.log('setupSheets complete.');
}

/* ── Helpers ─────────────────────────────────────────────────── */

function _json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function _styleHeader(sheet, colCount, bgColor) {
  sheet.getRange(1, 1, 1, colCount)
    .setBackground(bgColor || DEFAULT_HEADER_COLOR)
    .setFontColor('#ffffff')
    .setFontWeight('bold')
    .setFontSize(11)
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');
  sheet.setRowHeight(1, 42);
}

function styleRow(sheet, rowIndex, colCount) {
  var row = sheet.getRange(rowIndex, 1, 1, colCount);
  row.setBackground(rowIndex % 2 === 0 ? '#f6f8f7' : '#ffffff')
    .setFontColor('#1a1c1b')
    .setFontSize(10)
    .setVerticalAlignment('middle')
    .setHorizontalAlignment('left');
  sheet.setRowHeight(rowIndex, 36);
  row.setBorder(false, false, true, false, false, false, '#dfe6e2', SpreadsheetApp.BorderStyle.SOLID);
}

function _setWidths(sheet, widths) {
  widths.forEach(function (w, i) { sheet.setColumnWidth(i + 1, w); });
}

function _addFilter(sheet, colCount) {
  try {
    if (!sheet.getFilter()) sheet.getRange(1, 1, 1, colCount).createFilter();
  } catch (err) {
    Logger.log('Filter skipped on ' + sheet.getName() + ': ' + err);
  }
}

/** Header row, adding any LEAD_HEADERS column an older tab is missing. */
function _ensureHeaders(sheet, defaultHeaders, headerColor) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(defaultHeaders);
    _styleHeader(sheet, defaultHeaders.length, headerColor);
    sheet.setFrozenRows(1);
    return defaultHeaders.slice();
  }

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(function (h) {
    return String(h).trim();
  });

  var missing = defaultHeaders.filter(function (h) { return headers.indexOf(h) === -1; });
  if (missing.length) {
    sheet.getRange(1, headers.length + 1, 1, missing.length).setValues([missing]);
    headers = headers.concat(missing);
    _styleHeader(sheet, headers.length, headerColor);
    sheet.setColumnWidth(headers.length, 150);
  }
  return headers;
}

function _appendByHeaders(sheet, valueMap, defaultHeaders, headerColor) {
  var headers = _ensureHeaders(sheet, defaultHeaders, headerColor);

  var row = headers.map(function (h) {
    return Object.prototype.hasOwnProperty.call(valueMap, h) ? valueMap[h] : '';
  });

  var nextRow = sheet.getLastRow() + 1;
  // Kept as text, so Sheets doesn't turn +9198... into 9.19E+11.
  sheet.getRange(nextRow, 1, 1, headers.length).setNumberFormat('@').setValues([row]);
  styleRow(sheet, nextRow, headers.length);

  return { row: nextRow, headers: headers };
}

function _centerColumns(sheet, headers, rowIndex, names) {
  names.forEach(function (name) {
    var idx = headers.indexOf(name);
    if (idx !== -1) sheet.getRange(rowIndex, idx + 1).setHorizontalAlignment('center');
  });
}

function _setStatus(sheet, headers, rowIndex, status) {
  var idx = headers.indexOf('Payment Status');
  if (idx === -1) return;
  var colors = STATUS_COLORS[status];
  sheet.getRange(rowIndex, idx + 1)
    .setValue(status)
    .setBackground(colors.bg)
    .setFontColor(colors.fg)
    .setFontWeight('bold')
    .setHorizontalAlignment('center');
}

function _digits(raw) {
  return String(raw || '').replace(/\D/g, '');
}

function _phone(raw) {
  var digits = _digits(raw);
  return digits ? '+' + digits : '';
}

/** Same number, with or without a country code (compares the last 10 digits). */
function _samePhone(a, b) {
  var x = _digits(a), y = _digits(b);
  if (!x || !y) return false;
  return x.slice(-10) === y.slice(-10);
}

/* ── Sheet setup ─────────────────────────────────────────────── */

function createLeadSheet(ss, tabName) {
  var sheet = ss.insertSheet(tabName);
  sheet.appendRow(LEAD_HEADERS);
  _styleHeader(sheet, LEAD_HEADERS.length, DEFAULT_HEADER_COLOR);
  _setWidths(sheet, LEAD_WIDTHS);
  sheet.setFrozenRows(1);
  _addFilter(sheet, LEAD_HEADERS.length);
  return sheet;
}

function getOrCreateLeadSheet(ss, tabName) {
  return ss.getSheetByName(tabName) || createLeadSheet(ss, tabName);
}

/* ── Actions ─────────────────────────────────────────────────── */

function appendLeadRow(sheet, data, ts) {
  var result = _appendByHeaders(sheet, {
    'Timestamp': ts,
    'Name': data.name || '',
    'Phone': _phone(data.phone)
  }, LEAD_HEADERS, DEFAULT_HEADER_COLOR);

  _centerColumns(sheet, result.headers, result.row, ['Phone']);
  _setStatus(sheet, result.headers, result.row, NOT_PAID);
  return result.row;
}

function markPaid(sheet, data, ts) {
  var headers = _ensureHeaders(sheet, LEAD_HEADERS, DEFAULT_HEADER_COLOR);
  var phoneIdx = headers.indexOf('Phone');
  var statusIdx = headers.indexOf('Payment Status');
  var lastRow = sheet.getLastRow();

  if (lastRow >= 2) {
    var values = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();
    var alreadyPaid = -1;

    // Newest first: the latest form submission from this number is the one that paid.
    for (var i = values.length - 1; i >= 0; i--) {
      if (!_samePhone(values[i][phoneIdx], data.phone)) continue;
      var rowIndex = i + 2;
      if (String(values[i][statusIdx]).trim() === PAID) {
        if (alreadyPaid === -1) alreadyPaid = rowIndex;
        continue;
      }
      _setStatus(sheet, headers, rowIndex, PAID);
      return rowIndex;
    }

    // Verify and webhook both report the same payment — the second changes nothing.
    if (alreadyPaid !== -1) return alreadyPaid;
  }

  // No form row for this number — record the payment anyway.
  var result = _appendByHeaders(sheet, {
    'Timestamp': ts,
    'Name': data.name || '',
    'Phone': _phone(data.phone)
  }, LEAD_HEADERS, DEFAULT_HEADER_COLOR);

  _centerColumns(sheet, result.headers, result.row, ['Phone']);
  _setStatus(sheet, result.headers, result.row, PAID);
  return result.row;
}
