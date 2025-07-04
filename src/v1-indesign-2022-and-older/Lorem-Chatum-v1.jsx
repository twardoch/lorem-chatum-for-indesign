// Lorem Chatum v1.0 for Adobe InDesign 2022 and older
// Copyright (c) 2023 by Adam Twardoch
// https://github.com/twardoch/lorem-chatum-for-indesign
// Licensed under the GNU General Public License v3.0
// Uses the [standalone JSON](https://github.com/indiscripts/extendscript/tree/master/JSON) code, 
// Copyright (c) 2017-2022[Marc Autret](https://indiscripts.com/), licensed under the MIT license
// Uses the [Restix](https://github.com/grefel/restix/blob/master/restix.jsx) code 
// by [Gregor Fellenz](http://www.publishingx.de), licensed under the GNU General Public License v3.0 

// Create a new OpenAI API secret key at https://platform.openai.com/account/api-keys
// and paste it below
const OPENAI_API_KEY = 'sk-';

//// LIBS

/// https://raw.githubusercontent.com/indiscripts/extendscript/master/JSON/json.jsx

/*******************************************************************************

        Name:           JSON
        Desc:           JSON module for ExtendScript-based apps.
        Path:           json.jsx
        Require:        Nothing (IdExtenso is not needed here.)
        Encoding:       ÛȚF8
        Kind:           Standalone Version.
        API:            =lave() eval()
        DOM-access:     ---
        Todo:           ---
        Created:        171005 (YYMMDD)
        Modified:       171005 (YYMMDD)

*******************************************************************************/

//==========================================================================
// IMPORTANT NOTES
//==========================================================================

/*

This implementation is based on IdExtenso's JSON module, but it has been
packaged and slightly rewritten in a way that makes it independent. So
you can include [json.jsx] in projects that do not involve InDesign.

It creates a global JSON object (in fact, function) that provides two
methods:

- lave(any) : Take anything and return its stringified representation,
              more ExtendScript-friendly than JSON.stringify() would be.
              Note: this is an `automatic` method, meaning that
              `JSON.lave(x)` can be shortened `JSON(x)`. Some options
              are available, as detailed in the code.

- eval(str) : Basically equivalent to $.global.eval().
	
WARNING. - This module doesn't pretend to provide the original features
of `JSON.stringify()` and is entirely independent from D. Crockford's
implementation. It has been noticed that since ExtendScript is not
fully compliant with JS (=ECMA-262), the regular json code had various
issues in ExtendScript environments. The present code is an attempt to
fix this. It is *not supposed* to work in usual JavaScript contexts.

*/

