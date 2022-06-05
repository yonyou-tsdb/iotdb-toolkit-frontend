// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE
import CodeMirror from '../../../node_modules/codemirror/lib/codemirror';
(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../../node_modules/codemirror/lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../../node_modules/codemirror/lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode("iotdb-sql", function(config, parserConfig) {
  var client         = parserConfig.client || {},
      atoms          = parserConfig.atoms || {"false": true, "true": true, "null": true},
      builtin        = parserConfig.builtin || set(defaultBuiltin),
      keywords       = parserConfig.keywords || set(sqlKeywords),
      operatorChars  = parserConfig.operatorChars || /^[*+\-%<>!=&|~^\/]/,
      support        = parserConfig.support || {},
      hooks          = parserConfig.hooks || {},
      dateSQL        = parserConfig.dateSQL || {"date" : true, "time" : true, "timestamp" : true},
      backslashStringEscapes = parserConfig.backslashStringEscapes !== false,
      brackets       = parserConfig.brackets || /^[\{}\(\)\[\]]/,
      punctuation    = parserConfig.punctuation || /^[;.,:]/

  function tokenBase(stream, state) {
    var ch = stream.next();

    // call hooks from the mime type
    if (hooks[ch]) {
      var result = hooks[ch](stream, state);
      if (result !== false) return result;
    }

    if (support.hexNumber &&
      ((ch == "0" && stream.match(/^[xX][0-9a-fA-F]+/))
      || (ch == "x" || ch == "X") && stream.match(/^'[0-9a-fA-F]+'/))) {
      // hex
      // ref: http://dev.mysql.com/doc/refman/5.5/en/hexadecimal-literals.html
      return "number";
    } else if (support.binaryNumber &&
      (((ch == "b" || ch == "B") && stream.match(/^'[01]+'/))
      || (ch == "0" && stream.match(/^b[01]+/)))) {
      // bitstring
      // ref: http://dev.mysql.com/doc/refman/5.5/en/bit-field-literals.html
      return "number";
    } else if (ch.charCodeAt(0) > 47 && ch.charCodeAt(0) < 58) {
      // numbers
      // ref: http://dev.mysql.com/doc/refman/5.5/en/number-literals.html
      stream.match(/^[0-9]*(\.[0-9]+)?([eE][-+]?[0-9]+)?/);
      support.decimallessFloat && stream.match(/^\.(?!\.)/);
      return "number";
    } else if (ch == "?" && (stream.eatSpace() || stream.eol() || stream.eat(";"))) {
      // placeholders
      return "variable-3";
    } else if (ch == "'" || (ch == '"' && support.doubleQuote)) {
      // strings
      // ref: http://dev.mysql.com/doc/refman/5.5/en/string-literals.html
      state.tokenize = tokenLiteral(ch);
      return state.tokenize(stream, state);
    } else if ((((support.nCharCast && (ch == "n" || ch == "N"))
        || (support.charsetCast && ch == "_" && stream.match(/[a-z][a-z0-9]*/i)))
        && (stream.peek() == "'" || stream.peek() == '"'))) {
      // charset casting: _utf8'str', N'str', n'str'
      // ref: http://dev.mysql.com/doc/refman/5.5/en/string-literals.html
      return "keyword";
    } else if (support.escapeConstant && (ch == "e" || ch == "E")
        && (stream.peek() == "'" || (stream.peek() == '"' && support.doubleQuote))) {
      // escape constant: E'str', e'str'
      // ref: https://www.postgresql.org/docs/current/sql-syntax-lexical.html#SQL-SYNTAX-STRINGS-ESCAPE
      state.tokenize = function(stream, state) {
        return (state.tokenize = tokenLiteral(stream.next(), true))(stream, state);
      }
      return "keyword";
    } else if (support.commentSlashSlash && ch == "/" && stream.eat("/")) {
      // 1-line comment
      stream.skipToEnd();
      return "comment";
    } else if ((support.commentHash && ch == "#")
        || (ch == "-" && stream.eat("-") && (!support.commentSpaceRequired || stream.eat(" ")))) {
      // 1-line comments
      // ref: https://kb.askmonty.org/en/comment-syntax/
      stream.skipToEnd();
      return "comment";
    } else if (ch == "/" && stream.eat("*")) {
      // multi-line comments
      // ref: https://kb.askmonty.org/en/comment-syntax/
      state.tokenize = tokenComment(1);
      return state.tokenize(stream, state);
    } else if (ch == ".") {
      // .1 for 0.1
      if (support.zerolessFloat && stream.match(/^(?:\d+(?:e[+-]?\d+)?)/i))
        return "number";
      if (stream.match(/^\.+/))
        return null
      // .table_name (ODBC)
      // // ref: http://dev.mysql.com/doc/refman/5.6/en/identifier-qualifiers.html
      if (support.ODBCdotTable && stream.match(/^[\w\d_$#]+/))
        return "variable-2";
    } else if (operatorChars.test(ch)) {
      // operators
      stream.eatWhile(operatorChars);
      return "operator";
    } else if (brackets.test(ch)) {
      // brackets
      return "bracket";
    } else if (punctuation.test(ch)) {
      // punctuation
      stream.eatWhile(punctuation);
      return "punctuation";
    } else if (ch == '{' &&
        (stream.match(/^( )*(d|D|t|T|ts|TS)( )*'[^']*'( )*}/) || stream.match(/^( )*(d|D|t|T|ts|TS)( )*"[^"]*"( )*}/))) {
      // dates (weird ODBC syntax)
      // ref: http://dev.mysql.com/doc/refman/5.5/en/date-and-time-literals.html
      return "number";
    } else {
      stream.eatWhile(/^[_\w\d]/);
      var word = stream.current().toLowerCase();
      // dates (standard SQL syntax)
      // ref: http://dev.mysql.com/doc/refman/5.5/en/date-and-time-literals.html
      if (dateSQL.hasOwnProperty(word) && (stream.match(/^( )+'[^']*'/) || stream.match(/^( )+"[^"]*"/)))
        return "number";
      if (atoms.hasOwnProperty(word)) return "atom";
      if (builtin.hasOwnProperty(word)) return "builtin";
      if (keywords.hasOwnProperty(word)) return "keyword";
      if (client.hasOwnProperty(word)) return "string-2";
      return null;
    }
  }

  // 'string', with char specified in quote escaped by '\'
  function tokenLiteral(quote, backslashEscapes) {
    return function(stream, state) {
      var escaped = false, ch;
      while ((ch = stream.next()) != null) {
        if (ch == quote && !escaped) {
          state.tokenize = tokenBase;
          break;
        }
        escaped = (backslashStringEscapes || backslashEscapes) && !escaped && ch == "\\";
      }
      return "string";
    };
  }
  function tokenComment(depth) {
    return function(stream, state) {
      var m = stream.match(/^.*?(\/\*|\*\/)/)
      if (!m) stream.skipToEnd()
      else if (m[1] == "/*") state.tokenize = tokenComment(depth + 1)
      else if (depth > 1) state.tokenize = tokenComment(depth - 1)
      else state.tokenize = tokenBase
      return "comment"
    }
  }

  function pushContext(stream, state, type) {
    state.context = {
      prev: state.context,
      indent: stream.indentation(),
      col: stream.column(),
      type: type
    };
  }

  function popContext(state) {
    state.indent = state.context.indent;
    state.context = state.context.prev;
  }

  return {
    startState: function() {
      return {tokenize: tokenBase, context: null};
    },

    token: function(stream, state) {
      if (stream.sol()) {
        if (state.context && state.context.align == null)
          state.context.align = false;
      }
      if (state.tokenize == tokenBase && stream.eatSpace()) return null;

      var style = state.tokenize(stream, state);
      if (style == "comment") return style;

      if (state.context && state.context.align == null)
        state.context.align = true;

      var tok = stream.current();
      if (tok == "(")
        pushContext(stream, state, ")");
      else if (tok == "[")
        pushContext(stream, state, "]");
      else if (state.context && state.context.type == tok)
        popContext(state);
      return style;
    },

    indent: function(state, textAfter) {
      var cx = state.context;
      if (!cx) return CodeMirror.Pass;
      var closing = textAfter.charAt(0) == cx.type;
      if (cx.align) return cx.col + (closing ? 0 : 1);
      else return cx.indent + (closing ? 0 : config.indentUnit);
    },

    blockCommentStart: "/*",
    blockCommentEnd: "*/",
    lineComment: support.commentSlashSlash ? "//" : support.commentHash ? "#" : "--",
    closeBrackets: "()[]{}''\"\"``"
  };
});

  // `identifier`
  function hookIdentifier(stream) {
    // MySQL/MariaDB identifiers
    // ref: http://dev.mysql.com/doc/refman/5.6/en/identifier-qualifiers.html
    var ch;
    while ((ch = stream.next()) != null) {
      if (ch == "`" && !stream.eat("`")) return "variable-2";
    }
    stream.backUp(stream.current().length - 1);
    return stream.eatWhile(/\w/) ? "variable-2" : null;
  }

  // "identifier"
  function hookIdentifierDoublequote(stream) {
    // Standard SQL /SQLite identifiers
    // ref: http://web.archive.org/web/20160813185132/http://savage.net.au/SQL/sql-99.bnf.html#delimited%20identifier
    // ref: http://sqlite.org/lang_keywords.html
    var ch;
    while ((ch = stream.next()) != null) {
      if (ch == "\"" && !stream.eat("\"")) return "variable-2";
    }
    stream.backUp(stream.current().length - 1);
    return stream.eatWhile(/\w/) ? "variable-2" : null;
  }

  // variable token
  function hookVar(stream) {
    // variables
    // @@prefix.varName @varName
    // varName can be quoted with ` or ' or "
    // ref: http://dev.mysql.com/doc/refman/5.5/en/user-variables.html
    if (stream.eat("@")) {
      stream.match('session.');
      stream.match('local.');
      stream.match('global.');
    }

    if (stream.eat("'")) {
      stream.match(/^.*'/);
      return "variable-2";
    } else if (stream.eat('"')) {
      stream.match(/^.*"/);
      return "variable-2";
    } else if (stream.eat("`")) {
      stream.match(/^.*`/);
      return "variable-2";
    } else if (stream.match(/^[0-9a-zA-Z$\.\_]+/)) {
      return "variable-2";
    }
    return null;
  };

  // short client keyword token
  function hookClient(stream) {
    // \N means NULL
    // ref: http://dev.mysql.com/doc/refman/5.5/en/null-values.html
    if (stream.eat("N")) {
        return "atom";
    }
    // \g, etc
    // ref: http://dev.mysql.com/doc/refman/5.5/en/mysql-commands.html
    return stream.match(/^[a-zA-Z.#!?]/) ? "variable-2" : null;
  }

  // these keywords are used by all SQL dialects (however, a mode can still overwrite it)
  var sqlKeywords = "alter and as asc between by count create delete desc distinct drop from group having in insert into is join like not on or order select set table union update values where limit ";

  // turn a space-separated list into an array
  function set(str) {
    var obj = {}, words = str.split(" ");
    for (var i = 0; i < words.length; ++i) obj[words[i]] = true;
    return obj;
  }

  var defaultBuiltin = "bool boolean bit blob enum long longblob longtext medium mediumblob mediumint mediumtext time timestamp tinyblob tinyint tinytext text bigint int int1 int2 int3 int4 int8 integer float float4 float8 double char varbinary varchar varcharacter precision real date datetime year unsigned signed decimal numeric"

  CodeMirror.defineMIME("text/iotdb-sql", {
    name: "sql",
    keywords: set("non_negative_derivative derivative non_negative_difference difference time_difference bottom_k top_k string_matches string_contains abs sqrt log10 ln exp round floor ceil sign radians degrees atan acos asin tan cos sin int32 int64 float double boolean text false true null time timestamp lock any without debug explain tolerance like concat contain top asc desc stop start after before triggers trigger as functions function temporary schema for snapshot partition latest cache clear full global rename tags attributes compression align disable last last_value sum first_value avg max_value min_value max_time min_time level nodes count devices paths child move remove version info task flush ttl unset watermark_embedding load revoke password alter of all role privileges user list merge drop off on tracing using index link now values alias upsert add bitmap encoding insert create update delete select show query kill processlist grant into set where from to order by device configuration describe slimit limit unlink offset soffset fill linear previous previousuntillast metadata timeseries property with datatype compressor storage group label and or not comtains nan aligned append autoregister plain dictionary rle diff ts_2diff gorilla regular zigzag freq gzip lz4 snappy uncompressed begin boundary continuous cq cqs end every explain pipe pipes pipeserver pipesink pipesinks pipesinktype prune queries readonly regexp resample resource settle sglevel system template templates unload verify writable"),
    builtin: set("root now non_negative_derivative derivative non_negative_difference difference time_difference bottom_k top_k string_matches string_contains max_time min_time max_value min_value last_value first_value sum avg count abs sqrt log10 ln exp round floor ceil sign radians degrees atan acos asin tan cos sin false true null time timestamp int32 int64 float double boolean text"),
    atoms: set("dictionary diff gorilla plain regular rle ts_2diff zigzag freq gzip lz4 snappy uncompressed nan"),
    dateSQL: set(""),
    support: set("commentHash ODBCdotTable doubleQuote binaryNumber hexNumber")
  });

});

/*
  How Properties of Mime Types are used by SQL Mode
  =================================================

  keywords:
    A list of keywords you want to be highlighted.
  builtin:
    A list of builtin types you want to be highlighted (if you want types to be of class "builtin" instead of "keyword").
  operatorChars:
    All characters that must be handled as operators.
  client:
    Commands parsed and executed by the client (not the server).
  support:
    A list of supported syntaxes which are not common, but are supported by more than 1 DBMS.
    * ODBCdotTable: .tableName
    * zerolessFloat: .1
    * doubleQuote
    * nCharCast: N'string'
    * charsetCast: _utf8'string'
    * commentHash: use # char for comments
    * commentSlashSlash: use // for comments
    * commentSpaceRequired: require a space after -- for comments
  atoms:
    Keywords that must be highlighted as atoms,. Some DBMS's support more atoms than others:
    UNKNOWN, INFINITY, UNDERFLOW, NaN...
  dateSQL:
    Used for date/time SQL standard syntax, because not all DBMS's support same temporal types.
*/
