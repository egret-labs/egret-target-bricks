
var CRLF = '\r\n';
var CR = 13;
var LF = 10;

var MAX_HEADER_BYTES = 80 * 1024;

var RE_STATUS_LINE = /^HTTP\/1\.([01]) ([0-9]{3})(?: ((?:[\x21-\x7E](?:[\t ]+[\x21-\x7E])*)*))?$/;
var RE_HEADER = /^([!#$%'*+\-.^_`|~0-9A-Za-z]+):[\t ]*((?:[\x21-\x7E](?:[\t ]+[\x21-\x7E])*)*)[\t ]*$/;
var RE_FOLDED = /^[\t ]+(.*)$/;

var STATE_STATUS_LINE = 1;
var STATE_HEADER = 2;
var STATE_COMPLETE = 3;
var STATE_NAMES = [
  'STATE_STATUS_LINE',
  'STATE_HEADER',
  'STATE_COMPLETE'
];

var FLAG_CHUNKED = 1 << 0;
var FLAG_CONNECTION_KEEP_ALIVE = 1 << 1;
var FLAG_CONNECTION_CLOSE = 1 << 2;
var FLAG_CONNECTION_UPGRADE = 1 << 3;
var FLAG_TRAILING = 1 << 4;
var FLAG_UPGRADE = 1 << 5;
var FLAG_SKIPBODY = 1 << 6;
var FLAG_ANY_UPGRADE = FLAG_UPGRADE | FLAG_CONNECTION_UPGRADE;

function HTTPParser(type) {
  this.onHeaders = undefined;
  this.onComplete = undefined;

  this.reinitialize(type);
}
HTTPParser.prototype.reinitialize = function(type) {
  this.execute = this._executeHeader;
  this.type = type;
  if (type === HTTPParser.RESPONSE)
    this._state = STATE_STATUS_LINE;

  this._err = undefined;
  this._flags = 0;
  this._contentLen = undefined;
  this._nbytes = 0;
  this._nhdrbytes = 0;
  this._nhdrpairs = 0;
  this._buf = '';
  this._seenCR = false;

  // common properties
  this.headers = {};
  this.httpMajor = 1;
  this.httpMinor = undefined;
  this.maxHeaderPairs = 2000;

  // request properties
  this.method = undefined;
  this.url = undefined;

  // response properties
  this.statusCode = undefined;
  this.statusText = undefined;
};
HTTPParser.prototype._processHdrLine = function(line) {
  switch (this._state) {
    case STATE_HEADER:
      if (line.length === 0) {
        // We saw a double CRLF
        this._headersEnd();
        return;
      }
      var m = RE_HEADER.exec(line);
      if (m === null) {
        m = RE_FOLDED.exec(line);
        if (m === null) {
          this.execute = this._executeError;
          this._err = new Error('Malformed header line');
          this.execute(this._err);
          return this._err;
        }
        var extra = m[1];
        if (extra.length > 0) {
          BK.Script.log(1, 0, 'processHdrLine!extra = ' + extra);
          //var headers = this.headers;
          //headers[headers.length - 1] += ' ' + extra;
        }
      } else {
        // m[1]: field name
        // m[2]: field value
        var fieldName = m[1];
        var fieldValue = m[2];
        switch (fieldName.toLowerCase()) {
          case 'connection':
            var valLower = fieldValue.toLowerCase();
            if (valLower.substring(0, 5) === 'close')
              this._flags |= FLAG_CONNECTION_CLOSE;
            else if (valLower.substring(0, 10) === 'keep-alive')
              this._flags |= FLAG_CONNECTION_KEEP_ALIVE;
            else if (valLower.substring(0, 7) === 'upgrade')
              this._flags |= FLAG_CONNECTION_UPGRADE;
          break;
          case 'transfer-encoding':
            var valLower = fieldValue.toLowerCase();
            if (valLower.substring(0, 7) === 'chunked')
              this._flags |= FLAG_CHUNKED;
          break;
          case 'upgrade':
            this._flags |= FLAG_UPGRADE;
          break;
          case 'content-length':
            var val = parseInt(fieldValue, 10);
            if (isNaN(val) || val > MAX_CHUNK_SIZE) {
              this.execute = this._executeError;
              this._err = new Error('Bad Content-Length: ' + inspect(val));
              this.execute(this._err);
              return this._err;
            }
            this._contentLen = val;
          break;
        }
        var maxHeaderPairs = this.maxHeaderPairs;
        if (maxHeaderPairs <= 0 || ++this._nhdrpairs < maxHeaderPairs)
          this.headers[fieldName.toLowerCase()] = fieldValue;
      }
    break;
    case STATE_STATUS_LINE:
      // Original HTTP parser ignored blank lines before request/status line,
      // so we do that here too ...
      if (line.length === 0)
        return true;
      var m = RE_STATUS_LINE.exec(line);
      if (m === null) {
        this.execute = this._executeError;
        this._err = new Error('Malformed status line');
        this.execute(this._err);
        return this._err;
      }
      // m[1]: HTTP minor version
      // m[2]: HTTP status code
      // m[3]: Reason text
      this.httpMinor = parseInt(m[1], 10);
      this.statusCode = parseInt(m[2], 10);
      this.statusText = m[3] || '';
      this._state = STATE_HEADER;
    break;
    default:
      this.execute = this._executeError;
      this._err = new Error('Unexpected HTTP parser state: ' + this._state);
      this.execute(this._err);
      return this._err;
  }
};
HTTPParser.prototype._headersEnd = function() {
  var flags = this._flags;
  var methodLower = this.method && this.method.toLowerCase();
  var upgrade = ((flags & FLAG_ANY_UPGRADE) === FLAG_ANY_UPGRADE ||
                  methodLower === 'connect');
  var keepalive = ((flags & FLAG_CONNECTION_CLOSE) === 0);
  var contentLen = this._contentLen;
  var ret;

  this._buf = '';
  this._seenCR = false;
  this._nbytes = 0;

  if ((this.httpMajor === 0 && this.httpMinor === 9) ||
      (this.httpMinor === 0 && (flags & FLAG_CONNECTION_KEEP_ALIVE) === 0)) {
    keepalive = false;
  }

  if ((flags & FLAG_TRAILING) > 0) {
    this.onComplete && this.onComplete();
    this.reinitialize(this.type);
    return;
  } else {
    if (this.onHeaders) {
      var headers = this.headers;
      ret = this.onHeaders(this.httpMajor, this.httpMinor, headers, this.method,
                           this.url, this.statusCode, this.statusText, upgrade,
                           keepalive);
      if (ret === true)
        flags = (this._flags |= FLAG_SKIPBODY);
    }
  }

  if (upgrade) {
    this.onComplete && this.onComplete();
    this._state = STATE_COMPLETE;
  } else if (contentLen === 0 ||
             (flags & FLAG_SKIPBODY) > 0 ||
             ((flags & FLAG_CHUNKED) === 0 &&
              contentLen === undefined &&
              !this._needsEOF())) {
    this.onComplete && this.onComplete();
    this.reinitialize(this.type);
  }
};
HTTPParser.prototype._executeHeader = function(data) {
  var offset = 0;
  var len = data.length;
  var idx;
  var seenCR = this._seenCR;
  var buf = this._buf;
  var ret;
  var bytesToAdd;
  var nhdrbytes = this._nhdrbytes;

  while (offset < len) {
    if (seenCR) {
      seenCR = false;
      if (data.charCodeAt(offset) === LF) {
        // Our internal buffer contains a full line
        ++offset;
        ret = this._processHdrLine(buf);
        buf = '';
        if (typeof ret === 'object') {
          this._err = ret;
          this.execute(this._err);
          return ret;
        } else if (ret === undefined) {
          var state = this._state;
          if (state !== STATE_HEADER) {
            // Begin of body or end of message
            if (state < STATE_COMPLETE && offset < len) {
              // Execute extra body bytes
              ret = this.execute(data.slice(offset));
              if (typeof ret !== 'number') {
                this._err = ret;
                this.execute(this._err);
                return ret;
              }
              return offset + ret;
            } else if (state === STATE_COMPLETE)
              this.reinitialize(this.type);
            return offset;
          }
        }
      } else {
        // False match
        buf += '\r';
        ++nhdrbytes;
        if (nhdrbytes > MAX_HEADER_BYTES) {
          this.execute = this._executeError;
          this._err = new Error('Header size limit exceeded (' +
                                MAX_HEADER_BYTES + ')');
          this.execute(this._err);
          return this._err;
        }
      }
    }
    var idx = data.indexOf(CRLF, offset);
    if (idx > -1) {
      // Our internal buffer contains a full line
      bytesToAdd = idx - offset;
      if (bytesToAdd > 0) {
        nhdrbytes += bytesToAdd;
        if (nhdrbytes > MAX_HEADER_BYTES) {
          this.execute = this._executeError;
          this._err = new Error('Header size limit exceeded (' +
                                MAX_HEADER_BYTES + ')');
          this.execute(this._err);
          return this._err;
        }
        buf += data.substring(offset, idx);
      }
      offset = idx + 2;
      ret = this._processHdrLine(buf);
      buf = '';
      if (typeof ret === 'object') {
        this._err = ret;
        this.execute(this._err);
        return ret;
      } else if (ret === undefined) {
        var state = this._state;
        if (state !== STATE_HEADER) {
          // Begin of body or end of message
          if (state < STATE_COMPLETE && offset < len) {
            // Execute extra body bytes
            ret = this.execute(data.slice(offset));
            if (typeof ret !== 'number') {
              this._err = ret;
              this.execute(this._err);
              return ret;
            }
            return offset + ret;
          } else if (state === STATE_COMPLETE)
            this.reinitialize(this.type);
          return offset;
        }
      }
    } else {
      // Check for possible cross-chunk CRLF split
      var end;
      if (data.charCodeAt(len - 1) === CR) {
        seenCR = true;
        end = len - 1;
      } else
        end = len;

      nhdrbytes += end - offset;

      if (nhdrbytes > MAX_HEADER_BYTES) {
        this.execute = this._executeError;
        this._err = new Error('Header size limit exceeded (' +
                              MAX_HEADER_BYTES + ')');
        this.execute(this._err);
        return this._err;
      }

      buf += data.substring(offset, end);
      break;
    }
  }

  this._buf = buf;
  this._seenCR = seenCR;
  this._nhdrbytes = nhdrbytes;

  return len;
};
HTTPParser.prototype._executeError = function(err) {
  BK.Script.log(1, 0, '_executeError!err = ' + err.message);
  return this._err;
};
HTTPParser.prototype.execute = HTTPParser.prototype._executeHeader;
HTTPParser.prototype._needsEOF = function() {
  if (this.type === HTTPParser.REQUEST)
    return false;

  // See RFC 2616 section 4.4
  var status = this.statusCode;
  var flags = this._flags;
  if ((status !== undefined &&
       (status === 204 ||                    // No Content
        status === 304 ||                    // Not Modified
        parseInt(status / 100, 1) === 1)) || // 1xx e.g. Continue
      flags & FLAG_SKIPBODY) {               // response to a HEAD request
    return false;
  }

  if ((flags & FLAG_CHUNKED) > 0 || this._contentLen != undefined)
    return false;

  return true;
}

HTTPParser.REQUEST = 0;
HTTPParser.RESPONSE = 1;