if (!$.global.hasOwnProperty('JSON')) {
    //==========================================================================
    // Please, keep this shortcut to the localize function.
    //==========================================================================

    $.global['__'] = $.global.localize;

    //==========================================================================
    // OBJECT (temporary `setup` method, removed once JSON is installed.)
    //==========================================================================

    Object.prototype.setup = function (/*obj*/ o, k) {
        for (k in o) o.hasOwnProperty(k) && (this[k] = o[k]);
        return this;
    };

    //==========================================================================
    // NUMBER Proto.
    //==========================================================================

    Number.prototype.toSource =
        function toSource() //----------------------------------
        // [TODO] May be improved to get shorter strings ("1e5" etc)
        // => str
        {
            return String(this);
        };

    Number.prototype.toHexa = function toHexa(
    /*str='0x'*/ prefix,
    /*uint=0*/ zeroPad,
        s
    ) //----------------------------------
    // Return the "0xHHHH" representation of this number. (Uppercase hexa digits.)
    // [ADD170423] `prefix`   If provided (string), reset the prefix (default is "0x").
    // [ADD170423] `zeroPad`  If > 0, minimum length of the hexa representation.
    // ---
    // E.g  toHexa(123456)          => "0x1E240"
    // E.g  toHexa(123456, "U+")    => "U+1E240"
    // E.g  toHexa(123, "")         => "7B"
    // E.g  toHexa(123, "", 4)      => "007B"
    {
        if (isNaN(this)) return 'NaN';

        'string' == typeof prefix || (prefix = '0x');
        ('number' == typeof zeroPad && 0 < (zeroPad >>>= 0)) || (zeroPad = 0);

        s = this.toString(16).toUpperCase();

        return (
            prefix +
            (zeroPad && 0 < (zeroPad -= s.length)
                ? Array(1 + zeroPad).join('0')
                : '') +
            s
        );
    };

    Number.prototype.toAdbe =
        function toAdbe() //----------------------------------
        // Return the Adobe's 4-char string this number encodes.
        // [REM] Only makes sense if `this` is U32.
        // E.g  0x414F5069 => "AOPi" ; 0x74787466 => "txtf"
        {
            return isNaN(this)
                ? 'NaN'
                : String.fromCharCode(
                    0xff & (this >>> 24),
                    0xff & (this >>> 16),
                    0xff & (this >>> 8),
                    0xff & (this >>> 0)
                );
        };

    Number.prototype.isAdbe = function isAdbe(
        s
    ) //----------------------------------
    // Whether this Number looks like an Adobe 4-char tag.
    // [REM] Only makes sense if `this` is U32.
    // E.g  1114394470 => 1    ;    12345 => 0
    //  ie  0x426C4F66 [OK]        0x3039 [KO]
    {
        return +(
            8 == (s = this.toString(16).toUpperCase()).length && RegExp.ADBE.test(s)
        );
    };

    //==========================================================================
    // PATTERNS
    //==========================================================================

    // <BK> U+005C `\` Bakslash
    // -------------------------------------------------------------------------
    String.BK = '\u005C';
    RegExp.BK = /\u005C/g; // /BK/
    String._BK = String.BK + String.BK; // Regular esc `\\`
    RegExp._BK = /\u005C(?:\u005C|u005[Cc]|[xX]05[Cc])/g; // /any-esc/
    RegExp.BKBK = /\u005C\u005C/g; // /BKBK/ only

    // <SL> U+002F `/` Slash (Solidus)
    // -------------------------------------------------------------------------
    String.SL = '\u002F';
    RegExp.SL = /\u002F/g; // /SL/
    String._SL = String.BK + String.SL; // Regular esc `\/`
    RegExp._SL = /\u005C(?:\u002F|u002[Ff]|[xX]02[Ff])/g; // /any-esc/
    RegExp.BKSL = /\u005C\u002F/g; // /BKSL/ only
    RegExp.SLs = /\u002F+/g; // /SL+/

    // <DQ> U+0022 `"` Double Quote
    // <SQ> U+0027 `'` Single Quote
    // -------------------------------------------------------------------------
    String.DQ = '\u0022';
    RegExp.DQ = /\u0022/g; // /DQ/
    String._DQ = String.BKDQ = String.BK + String.DQ; // Regular esc `\"`
    RegExp.BKDQ = /\u005C\u0022/g; // /BKDQ/ only
    RegExp._DQ = /\u005C(?:\u0022|u0022|[xX]22)/g; // /any-esc/
    // ---
    String.SQ = '\u0027';
    RegExp.SQ = /\u0027/g; // /SQ/
    String._SQ = String.BKSQ = String.BK + String.SQ; // Regular esc `\"`
    RegExp.BKSQ = /\u005C\u0027/g; // /BKSQ/ only
    RegExp._SQ = /\u005C(?:\u0027|u0027|[xX]27)/g; // /any-esc/

    // <CR> U+000D \r  Carriage Return
    // <LF> U+000A \n  Line Feed
    // <LS> U+2028     Line Separator
    // <PS> U+2029     Paragraph Separator
    // ---
    // A LineTerminator character cannot appear in a string literal, even if
    // preceded by a backslash. The correct way to cause a line terminator
    // character to be part of the string value of a string literal is to use
    // an escape sequence such as \n or \u000A.
    // -------------------------------------------------------------------------
    String.CR = '\u000D';
    RegExp.CR = /\u000D/g; // /CR/
    String._CR = String.BK + 'r'; // Regular esc `\r`
    RegExp._CR = /\u005C(?:r|u000[Dd]|[xX]0[Dd])/g; // /any-esc/
    // ---
    String.LF = '\u000A';
    RegExp.LF = /\u000A/g; // /LF/
    String._LF = String.BK + 'n'; // Regular esc `\n`
    RegExp._LF = /\u005C(?:n|u000[Aa]|[xX]0[Aa])/g; // /any-esc/
    // ---
    String.CRLF = String.CR + String.LF; // <CRLF>=<CR>+<LF>
    RegExp.CRLF = RegExp(String.CRLF, 'g'); // /CRLF/
    String._CRLF = String._CR + String._LF; // Regular esc `\r\n`
    RegExp._CRLF =
        /\u005C(?:r|u000[Dd]|[xX]0[Dd])\u005C(?:n|u000[Aa]|[xX]0[Aa])/g; // /any-esc/
    // ---
    String.LS = '\u2028';
    RegExp.LS = /\u2028/g; // /LS/
    // ---
    String.PS = '\u2029';
    RegExp.PS = /\u2029/g; // /PS/
    // ---
    RegExp.LINE = /\u000D|\u000A|\u000D\u000A/g; // /CR|LF|CRLF/
    RegExp.LINEs = /[\u000D\u000A]+/g; // /CR|LF/+
    RegExp.JSNLs = /[\u000D\u000A\u2028\u2029]+/g; // /CR|LF|LS|PS/+  (JS newline)
    RegExp.TBNL = /[\u0009\u000D\u000A]/g; // /TB|CR|LF/

    // <TB> U+0009 `\t` Horizontal Tab.
    // <VT> U+000B `\v` Vertical Tab.
    // <BS> U+0008 `\b` Backspace.
    // <FF> U+000C `\f` Form Feed.
    // -------------------------------------------------------------------------
    String.TB = '\u0009';
    RegExp.TB = /\u0009/g; // /TB/
    String._TB = String.BK + 't'; // Regular esc `\t`
    RegExp._TB = /\u005C(?:t|u0009|[xX]09)/g; // /any-esc/
    // ---
    String.VT = '\u000B';
    RegExp.VT = /\u000B/g; // /VT/
    String._VT = String.BK + 'v'; // Regular esc `\v`
    RegExp._VT = /\u005C(?:v|u000[Bb]|[xX]0[Bb])/g; // /any-esc/
    // ---
    String.BS = '\u0008';
    RegExp.BS = /\u0008/g; // /BS/
    String._BS = String.BK + 'b'; // Regular esc `\b`
    RegExp._BS = /\u005C(?:b|u0008|[xX]08)/g; // /any-esc/
    // ---
    String.FF = '\u000C';
    RegExp.FF = /\u000C/g; // /FF/
    String._FF = String.BK + 'f'; // Regular esc `\f`
    RegExp._FF = /\u005C(?:f|u000[Cc]|[xX]0[Cc])/g; // /any-esc/

    // Other ASCII controls.
    // -------------------------------------------------------------------------
    String.X0 = '\u0000'; // U+0000 Nul
    RegExp.X0 = /\u0000/g; // /X0/
    RegExp._X0 = /\u005C(?:u0000|[xX]00|(?:0(?!\d)))/g; // /any-esc/
    // ---
    String.X1 = '\u0001'; // U+0001 Start of Heading
    RegExp.X1 = /\u0001/g; // /X1/
    RegExp._X1 = /\u005C(?:u0001|[xX]01)/g; // /any-esc/
    // ---
    String.X2 = '\u0002'; // U+0002 Start of Text
    RegExp.X2 = /\u0002/g; // /X2/
    // ---
    String.X3 = '\u0003'; // U+0003 End of Text [used in ID]
    RegExp.X3 = /\u0003/g; // /X3/
    // ---
    String.X4 = '\u0004'; // U+0004 End of Transm
    RegExp.X4 = /\u0004/g; // /X4/
    // ---
    String.X5 = '\u0005'; // U+0005 Enquiry
    RegExp.X5 = /\u0005/g; // /X5/
    // ---
    String.X6 = '\u0006'; // U+0006 Acknowledge
    RegExp.X6 = /\u0006/g; // /X6/
    // ---
    String.X7 = '\u0007'; // U+0007 Alert [used in ID]
    RegExp.X7 = /\u0007/g; // /X7/
    // ---
    String.XE = '\u000E'; // U+000E Locking-Shift-1
    RegExp.XE = /\u000E/g; // /XE/
    // ---
    String.XF = '\u000F'; // U+000F Locking-Shift-0
    RegExp.XF = /\u000F/g; // /XF/

    RegExp.BKuZ = /\u005Cu00/g; // `\u00`

    //==========================================================================
    // STRING Proto.
    //==========================================================================

    String.SourceEscapes = (function (
    /*str[]&*/ a,
        i,
        n,
        k
    ) //----------------------------------
    // Database entity used by toSource().
    //    index   =>  <CHAR>      ( = String.<CHAR_KEY> )
    //    <CHAR>  =>  <CHAR_KEY>
    {
        for (n = a.length, i = -1; ++i < n; k = a[i], a[(a[i] = String[k])] = k);
        return a;
    })(['BK', 'CR', 'LF', 'DQ', 'SQ', 'TB', 'BS', 'VT', 'FF']);

    // Backup of the native method
    // => String.__toSource__
    // ---
    'function' == typeof String.__toSource__ ||
        (String.__toSource__ = String.prototype.toSource);

    String.prototype.toSource = function toSource(
    /*<DQ>|<SQ>=<DQ>*/ quote,
    /*bool=0*/ allowUTF16,
        q,
        o,
        altQuote,
        r,
        i,
        s,
        k
    ) //----------------------------------
    // Return a quote-nested string so that eval(this.toSource())===this. This function
    // overrides the original toSource method in order to get shorter outputs. Examples:
    //
    //   INPUT STRING (JS)  |  OUTPUT CHARS (NATIVE METHOD)          |  OUTPUT CHARS (NEW VERSION)
    //   -------------------------------------------------------------------------------------------
    //   "abc"              |  (new String("abc"))                   |  "abc"
    //   -------------------------------------------------------------------------------------------
    //   "\\\r\n\t\v\f\0"   |  (new String("\\\r\n\t\x0B\f\x00"))    |  "\\\r\n\t\v\f\0"
    //   -------------------------------------------------------------------------------------------
    //   "àbçdé"            |  (new String("\u00E0b\u00E7d\u00E9"))  |  "\xE0b\xE7d\xE9"
    //
    // [REM] Tested on a jpeg file owning 23,052 bytes, the new method returns 60,433 characters
    // while the native method outputs 89,653 characters. Result is 67% lighter.
    //
    // `quote`      : Either <DQ> (default) or <SQ>. Use myStr.toSource("'") to get single quot nesting.
    // `allowUTF16` : Reserved. (For the time being, output is always a full ASCII string.)
    {
        // Aliases.
        // ---
        q = callee.Q;
        o = String.SourceEscapes;

        // Defaut quote is <DQ>, unless <SQ> is supplied.
        // altQuote :: quote==<DQ> ? <SQ> : <DQ>
        // ---
        String.SQ == quote || (quote = String.DQ);
        altQuote = String[String.SQ == quote ? 'DQ' : 'SQ'];

        // Take advantage of native toSource() performance.
        // ---
        i = (r = String.__toSource__.call(this)).length;

        // ---
        // [REM] `s` cannot contain non-ASCII char at this stage
        // so we can temporarily replace any escaped <BK> by <X1>,
        // then safely work on instances of other escaped chars.
        // ---

        r = r.substring(q.start, i + q.end).replace(RegExp._BK, String.X1);

        // `\u00` => `\x`
        // ---
        /// q.longUni && (r = r.replace(RegExp.BKuZ, String.BK + 'x'));

        // Improve native escapes according to improveEsc.
        // E.g. `\x0B` => `\v`
        // ---
        for (
            s = q.improvable, i = s.length;
            i--;
            k = '_' + o[s.charAt(i)], r = r.replace(RegExp[k], String[k])
        );

        // Manage alternate quote character. (Normal case is unsafeQuote==<SQ>.)
        // If( quote != unsafe ), nothing to do (quote is already escaped and unsafe is OK here.)
        // If( quote == unsafe ), unsafe => \unsafe ;  \altQuote => altQuote
        // If unsafe is empty (unusual!) all quotes are escaped, therefore
        // we need to remove escape seq for non-quote: \altQuote => altQuote
        // ---
        if (quote == q.unsafeQuote) {
            k = o[quote];
            r = r.replace(RegExp[k], String['_' + k]); // Repl. quote by its regular escape form
            k = o[altQuote];
            r = r.replace(RegExp['_' + k], altQuote); // Repl. any \altQuote by altQuote
        } else {
            q.unsafeQuote || (r = r.replace(RegExp['_' + o[altQuote]], altQuote));
        }

        // Special treatment for escaped NUL char. (Tricky!)
        // `\x00` --> `\0`  (lookahead != decimalDigit)
        // ---
        for (
            i = -2;
            -1 != (i = r.indexOf('\\x00', (i += 2)));
            isNaN(+('-' + r.charAt(4 + i))) &&
            (r = r.substr(0, 1 + i) + '0' + r.substr(4 + i))
        );

        // Final result.
        // ---
        return quote + r.replace(RegExp.X1, String._BK) + quote;
    };

    String.prototype.toSource.Q = (function (
    /*obj&*/ R,
        err,
        o,
        t,
        s,
        i,
        n,
        a
    ) //----------------------------------
    // Cached structure (-> toSource.)
    // => { start: int>0, end: int<0, longUni: 0|1, unsafeQuote: <DQ>|<SQ>|'', improvable: char* }
    // [REM] The once-call function parses ExtendScript's native toSource behavior.
    {
        err = '';
        o = String.SourceEscapes;

        // Create a test string for analyzing the original toSource().
        // ExtendScript produces verbose results looking like
        // s :: `(new String("ZZ\\ZZ\rZZ\nZZ\"...\x0BZZ\fZZ\u00C0ZZ"))`
        // ---
        t = 'ZZ';
        s = t + (o.join('') + '\xC0').split('').join(t) + t;
        s = String.__toSource__.call(s);

        // Compute magic offsets (start,end) so that string inside quotes
        // *always* matches src.substring(start, end+src.length).
        // ---
        R.start = s.indexOf(t);
        R.end = (i = t.length) + s.lastIndexOf(t) - (n = s.length);

        // Store escapes in array. Desired result is
        // a :: [<_BK>,<_CR>,<_LF>,<_DQ>,<SQ>,<_TB>,<_BS>,<_VT>,<_FF>,`\u00C0`]
        // ---
        a = s.substring(i + R.start, -i + n + R.end).split(t);

        // ---
        // Almost every character is reduced to its shortest escape sequence.
        // However, `\u00HH` can be shortened `\xHH` and `\x0B` is in fact `\v`.
        // Also, <DQ> is usually escaped while <SQ> is not. We now have enough
        // information to create a better toSource converter.
        // [REM] We assume ExtendScript *may change* the native method,
        // so we have to keep the algorithm fully agnostic.
        // ---

        // Whether we have to reduce `\u00HH`.
        // ---
        R.longUni = +(0 <= a.pop().indexOf('u00'));

        // Check that String.SourceEscapes and `a` have now the same length.
        // ---
        if (a.length != o.length) {
            err = 'A fatal error occured while analyzing String.prototype.toSource.';
        }

        // Check whether each escapable character is reduced as desired,
        // that is, a[i] == String['_'+o[o[i]]].
        // OK => Change a[i] into ''   (nothing to do, skip.)
        // KO => Change a[i] into o[i] (character whose esc must be improved.)
        // ---
        // [REM] For the sake of abstraction we allow unsafeQuote=='', which would
        // reflect native toSource() method to escape all quotation marks.
        // Such case wouldn't lead to errors in the present implementation :-)

        for (R.unsafeQuote = '', i = a.length; !err && i--;) {
            t = a[i]; // Native escape sequence, e.g `\r`
            s = o[o[i]]; // Key, e.g 'CR'.

            // Match case :-)
            // ---
            if (t == String['_' + s]) {
                a[i] = '';
                continue;
            }

            // Case where ExtendScript doesn't escape a quote,
            // usually t==<SQ>. That's OK anyway.
            // ---
            if (t == String.SQ || t == String.DQ) {
                R.unsafeQuote = t;
                a[i] = '';
                continue;
            }

            // ExtendScript does not escape <BK> the right way :-(
            // ---
            if ('BK' == s) {
                err = __(
                    'Unexpected escape sequence %1 for the backslash.',
                    String.__toSource__call(t)
                );
                break;
            }

            // ExtendScript does not output a capturable escape sequence :-(
            // ---
            if (!RegExp['_' + s].test(t)) {
                err = __(
                    'Cannot capture the escape sequence %1 for the character <%2>.',
                    String.__toSource__call(t),
                    s
                );
                break;
            }

            // Finally, we provide a better escape sequence. Typical case is <VT>
            // treated `\x0B` while it could be shortened `\v`. (We set a[i] to
            // o[i] only if our own esc is shorter.)
            // ---
            a[i] = 2 < t.length ? o[i] : '';
        }

        if (err) {
            throw Error(__('%1 > %2', 'Ext/string', err));
        }

        R.improvable = [a.join(''), (a.length = 0)][0];
        return R;
    })({});

    //==========================================================================
    // REGEXP Proto.
    //==========================================================================

    RegExp.prototype.flags = function flags() //----------------------------------
    // Flag-string of the regex in g-i-m order. See [ECMA].
    // => '' | 'g' | 'i' | 'm' | 'gi' | 'gm' | 'im' | 'gim'
    {
        return (
            (this.global ? 'g' : '') +
            (this.ignoreCase ? 'i' : '') +
            (this.multiline ? 'm' : '')
        );
    };

    RegExp.prototype.toSource =
        function toSource() //----------------------------------
        // Return a valid, ASCII-safe, uneval-string S for this
        // regex such as `this` is equivalent to eval(S).
        // ---
        // [REM] `S` has the form 'RegExp("str","flg")' where
        //       "str" comes from String.prototype.toSource(),
        //       so the full result is ASCII-safe and one-line.
        {
            // ALGORITHM IN USE.
            // ---
            // Problem. - `this` is a valid RegExp, but we don't
            // know whether it has been created thru a string,
            // RegExp("xyz"), or from a literal /xyz/. In either
            // cases this.source matches `xyz` but:
            //   (a)  "xyz"  MAY   contain '/' unescaped,
            //   (b)  /xyz/ CANNOT contain '/' unescaped,
            // Therefore the `source` is not consistent if
            // the declaration involved the '/' character.
            // For example, say source == `a\/b`
            // in case (a) the pattern is /a\\\/b/, matching `a\/b`
            // in case (b) the pattern is /a\/b/  , matching `a/b`
            // (a) RegExp("a\\/b","g")
            // ---
            // Solution:
            // 1. Replace /BKBK/ by `\x5C`   { `\\` } => `\x5C`
            // 2. Replace /BKSL/ by <SL>     { `\/` } => `/`
            // 3. Replace /SL/  by `\x2F`    { `/`  } => `\x2F`

            return $.global.localize(
                'RegExp(%1,"%2")',
                (this.source || '(?:)') // As [ECMA] suggests for ''.
                    .replace(RegExp.BKBK, '\\x5C') // Step 1.
                    .replace(RegExp.BKSL, String.SL) // Step 2.
                    .replace(RegExp.SL, '\\x2F') // Step 3.
                    .toSource(),
                this.flags()
            );
        };

    //==========================================================================
    // JSON (Core.)
    //==========================================================================

    $.global.JSON = function JSON(x, y, z, t) {
        return callee[callee.__auto__].call(callee, x, y, z, t);
    };

    $.global.JSON.setup({
        __auto__: 'lave',
        toString: function toString() {
            return 'JSON';
        },
        toSource: function toSource() {
            return '$.global["JSON"]';
        },

        '~': {
            NEWL: '\r',
            GLOB: function () {
                return this;
            }.call(null),
            GSTR: function () {
                return this.String;
            }.call(null),
            GOBJ: function () {
                return this.Object;
            }.call(null),
            GREG: function () {
                return this.RegExp;
            }.call(null),
            GNUM: function () {
                return this.Number;
            }.call(null),
            GFCT: function () {
                return this.Function;
            }.call(null),
            ANOF: '' + function () { }.name,
        },
    });

    //==========================================================================
    // JSON (Private tools.)
    //==========================================================================

    $.global.JSON['~'].setup({
        ODEL: function (/*obj&*/ o, k) //----------------------------------
        // Non-recursive Key Deleter.
        // => `o`
        {
            for (k in o) o.hasOwnProperty(k) && delete o[k];
            return o;
        },

        BRKN: function (/*str*/ s) //----------------------------------
        // Whether s is a 'broken' spec path.
        // => 1 (broken) | 0 (not-broken)
        {
            return +(
                0 < s.indexOf('script-preferences') ||
                (callee.Q || (callee.Q = /@(find|change).+shadow-settings$/)).test(s)
            );
        },

        EST$: function ($0) //----------------------------------
        // ESTN Replacer.
        // [REM] `this` is not the private zone, so we load
        // the String ctor in callee.Q.
        {
            return callee.Q['_' + callee.Q.SourceEscapes[$0]];
        }.setup({ Q: JSON['~'].GSTR }),

        ESTN: function (/*str*/ s) //----------------------------------
        // Escape '\t', '\r' and '\n'
        // XXX<TB>YYY<CR><LF>ZZZ  =>  `XXX\tYYY\r\nZZZ`
        {
            return s.replace(this.GREG.TBNL, this.EST$);
        },

        OTOS: function (/*obj*/ o) //----------------------------------
        // E.g: => "[object RegExp]", "[object Array]" "[object global]" etc
        {
            return this.GOBJ.prototype.toString.call(o);
        },

        NASO: function (/*obj*/ o, /*str*/ k) //----------------------------------
        // Tell whether o has-NOT-OwnProperty k (secure.)
        // => 1 | 0
        {
            return 1 - this.GOBJ.prototype.hasOwnProperty.call(o, k);
        },

        NATV: function (/*fct*/ f, q, s, p) //----------------------------------
        // Tell whether `f` is native.
        // [REM] String(Object) is something like "{...[native code]...}"
        {
            return (
                (q =
                    callee.Q ||
                    (callee.Q = this.GOBJ.toSource().substr(
                        this.GOBJ.toSource().indexOf('{')
                    ))),
                0 > (p = (s = f.toSource()).indexOf(q))
                    ? 0
                    : +(s.length == p + q.length)
            );
        },

        OKID: function (/*str*/ s) //----------------------------------
        // Tell whether `s` is a valid JS identifier.
        {
            try {
                this.GFCT('var ' + s);
                return 1;
            } catch (_) {
                return 0;
            }
        },

        REFS: function (/*ref*/ o, q, n, i) //----------------------------------
        // Reference Stack Manager (prevent cycles), init in lave()
        // => 1 (already in stack) | 0 (just added)
        {
            i = n = (q = callee.Q).length;
            while (i--) {
                if (o === q[i]) return 1;
            }

            return (q[n] = o), 0;
        }.setup({ Q: [] }),

        DOMS: function (/*dom*/ o, q, k, s, t) //----------------------------------
        // DOM Spec Cache Manager (prevent cycles), init. in lave()
        // => 1 (already-in-stack) | 0 (just-added) | -1 (dont-browse)
        {
            if ((q = callee.Q).hasOwnProperty((k = o.toSpecifier()))) return q[k];

            s = this.KDOM ? 'resolve(' + k.toSource() + ')' : k.toSource();

            t =
                (this.BRKN(k) && '/*broken*/ ') ||
                (!o.hasOwnProperty('properties') && '/*no-prop*/');

            q[k] = (this.SPCE && this.KDOM ? t || '/*cycle*/ ' : '') + s;

            return t ? q[k] : '';
        }.setup({ Q: {} }),
    });

    //==========================================================================
    // JSON (ExtendScript & ScriptUI natives.)
    //==========================================================================

    $.global.JSON['~'].setup({
        NTVF: {
            '_!': 'UnitValue()|',
            '_%': 'UnitValue()|',
            '_*': 'UnitValue()|',
            '_+': 'UnitValue()|',
            '_-': 'UnitValue()|',
            '_/': 'UnitValue()|',
            '_<': 'UnitValue()|',
            '_<=': 'UnitValue()|',
            '_==': 'UnitValue()|',
            '_===': 'UnitValue()|',
            '_~': 'UnitValue()|',
            // ---
            _Array: '|',
            _Boolean: '|',
            _Button: '|',
            _Checkbox: '|',
            _Date: '|',
            _Dictionary: '|',
            _DropDownList: '|',
            _EditText: '|',
            _Error: '|',
            _Event: '|',
            _ExternalObject: '|',
            _File: '|',
            _Folder: '|',
            _Function: '|',
            _Group: '|',
            _IconButton: '|',
            _ListBox: '|',
            _ListItem: '|',
            _Namespace: '|',
            _Number: '|',
            _Object: '|',
            _Panel: '|',
            _Progressbar: '|',
            _QName: '|',
            _RadioButton: '|',
            _Reflection: '|',
            _ReflectionInfo: '|',
            _RegExp: '|',
            _ScriptUI: '|',
            _Scrollbar: '|',
            _Slider: '|',
            _Socket: '|',
            _StaticText: '|',
            _String: '|',
            _TreeView: '|',
            _UIEvent: '|',
            _UnitValue: '|',
            _Window: '|',
            _XML: '|',
            _XMLList: '|',
            // ---
            _about: '$|',
            _abs: 'Math|',
            _acos: 'Math|',
            _add: 'Window|TreeView|Panel|ListBox|Group|DropDownList|',
            _addEventListener:
                'Window|TreeView|StaticText|Slider|Scrollbar|RadioButton|Progressbar|Panel|' +
                'ListItem|ListBox|IconButton|Group|EditText|DropDownList|Checkbox|Button|',
            _alert: '|Window|',
            _anchor: 'String.prototype|',
            _as: 'UnitValue()|',
            _asin: 'Math|',
            _atan: 'Math|',
            _atan2: 'Math|',
            _beep: '|',
            _big: 'String.prototype|',
            _blink: 'String.prototype|',
            _bold: 'String.prototype|',
            _bp: '$|',
            _ceil: 'Math|',
            _center: 'Window|',
            _changePath: 'Folder.prototype|File.prototype|',
            _charAt: 'String.prototype|',
            _charCodeAt: 'String.prototype|',
            _close: 'Window|Socket.prototype|File.prototype|',
            _colorPicker: '$|',
            _compile: 'RegExp.prototype|',
            _concat: 'Array.prototype|String.prototype|',
            _confirm: '|Window|',
            _convert: 'UnitValue()|',
            _copy: 'File.prototype|',
            _cos: 'Math|',
            _create: 'Folder.prototype|',
            _createAlias: 'File.prototype|',
            _decode: 'Folder|File|',
            _decodeURI: '|',
            _decodeURIComponent: '|',
            _defaultSettings: 'XML|',
            _dispatchEvent:
                'Window|TreeView|StaticText|Slider|Scrollbar|RadioButton|Progressbar|Panel|' +
                'ListItem|ListBox|IconButton|Group|EditText|DropDownList|Checkbox|Button|',
            _encode: 'Folder|File|',
            _encodeURI: '|',
            _encodeURIComponent: '|',
            _escape: '|',
            _eval: '|',
            _evalFile: '$|',
            _exec: 'RegExp.prototype|',
            _execute: 'Folder.prototype|File.prototype|',
            _exit: '|',
            _exp: 'Math|',
            _find: 'Window|TreeView|ListBox|DropDownList|',
            _findElement: 'Window|',
            _fixed: 'String.prototype|',
            _floor: 'Math|',
            _fontcolor: 'String.prototype|',
            _fontsize: 'String.prototype|',
            _fromCharCode: 'String|',
            _gc: '$|',
            _getClass: 'Dictionary.prototype|',
            _getClasses: 'Dictionary.prototype|',
            _getDate: 'Date.prototype|',
            _getDay: 'Date.prototype|',
            _getFiles: 'Folder.prototype|',
            _getFullYear: 'Date.prototype|',
            _getGroups: 'Dictionary.prototype|',
            _getHours: 'Date.prototype|',
            _getMilliseconds: 'Date.prototype|',
            _getMinutes: 'Date.prototype|',
            _getMonth: 'Date.prototype|',
            _getRelativeURI: 'Folder.prototype|File.prototype|',
            _getResourceText: 'ScriptUI|',
            _getSeconds: 'Date.prototype|',
            _getTime: 'Date.prototype|',
            _getTimezoneOffset: 'Date.prototype|',
            _getUTCDate: 'Date.prototype|',
            _getUTCDay: 'Date.prototype|',
            _getUTCFullYear: 'Date.prototype|',
            _getUTCHours: 'Date.prototype|',
            _getUTCMilliseconds: 'Date.prototype|',
            _getUTCMinutes: 'Date.prototype|',
            _getUTCMonth: 'Date.prototype|',
            _getUTCSeconds: 'Date.prototype|',
            _getYear: 'Date.prototype|',
            _getenv: '$|',
            _hasOwnProperty: 'Object.prototype|',
            _hide:
                'Window|TreeView|StaticText|Slider|Scrollbar|RadioButton|Progressbar|Panel|' +
                'ListBox|IconButton|Group|EditText|DropDownList|Checkbox|Button|',
            _indexOf: 'String.prototype|',
            _isEncodingAvailable: 'Folder|File|',
            _isFinite: '|',
            _isNaN: '|',
            _isPrototypeOf: 'Object.prototype|',
            _isValid: 'Object|',
            _isXMLName: '|',
            _italics: 'String.prototype|',
            _join: 'Array.prototype|',
            _lastIndexOf: 'String.prototype|',
            _link: 'String.prototype|',
            _list: '$|',
            _listLO: '$|',
            _listen: 'Socket.prototype|',
            _localeCompare: 'String.prototype|',
            _localize: '|',
            _log: 'Math|',
            _match: 'String.prototype|',
            _max: 'Math|',
            _min: 'Math|',
            _newImage: 'ScriptUI|',
            _newFont: 'ScriptUI|',
            _notify:
                'Window|TreeView|StaticText|Slider|Scrollbar|RadioButton|' +
                'ListBox|IconButton|EditText|DropDownList|Checkbox|Button|',
            _now: 'Date|',
            _open: 'Socket.prototype|File.prototype|',
            _openDialog: 'File|',
            _openDlg: 'Folder.prototype|File.prototype|',
            _parse: 'Date|',
            _parseFloat: '|',
            _parseInt: '|',
            _poll: 'Socket.prototype|',
            _pop: 'Array.prototype|',
            _pow: 'Math|',
            _print: 'File.prototype|',
            _prompt: '|Window|',
            _propertyIsEnumerable: 'Object.prototype|',
            _push: 'Array.prototype|',
            _random: 'Math|',
            _read: 'Socket.prototype|File.prototype|',
            _readch: 'File.prototype|',
            _readln: 'Socket.prototype|File.prototype|',
            _remove:
                'Window|TreeView|Panel|ListBox|Group|DropDownList|Folder.prototype|File.prototype|',
            _removeAll: 'TreeView|ListBox|DropDownList|',
            _removeEventListener:
                'Window|TreeView|StaticText|Slider|Scrollbar|RadioButton|Progressbar|Panel|' +
                'ListItem|ListBox|IconButton|Group|EditText|DropDownList|Checkbox|Button|',
            _rename: 'Folder.prototype|File.prototype|',
            _replace: 'String.prototype|',
            _resolve: '|Folder.prototype|File.prototype|',
            _revealItem: 'ListBox|',
            _reverse: 'Array.prototype|',
            _round: 'Math|',
            _runtimeError: 'Error|',
            _saveDialog: 'File|',
            _saveDlg: 'Folder.prototype|File.prototype|',
            _search: 'String.prototype|ExternalObject|',
            _seek: 'File.prototype|',
            _selectDialog: 'Folder|',
            _selectDlg: 'Folder.prototype|',
            _setDate: 'Date.prototype|',
            _setDefaultXMLNamespace: '|',
            _setFullYear: 'Date.prototype|',
            _setHours: 'Date.prototype|',
            _setMilliseconds: 'Date.prototype|',
            _setMinutes: 'Date.prototype|',
            _setMonth: 'Date.prototype|',
            _setSeconds: 'Date.prototype|',
            _setSettings: 'XML|',
            _setTime: 'Date.prototype|',
            _setUTCDate: 'Date.prototype|',
            _setUTCFullYear: 'Date.prototype|',
            _setUTCHours: 'Date.prototype|',
            _setUTCMilliseconds: 'Date.prototype|',
            _setUTCMinutes: 'Date.prototype|',
            _setUTCMonth: 'Date.prototype|',
            _setUTCSeconds: 'Date.prototype|',
            _setYear: 'Date.prototype|',
            _setenv: '$|',
            _settings: 'XML|',
            _shift: 'Array.prototype|',
            _show:
                'Window|TreeView|StaticText|Slider|Scrollbar|RadioButton|Progressbar|Panel|' +
                'ListBox|IconButton|Group|EditText|DropDownList|Checkbox|Button|',
            _sin: 'Math|',
            _sleep: '$|',
            _slice: 'Array.prototype|String.prototype|',
            _small: 'String.prototype|',
            _sort: 'Array.prototype|',
            _splice: 'Array.prototype|',
            _split: 'String.prototype|',
            _sqrt: 'Math|',
            _strike: 'String.prototype|',
            _sub: 'String.prototype|',
            _substr: 'String.prototype|',
            _substring: 'String.prototype|',
            _summary: '$|',
            _sup: 'String.prototype|',
            _tan: 'Math|',
            _tell: 'File.prototype|',
            _test: 'RegExp.prototype|',
            _toDateString: 'Date.prototype|',
            _toExponential: 'Number.prototype|',
            _toFixed: 'Number.prototype|',
            _toGMTString: 'Date.prototype|',
            _toLocaleDateString: 'Date.prototype|',
            _toLocaleLowerCase: 'String.prototype|',
            _toLocaleString:
                'Array.prototype|Object.prototype|Date.prototype|Number.prototype|',
            _toLocaleTimeString: 'Date.prototype|',
            _toLocaleUpperCase: 'String.prototype|',
            _toLowerCase: 'String.prototype|',
            _toPrecision: 'Number.prototype|',
            _toSource:
                'Window|UIEvent|TreeView|StaticText|Slider|Scrollbar|RadioButton|Progressbar|Panel|' +
                'ListItem|ListBox|IconButton|Group|Event|EditText|DropDownList|Checkbox|Button|' +
                'Array.prototype|Object.prototype|Function.prototype|Folder.prototype|File.prototype|' +
                'Error.prototype|RegExp.prototype|Date.prototype|String.prototype|Number.prototype|' +
                'ExternalObject|Array|Object|Function|Socket|ReflectionInfo|Reflection|' +
                'UnitValue|QName|Namespace|Folder|File|Error|XMLList|XML|RegExp|Date|String|Number|',
            _toString:
                'Array.prototype|Object.prototype|Function.prototype|Folder.prototype|File.prototype|' +
                'Error.prototype|RegExp.prototype|Date.prototype|String.prototype|Number.prototype|' +
                'Array|Object|Function|Socket|ReflectionInfo|Reflection|Folder|File|Error|' +
                'RegExp|Date|String|Number|$|',
            _toTimeString: 'Date.prototype|',
            _toUTCString: 'Date.prototype|',
            _toUpperCase: 'String.prototype|',
            _toXML: 'Dictionary.prototype|',
            _unescape: '|',
            _uneval: '|',
            _unshift: 'Array.prototype|',
            _unwatch: 'Object.prototype|',
            _update: 'Window|',
            _UTC: 'Date|',
            _valueOf:
                'Object.prototype|Date.prototype|String.prototype|Number.prototype|',
            _watch: 'Object.prototype|',
            _write: 'Socket.prototype|File.prototype|$|',
            _writeln: 'Socket.prototype|File.prototype|$|',
        },

        SRCN: function (
      /*str*/ name,
      /*fct*/ f,
            k,
            pfx,
            s,
            p,
            t
        ) //----------------------------------
        // Search Native Function.
        // => '' [KO] | entire-string-path-from-global [OK].
        // E.g:
        // `((function(){return this}).call(null))["ListItem"]`
        // `((function(){return this}).call(null))["isNaN"]`
        // `((function(){return this}).call(null)).Folder.prototype["changePath"]`
        // `((function(){return this}).call(null)).UnitValue()["<="]`
        {
            // Agnostic global reference string.
            // ---
            pfx = callee.Q || (callee.Q = this['\x01global']());

            // Not in registered names (NTVF)
            // -> check in [[global]] and $
            // ---
            if (this.NASO(this.NTVF, (k = '_' + name))) {
                t = this.GLOB[name];
                if ('function' == typeof t && t === f) {
                    return pfx + '[' + name.toSource('"') + ']';
                }

                t = this.GLOB.$[name];
                if ('function' == typeof t && t === f) {
                    return this['\x01$']() + '[' + name.toSource('"') + ']';
                }

                return '';
            }

            name = name.toSource('"'); // `"<name>"`

            // Search for this function among registered hosts.
            // ---
            for (s = this.NTVF[k]; -1 != (p = s.indexOf('|'));) {
                // E.g :: '' | '.Folder' | '.UnitValue()' | '.String.prototype'
                // ---
                (t = s.substring(0, p)) && (t = '.' + t);

                // E.g :: `(((function(){return this}).call(null)).Folder["decode"])`
                // ---
                t = pfx + t + '[' + name + ']';
                if (f === this.GLOB.eval('(' + t + ')')) return t;
                s = s.substr(1 + p);
            }

            return '';
        },
    });

    //==========================================================================
    // JSON (Private core process.)
    //==========================================================================

    $.global.JSON['~'].setup({
        NSOB: '({})', // Not-supported-obj  --depends on SPACED in lave().
        NSFC: '(function%1(){})', // Not-supported-func --depends on SPACED in lave().
        NTFC: '(function%1(){})', // Native-func        --depends on SPACED in lave().
        SNAN: 'Number.NaN', // Secure NaN [ADD170501] --may be REDUCED to '+{}'.
        GBCD: '$.global', // Global code        --can be changed from lave().
        DLCD: '$', // Dollar code        --can be changed from lave().
        SPCE: '', // Spaces or empty    --depends on SPACED in lave().
        RDCD: 0, // Reduced form       --depends on SPACED in lave().
        KDOM: 0, // Keep DOM access    --depends on DOM_ACCESS in lave()

        INDT: '', // Current indentation.
        INLP: 0, // Entered in a Array/Object loop.

        KARR: JSON['~'].OTOS([]), // "[object Array]"
        KREG: JSON['~'].OTOS(/z/), // "[object RegExp]"

        ADBE: function (/*u32*/ n) {
            return (
                n.toHexa() +
                (this.RDCD
                    ? ''
                    : __('%2/*%2[%1]%2*/', n.toAdbe(), this.SPCE ? ' ' : ''))
            );
        },

        //----------------------------------
        // Scalars from typeof, and associated 'classes.'
        //----------------------------------

        '\x01undefined': function (x) {
            return this.RDCD ? 'void 0' : 'undefined';
        },
        // ---
        '\x01boolean': function (x) {
            return this.RDCD ? (x.valueOf() ? '!0' : '!1') : this.GSTR(x);
        },
        '\x01Boolean': function (x) {
            return this['\x01boolean'](x);
        },
        // --- [CHG170501] Improving NaN output => this.SNAN ('Number.NaN').
        '\x01number': function (x) {
            return this.GLOB.isNaN(x) ? this.SNAN : this.GSTR(x);
        },
        '\x01Number': function (x) {
            return this['\x01number'](x);
        },
        // --- Thanks to extended String proto.
        '\x01string': function (x) {
            return x.toSource();
        },
        '\x01String': function (x) {
            return this['\x01string'](x);
        },

        //----------------------------------
        // Date.
        //----------------------------------

        '\x01Date': function (x) {
            return this.GLOB.uneval(x);
        }, // => '(new Date(zzz))'

        //----------------------------------
        // RegExp ('function'==typeof x), thanks to extended RegExp proto.
        //----------------------------------

        '\x01RegExp': function (x) {
            return x.toSource();
        }, // => 'RegExp("xyz","flg")'

        //----------------------------------
        // XML ('xml'==typeof x), and associated classes.
        //----------------------------------

        '\x01xml': function (x) {
            return x.toXMLString();
        }, // => '<xyz>...</xyz>'
        '\x01XML': function (x) {
            return this['\x01xml'](x);
        },
        '\x01XMLList': function (x) {
            return this['\x01xml'](x);
        },

        //----------------------------------
        // Static, native and special references.
        //----------------------------------

        '\x01global': function (x) {
            return this.INLP || 'undefined' == typeof x
                ? this.GBCD
                : this['\x01Object'](x);
        },
        '\x01$': function (x) {
            return this.INLP || 'undefined' == typeof x
                ? this.DLCD
                : this['\x01Object'](x);
        },
        '\x01Math': function (x) {
            return this.INLP || 'undefined' == typeof x
                ? this['\x01global']() + '.Math'
                : this['\x01Object'](x);
        },

        //----------------------------------
        // InDesign DOM objects (detected thru `toSpecifier`.)
        //----------------------------------

        '\x01DomObj': function (x) {
            return this.DOMS(x) || this.LAVE(x.properties);
        },

        //----------------------------------
        // Structural objects (JS and ExtendScript.)
        //----------------------------------

        '\x01Error': function (
            x // => 'Error(xxx)'
        ) {
            return __(
                'Error(%1,%2,%3)',
                this.GSTR(x.description || '').toSource(),
                this.GSTR(x.fileName || '').toSource(),
                this.GSTR(x.line)
            );
        },

        '\x01File': function (
            x // => 'File("asciiString")'
        ) {
            return __('File(%1)', this.GSTR(x.fullName).toSource());
        },

        '\x01Folder': function (
            x // => 'Folder("asciiString")'
        ) {
            return __('Folder(%1)', this.GSTR(x.fullName).toSource());
        },

        '\x01Namespace': function (
            x // => 'Namespace("prefix","uri")'
        ) {
            return __(
                'Namespace(%1,%2)',
                this.GSTR(x.prefix).toSource(),
                this.GSTR(x.uri).toSource()
            );
        },

        '\x01QName': function (
            x // => 'QName("uri","name")'
        ) {
            return __(
                'QName(%1,%2)',
                this.GSTR(x.uri).toSource(),
                this.GSTR(x.localName).toSource()
            );
        },

        '\x01UnitValue': function (
            x // => 'UnitValue("val_type")'
        ) {
            return __('UnitValue("%1")', this.GSTR(x.value) + x.type);
        },

        //----------------------------------
        // Other special ExtendScript objects.
        //----------------------------------

        '\x01Reflection': function (x) {
            return this.NSOB;
        }, // => '({*not supported*})'
        '\x01ReflectionInfo': function (x) {
            return this.NSOB;
        }, // => '({*not supported*})'
        '\x01Socket': function (x) {
            return '(new Socket)';
        }, // => '(new Socket)'

        //----------------------------------
        // References.
        //----------------------------------

        '\x01function': function (x, s, t, b) //----------------------------------
        // 'function' entry point (including the special RegExp case.)
        // [REM] 'function' == typeof /myRegex/
        {
            if (this.KREG == this.OTOS(x)) {
                return this['\x01RegExp'](x);
            }

            // Search among native functions.
            // ---
            s = x.name;
            if ((b = this.NATV(x)) && (t = this.SRCN(s, x))) {
                return t;
            }

            return __(
                this[b ? 'NTFC' : 'NSFC'],
                s != this.ANOF && this.OKID(s) ? ' ' + s : ''
            );
        },

        '\x01Function': function (x) //----------------------------------
        // -> this['function'](x)
        {
            return this['\x01function'](x);
        },

        '\x01object': function (x, k) //----------------------------------
        // 'object' entry point (i.e 'object'==typeof x.)
        // ---
        // [REM] Allows an external module or class to 'inject' its
        // own method for generating a source string according to a specific
        // constructor. For example, BigInt may want to stringify its instances
        // in a way that keeps them readable, `BigInt("xxx")`. The regular way
        // to provide this mechanism is to define from the outer class a
        // $$.JSON['~']['\x02<ctor>'] method, referred to as a 'JSON hook.'
        // A valid JSON hook must both (1) check that the incoming argument is
        // an actual instance of the class (e.g `x.constructor===<class>`),
        // (2) return a non-empty string that evaluates to an equivalent instance.
        // Keep in mind that the `this` context of a JSON hook is JSON['~'].
        // See $$.BigInt implementation for a full example. Note also that the
        // JSON hook mechanism only works in COMPACT or REDUCED mode.
        {
            // Array.
            // [REM] Additional properties won't be stringified (!)
            // ---
            if (this.KARR == this.OTOS(x)) return this['\x01Array'](x);

            // Special DOM object case.
            // ---
            if (x.hasOwnProperty('toSpecifier')) {
                return this['\x01DomObj'](x);
            }

            // [ADD170608] Object hook.
            // If the SPACED mode is off, look whether x's constructor name matches
            // a class registered here as a `\x02...` key (hook.) If so,
            // do not browse the object and return its stringified source instead,
            // unless \x02<ctor>(x) generates a falsy output.
            // ---
            if (
                !this.SPCE &&
                (k = x.constructor.name) &&
                this.hasOwnProperty((k = '\x02' + k)) &&
                (k = this[k](x))
            ) {
                return k;
            }

            // Known class, or default.
            // ---
            // [REM] Althoug myObj.__class__ is supposed to be "Object" (titlecase),
            // comparing k against "object" (lowercase) is not a typo. Indeed we want to
            // be absolutely sure that the present function won't go into infinite loop.
            // Anyway it should never happen--in principle--that x.__class__ be "object".
            // ---
            ((k = x.__class__) &&
                'object' != k &&
                this.hasOwnProperty((k = '\x01' + k))) ||
                (k = '\x01Object');

            return this[k](x);
        },

        '\x01Object': function (
            x,
            q,
            dq,
            sp,
            a,
            z,
            s
        ) //----------------------------------
        // Regular Object loop.
        {
            if (this.REFS(x)) return '{/*cycle*/}';
            this.INLP = 1;

            dq = this.INDT = (q = this.INDT) + this.SPCE;
            sp = this.SPCE ? ' ' : '';

            z = (a = []).length;
            for (s in x) {
                if (this.NASO(x, s)) continue;
                a[z++] = s.toSource() + sp + ':' + sp + this.LAVE(x[s]);
            }

            s =
                0 === z
                    ? '{}'
                    : dq
                        ? '{' +
                        this.NEWL +
                        dq +
                        a.join(',' + this.NEWL + dq) +
                        this.NEWL +
                        q +
                        '}'
                        : '{' + sp + a.join(',' + sp) + sp + '}';

            return (a.length = 0), (this.INDT = q), s;
        },

        '\x01Array': function (
            x,
            q,
            dq,
            sp,
            a,
            n,
            z,
            i,
            s,
            sz
        ) //----------------------------------
        // Regular Array loop.
        {
            if (this.REFS(x)) return '[/*cycle*/]';
            this.INLP = 1;

            dq = this.INDT = (q = this.INDT) + this.SPCE;
            sp = this.SPCE ? ' ' : '';

            for (
                z = (a = []).length, n = x.length, i = -1, sz = 0;
                ++i < n;
                sz += (a[z++] = this.LAVE(x[i])).length
            );

            s =
                0 === z
                    ? '[]'
                    : dq && (10 < z || 15 * z < sz)
                        ? '[' +
                        this.NEWL +
                        dq +
                        a.join(',' + this.NEWL + dq) +
                        this.NEWL +
                        q +
                        ']'
                        : '[' + sp + a.join(',' + sp) + sp + ']';

            return (a.length = 0), (this.INDT = q), s;
        },
    });

    //==========================================================================
    // JSON (Private LAVE routine.)
    //==========================================================================

    $.global.JSON['~'].setup({
        LAVE: function (/*any*/ x) //----------------------------------
        {
            return null === x ? 'null' : this['\x01' + typeof x](x);
        },
    });

    //==========================================================================
    // JSON (Public API.)
    //==========================================================================

    $.global.JSON.setup({
        lave: function lave(
      /*any*/ x,
      /*-1|0|+1=0*/ SPACED,
      /*0|1=0*/ DOM_ACCESS,
            I,
            t,
            ns,
            nt
        ) //----------------------------------
        // Properly uneval (almost) anything in ExSc/SUI context.
        // [REM] Prevents Array/Object cycles;
        //       Supports RegExp, File/Folder, UnitValue, XML/XMLList/QName/Namespace
        //       Error, Date,
        //       some native functions and static references, etc.
        // `SPACED` :: whether the result must be reduced(-1), compact(0:default) or extended(+1).
        //     - Compact means one-line ASCII -- unless `x` contains some XML [TODO].
        //     - Extended(+1) means multiline and verbose.
        //     - Reduced(-1) is similar to compact, but it provides additional shortcuts
        //       such as `!0` instead of `true`, etc. [ADD170418]
        // `DOM_ACCESS` :: whether the result should maintain DOM accesses thru
        //       `resolve()` (InDesign specific feature.) Default is 0, meaning that the
        //       output string is safe from any underlying DOM command. In particular,
        //       references of the form `resolve(<path>)` are changed into `"<path>"`.
        // => uneval-string
        {
            I = callee.mumumu['~'];
            t = XML.prettyPrinting;

            // [ADD170418] Normalize SPACED ; set I.RDCD.
            // Warning: (undefined < 0) is TRUE in ExtendScript (!)
            // ---
            SPACED || (SPACED = 0);
            I.RDCD = +(0 > SPACED);
            SPACED = +(0 < SPACED);

            // [ADD170501] Secure NaN.
            // ---
            I.SNAN = I.RDCD ? '+{}' : 'Number.NaN';

            ns = SPACED ? '/*non supported*/' : '';
            nt = SPACED ? '/*native code*/' : '';

            XML.prettyPrinting = !!SPACED;

            I.SPCE = SPACED ? '    ' : '';
            I.NSOB = __('({%1})', ns);
            I.NSFC = __('(%1{%2})', 'function%1()', ns);
            I.NTFC = __('(%1{%2})', 'function%1()', nt);

            I.INDT = '';
            I.INLP = 0;

            // Manage [[global]] and $ reference strings.
            // ---
            // [REM] If `$` and `$.global` point to their usual refs in the context from
            // where lave is invoked, then it is assumed they are valid in the context of
            // the client code as well. Otherwise, agnostic references are preferred.
            // ---
            if (I.GLOB === ($ || '').global) {
                // Usual references.
                // ---
                I.GBCD = '$.global';
                I.DLCD = '$';
            } else {
                // Agnostic references.
                // ---
                I.GBCD = '((function(){return this}).call(null))';
                I.DLCD = I.GBCD + '["$"]';
            }

            I.REFS.Q.length = 0;

            I.KDOM = DOM_ACCESS ? 1 : 0;
            I.ODEL(I.DOMS.Q)['/'] = DOM_ACCESS
                ? 'resolve(' + '/'.toSource() + ')'
                : '"/"';
            // ---
            x = I.LAVE(x);
            // ---
            I.REFS.Q.length = 0;
            I.ODEL(I.DOMS.Q);

            XML.prettyPrinting = t;
            return x;
        }.setup({ mumumu: $.global.JSON }),

        eval: function eval(/*str*/ src) //----------------------------------
        // Call eval on a 'laved' source string.
        // => any
        {
            return callee.mumumu['~'].GLOB.eval('(' + src + ')');
        }.setup({ mumumu: $.global.JSON }),
    });

    //==========================================================================
    // Cleanup
    //==========================================================================

    delete Object.prototype.setup;
}

