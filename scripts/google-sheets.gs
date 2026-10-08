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

   Meta Custom Audience sync (bottom of this file)
   -----------------------------------------------
   Every 5 minutes, "Not Paid" leads are pushed (SHA-256 hashed) to a Meta
   customer-list Custom Audience, and anyone in it who has since paid is
   removed again. A "Meta Audience" column records each row's state.

   Project Settings → Script Properties:
     META_ACCESS_TOKEN   System-user token with ads_management
     META_AUDIENCE_ID    Customer-list audience for unpaid leads

   Then run setupMetaAudienceSync() once from the editor (installs the
   trigger and does the first sync). The sheet also gets a
   "Meta Audience → Sync now" menu.
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

/* ── Meta Custom Audience sync (unpaid leads only) ───────────── */

var META_GRAPH_VERSION = 'v21.0';
var META_SYNC_TRIGGER = 'syncMetaAudience';
var META_COLUMN = 'Meta Audience';
var META_BATCH_SIZE = 5000; // Meta accepts up to 10,000 users per request.

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Meta Audience')
    .addItem('Sync now', 'syncMetaAudienceFromMenu')
    .addItem('Retry failed rows', 'retryMetaAudienceFromMenu')
    .addToUi();
}

/** Run once from the editor: checks the settings, installs the trigger, syncs. */
function setupMetaAudienceSync() {
  _metaSettings();

  removeMetaAudienceSync();
  ScriptApp.newTrigger(META_SYNC_TRIGGER).timeBased().everyMinutes(5).create();
  Logger.log('Trigger installed: ' + META_SYNC_TRIGGER + ' every 5 minutes');

  Logger.log(JSON.stringify(syncMetaAudience()));
}

function removeMetaAudienceSync() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === META_SYNC_TRIGGER) ScriptApp.deleteTrigger(t);
  });
  Logger.log('Meta audience trigger removed.');
}

function syncMetaAudienceFromMenu() {
  SpreadsheetApp.getActive().toast(_metaSummary(syncMetaAudience()), 'Meta Audience', 8);
}

/** Clears "Skipped" cells (e.g. after fixing a number) so those rows are tried again. */
function retryMetaAudienceFromMenu() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(DEFAULT_TAB);
  if (!sheet || sheet.getLastRow() < 2) return;
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(function (h) {
    return String(h).trim();
  });
  var idx = headers.indexOf(META_COLUMN);
  if (idx !== -1) {
    var range = sheet.getRange(2, idx + 1, sheet.getLastRow() - 1, 1);
    range.setValues(range.getValues().map(function (r) {
      return [String(r[0]).indexOf('Skipped') === 0 ? '' : r[0]];
    }));
  }
  syncMetaAudienceFromMenu();
}

/**
 * Keeps the audience equal to the sheet's unpaid leads:
 *   - Not Paid rows not yet sent        → added     ("Added <time>")
 *   - rows that were added, then paid   → removed   ("Removed (paid) <time>")
 *   - rows already Paid before sending  → never sent ("Not sent: paid")
 * Errors are written into the cell and retried on the next run. A number that
 * paid on any row counts as paid, so a duplicate older "Not Paid" row of the
 * same person never puts them back in.
 */
function syncMetaAudience() {
  var settings = _metaSettings();

  // Same lock as doPost, so a row being written or marked Paid is never half-read.
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) return { busy: true };

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(DEFAULT_TAB);
    if (!sheet || sheet.getLastRow() < 2) return { added: 0, removed: 0, failed: 0, skipped: 0 };

    var headers = _ensureHeaders(sheet, LEAD_HEADERS.concat([META_COLUMN]), DEFAULT_HEADER_COLOR);
    var values = sheet.getRange(2, 1, sheet.getLastRow() - 1, headers.length).getValues();
    var nameIdx = headers.indexOf('Name');
    var phoneIdx = headers.indexOf('Phone');
    var statusIdx = headers.indexOf('Payment Status');
    var col = headers.indexOf(META_COLUMN);

    var rows = values.map(function (row) {
      return {
        state: String(row[col]).trim(),
        paid: String(row[statusIdx]).trim() === PAID,
        user: _metaUser(row[nameIdx], row[phoneIdx])
      };
    });

    var paidPhones = {};
    rows.forEach(function (r) { if (r.paid && r.user) paidPhones[r.user[0]] = true; });

    var column = values.map(function (row) { return [row[col]]; });
    var toAdd = [], toRemove = [], skipped = 0;

    rows.forEach(function (r, i) {
      var paid = r.paid || (r.user && paidPhones[r.user[0]]);
      var inAudience = r.state.indexOf('Added') === 0 || r.state.indexOf('Error removing') === 0;
      var notSentYet = !r.state || r.state.indexOf('Error adding') === 0;

      if (paid) {
        if (inAudience) toRemove.push({ i: i, user: r.user });
        else if (notSentYet) column[i][0] = 'Not sent: paid';
        return;
      }
      if (!notSentYet) return;
      if (!r.user) {
        column[i][0] = 'Skipped: no valid phone';
        skipped++;
        return;
      }
      toAdd.push({ i: i, user: r.user });
    });

    var added = _sendBatches(settings, 'post', toAdd, column, 'Added', 'Error adding');
    var removed = _sendBatches(settings, 'delete', toRemove, column, 'Removed (paid)', 'Error removing');

    // One write for the whole column; doPost is locked out, so the rows haven't moved.
    sheet.getRange(2, col + 1, column.length, 1).setValues(column);

    return {
      added: added.ok,
      removed: removed.ok,
      failed: added.failed + removed.failed,
      skipped: skipped
    };
  } finally {
    lock.releaseLock();
  }
}

