/* ============================================================
   Grow Medico - Audit LP Leads - Google Apps Script

   Paste into Extensions → Apps Script of the target spreadsheet, then
   Deploy → New deployment → Web app (Execute as: Me, Access: Anyone).
   The /exec URL goes in GOOGLE_SHEETS_WEBHOOK_URL.

   Accepts lead payloads from lib/googleSheets.ts (app/api/lead):
     { timestamp, name, phone }

   Rows are written by header name instead of fixed column position so the
   tab can tolerate extra manual columns without breaking submissions.
   ============================================================ */

var LEAD_HEADERS = ['Timestamp', 'Name', 'Phone'];
var LEAD_WIDTHS = [190, 220, 170];

var DEFAULT_TAB = 'Audit LP Leads';
var DEFAULT_HEADER_COLOR = '#0B3D2E';

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

    // Two leads at the same moment must not write to the same row.
    lock.waitLock(20000);

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var ts = data.timestamp || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    var sheet = getOrCreateLeadSheet(ss, DEFAULT_TAB);
    var row = appendLeadRow(sheet, data, ts);

    return _json({ success: true, tab: DEFAULT_TAB, row: row });
  } catch (err) {
    return _json({ error: err.toString() });
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}

function setupSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  if (!ss.getSheetByName(DEFAULT_TAB)) {
    createLeadSheet(ss, DEFAULT_TAB);
    Logger.log('Created: ' + DEFAULT_TAB);
  } else {
    Logger.log('OK: ' + DEFAULT_TAB);
  }

  Logger.log('setupSheets complete.');
}

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

function _appendByHeaders(sheet, valueMap, defaultHeaders, headerColor) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(defaultHeaders);
    _styleHeader(sheet, defaultHeaders.length, headerColor);
    sheet.setFrozenRows(1);
  }

  var lastCol = sheet.getLastColumn();
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function (h) {
    return String(h).trim();
  });

  var row = headers.map(function (h) {
    return Object.prototype.hasOwnProperty.call(valueMap, h) ? valueMap[h] : '';
  });

  var nextRow = sheet.getLastRow() + 1;
  // Kept as text, so Sheets doesn't turn +9198... into 9.19E+11.
  sheet.getRange(nextRow, 1, 1, headers.length).setNumberFormat('@').setValues([row]);
  styleRow(sheet, nextRow, lastCol);

  return { row: nextRow, headers: headers };
}

function _centerColumns(sheet, headers, rowIndex, names) {
  names.forEach(function (name) {
    var idx = headers.indexOf(name);
    if (idx !== -1) sheet.getRange(rowIndex, idx + 1).setHorizontalAlignment('center');
  });
}

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

function appendLeadRow(sheet, data, ts) {
  var digits = String(data.phone || '').replace(/\D/g, '');

  var result = _appendByHeaders(sheet, {
    'Timestamp': ts,
    'Name': data.name || '',
    'Phone': digits ? '+' + digits : ''
  }, LEAD_HEADERS, DEFAULT_HEADER_COLOR);

  _centerColumns(sheet, result.headers, result.row, ['Phone']);
  return result.row;
}