/// https://github.com/grefel/restix/blob/master/restix.jsx

/****************
# Connect InDesign to the web
* HTTPS supported 
* Works form CS4 to CC 2022 (ExtendScript based library)
* Based on VBScript/ServerXMLHTTP (Win) AppleScript/curl (Mac) relies on app.doScript()

## Getting started
See examples/connect.jsx

* @Version: 1.34
* @Date: 2023-01-23
* @Author: Gregor Fellenz, http://www.publishingx.de
* Acknowledgments: 
** Library design pattern from Marc Autret https://forums.adobe.com/thread/1111415
*/

$.global.hasOwnProperty('restix') ||
    (function (HOST, SELF) {
        HOST[SELF] = SELF;

        /****************
         * PRIVATE
         */
        var INNER = {};
        INNER.version = '2022-03-29-1.33';

        /** Returns if the operating system is windows
         * @return {String} true | false
         */
        INNER.isWindows = function () {
            return $.os.indexOf('Windows') > -1;
        };

        /** Check the request information object and construct a full URL
         * @param {request} Request information object
         * @returns{request} Request information object or throws an error
         */
        INNER.checkRequest = function (request) {
            if (request.url == undefined || request.url == '')
                throw Error('No property [url] found/set');
            if (request.url.toString().slice(-1) == '/')
                request.url = request.url.toString().slice(0, -1);

            if (request.command == undefined) request.command = '';
            if (request.command.toString()[0] == '/')
                request.command = request.command.toString().substr(1);

            if (request.port == undefined) request.port = '';
            if (isNaN(request.port)) throw Error('[port] is Not a Number');

            // Add port
            if (request.port != '') {
                request.fullURL = request.url + ':' + request.port;
            } else {
                request.fullURL = request.url;
            }

            // Add command
            if (request.command != '') {
                request.fullURL = request.fullURL + '/' + request.command;
            }

            // not encoded, we need to encode;
            if (decodeURI(request.fullURL) == request.fullURL) {
                request.fullURL = encodeURI(request.fullURL);
            }

            if (request.method == undefined || request.method == '')
                request.method = 'GET';
            if (
                !(
                    request.method == 'GET' ||
                    request.method == 'POST' ||
                    request.method == 'PUT' ||
                    request.method == 'PATCH' ||
                    request.method == 'DELETE' ||
                    request.method == 'HEAD'
                )
            )
                throw Error('Method ' + request.method + ' is not supported'); // Missing HEAD

            if (
                request.method == 'POST' &&
                (request.binaryFilePath == undefined || request.binaryFilePath == '')
            )
                request.binaryFilePath = false;

            if (request.headers == undefined) request.headers = [];
            if (!(request.headers instanceof Array))
                throw Error("Provide [headers] as Array of {name:'',value''} objects");
            if (request.body == undefined || request.body == '') request.body = false;

            if (request.body && request.binaryFilePath)
                throw Error('You must not provide [body] and [binaryFilePath]');

            if (request.unsafe == undefined) request.unsafe = false;

            if (request.proxy == undefined) request.proxy = false;

            return request;
        };

        /** The main connection function. Need to be slashed
         * @return {response} Response result object
         */
        INNER.processRequest = function (request, outFile) {
            var response = {
                error: false,
                errorMsg: '',
                body: '',
                httpStatus: 900,
            };

            var scriptCommands = [];
            var result = '';

            if (INNER.isWindows()) {
                // Since Win10 Update Feb 2019 msxml3 does not work anymore...
                scriptCommands.push(
                    'Dim xHttp : Set xHttp = CreateObject("MSXML2.ServerXMLHTTP.6.0")'
                );
                // Konstanten für ADODB.Stream
                scriptCommands.push('Const adTypeBinary = 1');
                scriptCommands.push('Const adSaveCreateOverWrite = 2');
                scriptCommands.push('Const adModeReadWrite = 3');

                scriptCommands.push('Dim res');
                scriptCommands.push('On Error Resume Next');
                scriptCommands.push(
                    'xHttp.Open "' +
                    request.method +
                    '", "' +
                    request.fullURL +
                    '", False'
                );

                if (request.proxy != false) {
                    // xHttp.SetProxy 1
                    scriptCommands.push('xHttp.setProxy 2, "' + request.proxy + '"');
                }

                for (var i = 0; i < request.headers.length; i++) {
                    scriptCommands.push(
                        'xHttp.setRequestHeader "' +
                        request.headers[i].name +
                        '","' +
                        request.headers[i].value.replace(/"/g, '""') +
                        '"'
                    );
                }
                if (request.unsafe) {
                    //~ ' 2 stands for SXH_OPTION_IGNORE_SERVER_SSL_CERT_ERROR_FLAGS
                    //~ ' 13056 means ignore all server side cert error
                    scriptCommands.push('xHttp.setOption 2, 13056');
                }

                if (request.body) {
                    scriptCommands.push(
                        'xHttp.Send "' +
                        request.body.replace(/"/g, '""').replace(/\n|\r/g, '') +
                        '"'
                    );
                } else if (
                    (request.method == 'POST' || request.method == 'PUT') &&
                    request.binaryFilePath
                ) {
                    // http://www.vbforums.com/showthread.php?418570-RESOLVED-HTTP-POST-a-zip-file
                    scriptCommands.push('    Dim sFile');
                    scriptCommands.push('    sFile = "' + request.binaryFilePath + '"');

                    scriptCommands.push(
                        '    Set objStream = CreateObject("ADODB.Stream")'
                    );
                    scriptCommands.push('    objStream.Type = adTypeBinary');
                    scriptCommands.push('    objStream.Mode = adModeReadWrite');
                    scriptCommands.push('    objStream.Open');
                    scriptCommands.push('    objStream.LoadFromFile(sFile)');

                    scriptCommands.push(
                        '    xHttp.SetRequestHeader "Content-Length", objStream.Size'
                    );
                    scriptCommands.push('    xHttp.Send objStream.Read(objStream.Size)');
                    scriptCommands.push('    Set objStream= Nothing');
                } else {
                    scriptCommands.push('xHttp.Send');
                }

                scriptCommands.push('If err.Number = 0 Then');

                if (outFile) {
                    scriptCommands.push(
                        '    Set objStream = CreateObject("ADODB.Stream")'
                    );
                    scriptCommands.push('    objStream.Type = adTypeBinary');
                    scriptCommands.push('    objStream.Mode = adModeReadWrite');
                    scriptCommands.push('    objStream.Open');
                    scriptCommands.push('    objStream.Write xHttp.responseBody');
                    scriptCommands.push(
                        '    objStream.SaveToFile "' +
                        outFile.fsName +
                        '" , adSaveCreateOverWrite'
                    );
                    scriptCommands.push('    objStream.Close');
                    scriptCommands.push('    Set objStream= Nothing');
                    /*	
                               ADODB.Stream let's you also save text data and let's you specify charset (codepage) for text-to-binary data conversion (against of Scripting.TextStream object). 
                              Const adTypeText = 2
                              Const adSaveCreateOverWrite = 2
                            
                              'Create Stream object
                              Dim BinaryStream
                              Set BinaryStream = CreateObject("ADODB.Stream")
                            
                              'Specify stream type - we want To save text/string data.
                              BinaryStream.Type = adTypeText
                            
                              'Specify charset For the source text (unicode) data.
                              If Len(CharSet) > 0 Then
                                  BinaryStream.CharSet = CharSet
                              End If
                            
                              'Open the stream And write binary data To the object
                              BinaryStream.Open
                              BinaryStream.WriteText Text
                            
                              'Save binary data To disk
                              BinaryStream.SaveToFile FileName, adSaveCreateOverWrite
                          End Function
                              */
                    scriptCommands.push(
                        '	res = "outFile" &  vbCr & "-----http-----" & xHttp.getAllResponseHeaders &  vbCr & "-----http-----" &  xHttp.status'
                    );
                } else {
                    scriptCommands.push(
                        '	res = xHttp.responseText  &  vbCr & "-----http-----" & xHttp.getAllResponseHeaders &  vbCr & "-----http-----" &  xHttp.status'
                    );
                }

                scriptCommands.push('Else');
                scriptCommands.push(
                    '	res =  "xHttpError "  & Err.Description &  " " & Err.Number'
                );
                scriptCommands.push('End If');

                scriptCommands.push('Set xHttp = Nothing');
                scriptCommands.push('returnValue = res');

                scriptCommands = scriptCommands.join('\r\n');

                try {
                    result = app.doScript(scriptCommands, ScriptLanguage.VISUAL_BASIC);
                } catch (e) {
                    result = 'doScriptError: ' + e.message + ' #' + e.number;
                }
            } else {
                // Mac
                // -L follow redirects
                var curlString = 'curl --silent --max-time 30 --show-error -g -L ';
                for (var i = 0; i < request.headers.length; i++) {
                    curlString +=
                        " -H '" +
                        request.headers[i].name +
                        ': ' +
                        request.headers[i].value +
                        "'";
                }
                if (request.unsafe) {
                    // Es gab einen Fall wo am Mac mit -k es nicht funktioniert hat curl: (35) Server aborted the SSL handshake
                    curlString += ' -k ';
                }

                if (request.proxy != false) {
                    curlString += ' --proxy ' + request.proxy;
                }

                if (request.method == 'HEAD') {
                    curlString += ' -I --head ';
                } else {
                    curlString += ' -X ' + request.method;
                }
                if (request.body) {
                    var bodybody = request.body
                        .replace(/"/g, '\\"')
                        .replace(/\n|\r/g, '')
                        .replace(/\\u/g, '\\\\u');
                    curlString += " -d '" + bodybody + "'";
                } else if (
                    (request.method == 'POST' || request.method == 'PUT') &&
                    request.binaryFilePath
                ) {
                    curlString += " --data-binary '@" + request.binaryFilePath + "'";
                }

                if (outFile) {
                    curlString += " -w 'outFile\n-----http-----%{http_code}'";
                    curlString += " -o '" + outFile.fsName + "'";
                } else {
                    curlString += " -w '\n-----http-----%{http_code}'";
                }
                curlString += " '" + request.fullURL + "'";
                shellScript = 'do shell script "' + curlString + '"';
                try {
                    result = app.doScript(
                        shellScript,
                        ScriptLanguage.APPLESCRIPT_LANGUAGE
                    );
                } catch (e) {
                    result = 'doScriptError: ' + e.message + ' #' + e.number;
                }
            }

            // Fill response
            if (typeof result == 'undefined') {
                throw Error('No result value. Probably System Script could not run?');
            }
            if (result.match(/^xHttpError|^curl: \(\d+\)|^doScriptError:/)) {
                response.error = true;
                response.errorMsg = result;
            } else {
                if (INNER.isWindows()) {
                    var resArray = result.split('\r-----http-----');
                    if (resArray.length == 3) {
                        response.body = resArray[0];
                        response.head = resArray[1];
                        response.httpStatus = resArray[2] * 1;
                    } else {
                        throw Error('Wrong result value: [' + result + ']');
                    }
                } else {
                    var resArray = result.split('\r-----http-----');
                    if (resArray.length == 2) {
                        if (request.method == 'HEAD') {
                            response.head = resArray[0];
                            response.body = '';
                        } else {
                            response.head = '';
                            response.body = resArray[0];
                        }
                        response.httpStatus = resArray[1] * 1;
                    } else {
                        throw Error('Wrong result value: [' + result + ']');
                    }
                }

                var headSplit = response.head.split(/\n|\r/);
                response.head = {};
                for (var h = 0; h < headSplit.length; h++) {
                    var headProperty = headSplit[h];
                    if (headProperty.replace(/\s/g, '') == '') continue;
                    var colonIndex = headProperty.indexOf(':');
                    response.head[headProperty.substring(0, colonIndex).toLowerCase()] =
                        headProperty.substring(colonIndex + 1).replace(/^ +/, '');
                }
            }

            return response;
        };

        /****************
         * API
         */
        /** Process an HTTP Request
         * @param {request} Request object with connection Information
         * @return {response} Response object {error:error, errorMsg:errorMsg, body:body, httpStatus:httpStatus}
         */
        SELF.fetch = function (request) {
            request = INNER.checkRequest(request);
            return INNER.processRequest(request, false);
        };

        /** Process an HTTP Request and writes the result to a give File
         * @param {request} Request Object with connection Information
         * @param {outFile} File to write to
         * @return {response} Response object {error:error, errorMsg:errorMsg, body:body, httpStatus:httpStatus}
         */
        SELF.fetchFile = function (request, outFile) {
            if (outFile == undefined) throw Error('No file provided');
            if (outFile instanceof String) outFile = File(outFile);

            request = INNER.checkRequest(request);
            var response = INNER.processRequest(request, outFile);
            if (!outFile.exists) {
                response.error = true;
                response.errorMsg = 'File was not created\n' + response.errorMsg;
            }
            return response;
        };
    })($.global, {
        toString: function () {
            return 'restix';
        },
    });

// Example Request
//  var request = {
//  	url:"https://www.publishingx.de/",
// }
// var response = restix.fetch(request);
// $.writeln("Response HTTP Status: " + response.httpStatus);
// $.writeln("Response Body: " + response.body);

//// LOGIC

/**
 * This script is used to connect to the OpenAI API and complete text in a selected text frame.
 * 
 * The script first connects to the OpenAI API using the provided API key, prompt, language, and maximum tokens.
 * 
 * The script then collects the context of the selected text frame and sends it to the OpenAI API for completion.
 * 
 * The completion is then added to the end of the selected text frame.
 * 
 * The script also includes helper functions for collecting text from pages, counting words, and estimating tokens.
 * 
 * @version 1.0
 * @since 2021-11-01
 */

/**
 * This function connects to the OpenAI API using the provided API key, prompt, language, and maximum tokens.
 * 
 * @param {string} apiKey - The API key for the OpenAI API.
 * @param {string} prompt - The prompt to send to the OpenAI API for completion.
 * @param {string} lang - The language of the text to be completed.
 * @param {number} maxTokens - The maximum number of tokens to be returned by the OpenAI API.
 * @returns {string} - The completion returned by the OpenAI API.
 */
function openAIApi(apiKey, prompt, lang, maxTokens) {
    // Request object
    var body = JSON.lave({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system',
                content:
                    'Write an essay in ' +
                    lang +
                    ', to the max length, by continuing the prompt. Do not ask anything, do not add anything that is not requested.',
            },
            { role: 'user', content: prompt },
        ],
        temperature: 1,
        max_tokens: maxTokens,
        top_p: 1,
        n: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });
    var request = {
        url: 'https://api.openai.com/v1/chat/completions',
        method: 'POST',
        headers: [
            { name: 'Content-Type', value: 'application/json' },
            { name: 'Authorization', value: 'Bearer ' + apiKey },
        ],
        body: body,
        unsafe: true, // Needed if there's an SSL certificate issue
    };

    // Fetch the data
    var response = restix.fetch(request);

    // Check if there's an error
    if (response.error) {
        throw new Error('Error connecting to OpenAI API: ' + response.errorMsg);
    }

    // Parse the JSON response
    var responseData = JSON.eval(response.body);
    var completion = responseData.choices[0].message.content;
    // Return the completion
    return completion;
}

/**
 * This function collects the context of the selected text frame and sends it to the OpenAI API for completion.
 * 
 * @param {TextFrame} textFrame - The selected text frame.
 * @returns {string} - The context of the selected text frame.
 */
function getContext(textFrame) {
    var context = textFrame.contents;
    if (context.length === 0) {
        context = collectPageText(textFrame);
    }
    return context;
}

/**
 * This function collects the text from the pages of the selected text frame.
 * 
 * @param {TextFrame} textFrame - The selected text frame.
 * @returns {string} - The text from the pages of the selected text frame.
 */
function collectPageText(textFrame) {
    var currentPage = textFrame.parentPage;
    var doc = currentPage.parent;
    var pages = [];

    pages.push(currentPage);

    var combinedText = '';
    var maxWords = 500;
    for (var i = 0; i < pages.length; i++) {
        combinedText += getTextFromPage(pages[i]);
        if (wordCount(combinedText) >= maxWords) {
            combinedText = capTextAtWords(combinedText, maxWords);
            break;
        }
    }

    return combinedText;
}

/**
 * This function collects the text from a page.
 * 
 * @param {Page} page - The page to collect text from.
 * @returns {string} - The text from the page.
 */
function getTextFromPage(page) {
    var textFrames = page.textFrames;
    var combinedText = '';

    for (var i = 0; i < textFrames.length; i++) {
        combinedText += textFrames[i].contents + ' ';
    }

    return combinedText;
}

/**
 * This function counts the number of words in a string.
 * 
 * @param {string} text - The string to count words in.
 * @returns {number} - The number of words in the string.
 */
function wordCount(text) {
    var words = text.replace(/^\s+|\s+$/g, '').split(/\s+/);
    return words.length;
}

/**
 * This function caps the text at a certain number of words.
 * 
 * @param {string} text - The text to cap.
 * @param {number} wordLimit - The maximum number of words to allow.
 * @returns {string} - The capped text.
 */
function capTextAtWords(text, wordLimit) {
    var words = text.replace(/^\s+|\s+$/g, '').split(/\s+/);
    var cappedWords = words.slice(0, wordLimit);
    return cappedWords.join(' ');
}

/**
 * This function estimates the number of tokens needed to complete the selected text frame.
 * 
 * @param {TextFrame} textFrame - The selected text frame.
 * @returns {number} - The estimated number of tokens needed to complete the selected text frame.
 */
function estimateTokens(textFrame) {
    var frameWidth = textFrame.geometricBounds[3] - textFrame.geometricBounds[1];
    var frameHeight = textFrame.geometricBounds[2] - textFrame.geometricBounds[0];
    var fontSize = textFrame.texts[0].pointSize;
    var lineHeight = fontSize * 1.2;

    var avgCharWidth = fontSize * 0.6;
    var charsPerLine = Math.floor(frameWidth / avgCharWidth);
    var lines = Math.floor(frameHeight / lineHeight);

    var estimatedChars = charsPerLine * lines;
    var estimatedTokens = Math.min(Math.ceil(estimatedChars * 2), 4095);

    return estimatedTokens;
}

/**
 * This function gets the completion from the OpenAI API using the provided context, language, and estimated tokens.
 * 
 * @param {string} context - The context to send to the OpenAI API for completion.
 * @param {string} lang - The language of the text to be completed.
 * @param {number} estimatedTokens - The estimated number of tokens to be returned by the OpenAI API.
 * @returns {string} - The completion returned by the OpenAI API.
 */
function getOpenAICompletion(context, lang, estimatedTokens) {
    var apiKey = OPENAI_API_KEY;
    var prompt = context.replace(/[\r\n]+/g, ' ') + ' ';
    var completion = '';

    completion = openAIApi(apiKey, prompt, lang, estimatedTokens);

    return ' ' + completion.replace(/^\n/, '');
}

/**
 * This function completes the selected text frame using the OpenAI API.
 * 
 * The function first checks if a text frame is selected and sets the language to the desired language.
 * 
 * The function then collects the context of the selected text frame and estimates the number of tokens needed to complete it.
 * 
 * The function then sends the context to the OpenAI API for completion and adds the completion to the end of the selected text frame.
 * 
 * The function also includes helper functions for collecting text from pages, counting words, and estimating tokens.
 * 
 * @version 1.0
 * @since 2021-11-01
 */
function completeSelectedFrameText() {
    // Check if a text frame is selected
    if (
        app.documents.length === 0 ||
        app.selection.length !== 1 ||
        app.selection[0].constructor.name !== 'TextFrame'
    ) {
        alert(
            'Please select a text frame, and set the Character language to the desired language.'
        );
        return;
    }

    var textFrame = app.selection[0];
    var context = getContext(textFrame);
    var lang = textFrame.texts[0].appliedLanguage.name.split(':')[0];
    //alert("CONTEXT: " + context);
    var estimatedTokens = estimateTokens(textFrame);
    //alert("TOKENS: " + estimatedTokens + " LANG: " + lang);
    var completion = getOpenAICompletion(context, lang, estimatedTokens);
    //alert("COMPLETION: " + completion);
    textFrame.contents += completion;
}

completeSelectedFrameText();