function _metaSettings() {
  var props = PropertiesService.getScriptProperties();
  var token = props.getProperty('META_ACCESS_TOKEN');
  var audienceId = props.getProperty('META_AUDIENCE_ID');
  if (!token) throw new Error('Set the META_ACCESS_TOKEN script property first');
  if (!audienceId) throw new Error('Set the META_AUDIENCE_ID script property first');
  return { token: token, audienceId: audienceId };
}

function _sendBatches(settings, method, items, column, okLabel, errLabel) {
  var ok = 0, failed = 0;
  for (var start = 0; start < items.length; start += META_BATCH_SIZE) {
    var batch = items.slice(start, start + META_BATCH_SIZE);
    var label;
    try {
      var res = _audienceUsers(settings, method, batch.map(function (p) { return p.user; }));
      label = okLabel + ' ' + _istNow();
      ok += batch.length - (res.num_invalid_entries || 0);
    } catch (err) {
      label = errLabel + ': ' + String(err.message || err).slice(0, 200);
      failed += batch.length;
      Logger.log(errLabel + ': ' + err);
    }
    batch.forEach(function (p) { column[p.i][0] = label; });
  }
  return { ok: ok, failed: failed };
}

/** [PHONE, FN, LN] hashed per Meta's normalisation rules, or null without a usable number. */
function _metaUser(name, phone) {
  var digits = _digits(phone).replace(/^0+/, '');
  if (digits.length === 10) digits = '91' + digits; // no country code → India
  if (digits.length < 11 || digits.length > 15) return null;

  // Meta wants names lowercase with no punctuation ("Dr. O'Neil" → "dr", "oneil").
  var parts = String(name || '').trim().toLowerCase().split(/\s+/).map(function (p) {
    return p.replace(/[.,'"`()\-_]/g, '');
  }).filter(Boolean);
  var fn = parts[0] || '';
  var ln = parts.length > 1 ? parts[parts.length - 1] : '';

  return [_sha256(digits), fn ? _sha256(fn) : '', ln ? _sha256(ln) : ''];
}

/** POST adds users to the audience, DELETE removes them. */
function _audienceUsers(settings, method, users) {
  var url = 'https://graph.facebook.com/' + META_GRAPH_VERSION + '/' +
    encodeURIComponent(settings.audienceId) + '/users';
  var res = UrlFetchApp.fetch(url, {
    method: method,
    payload: {
      access_token: settings.token,
      payload: JSON.stringify({ schema: ['PHONE', 'FN', 'LN'], data: users })
    },
    muteHttpExceptions: true
  });

  var json = {};
  try { json = JSON.parse(res.getContentText()); } catch (ignore) {}
  if (res.getResponseCode() !== 200 || json.error) {
    throw new Error((json.error && json.error.message) || ('Meta HTTP ' + res.getResponseCode()));
  }
  return json; // { audience_id, num_received, num_invalid_entries, ... }
}

function _sha256(value) {
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value, Utilities.Charset.UTF_8);
  return bytes.map(function (b) { return ('0' + (b & 0xff).toString(16)).slice(-2); }).join('');
}

function _istNow() {
  return Utilities.formatDate(new Date(), 'Asia/Kolkata', 'd MMM yyyy, h:mm a');
}

function _metaSummary(result) {
  if (result.busy) return 'Sheet is busy - try again in a moment.';
  return result.added + ' added, ' + result.removed + ' removed (paid)' +
    (result.failed ? ', ' + result.failed + ' failed' : '') +
    (result.skipped ? ', ' + result.skipped + ' skipped (no valid phone)' : '');
}


