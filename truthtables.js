var truthtables = {
    parser: (function () {
        /*
         * Generated by PEG.js 0.7.0.
         *
         * http://pegjs.majda.cz/
         */

        function quote(s) {
            /*
             * ECMA-262, 5th ed., 7.8.4: All characters may appear literally in a
             * string literal except for the closing quote character, backslash,
             * carriage return, line separator, paragraph separator, and line feed.
             * Any character may appear in the form of an escape sequence.
             *
             * For portability, we also escape escape all control and non-ASCII
             * characters. Note that "\0" and "\v" escape sequences are not used
             * because JSHint does not like the first and IE the second.
             */
            return '"' + s.replace(/\\/g, '\\\\') // backslash
                .replace(/"/g, '\\"') // closing quote character
                .replace(/\x08/g, '\\b') // backspace
                .replace(/\t/g, '\\t') // horizontal tab
                .replace(/\n/g, '\\n') // line feed
                .replace(/\f/g, '\\f') // form feed
                .replace(/\r/g, '\\r') // carriage return
                .replace(/[\x00-\x07\x0B\x0E-\x1F\x80-\uFFFF]/g, escape) + '"';
        }

        var result = {
            /*
             * Parses the input with a generated parser. If the parsing is successfull,
             * returns a value explicitly or implicitly specified by the grammar from
             * which the parser was generated (see |PEG.buildParser|). If the parsing is
             * unsuccessful, throws |PEG.parser.SyntaxError| describing the error.
             */
            parse: function (input, startRule) {
                var parseFunctions = {
                    "equivalence": parse_equivalence,
                    "implication": parse_implication,
                    "or": parse_or,
                    "and": parse_and,
                    "negation": parse_negation,
                    "primary": parse_primary,
                    "variable": parse_variable
                };

                if (startRule !== undefined) {
                    if (parseFunctions[startRule] === undefined) {
                        throw new Error("Invalid rule name: " + quote(startRule) + ".");
                    }
                } else {
                    startRule = "equivalence";
                }

                var pos = 0;
                var reportFailures = 0;
                var rightmostFailuresPos = 0;
                var rightmostFailuresExpected = [];

                function padLeft(input, padding, length) {
                    var result = input;

                    var padLength = length - input.length;
                    for (var i = 0; i < padLength; i++) {
                        result = padding + result;
                    }

                    return result;
                }

                function escape(ch) {
                    var charCode = ch.charCodeAt(0);
                    var escapeChar;
                    var length;

                    if (charCode <= 0xFF) {
                        escapeChar = 'x';
                        length = 2;
                    } else {
                        escapeChar = 'u';
                        length = 4;
                    }

                    return '\\' + escapeChar + padLeft(charCode.toString(16).toUpperCase(), '0', length);
                }

                function matchFailed(failure) {
                    if (pos < rightmostFailuresPos) {
                        return;
                    }

                    if (pos > rightmostFailuresPos) {
                        rightmostFailuresPos = pos;
                        rightmostFailuresExpected = [];
                    }

                    rightmostFailuresExpected.push(failure);
                }

                function parse_equivalence() {
                    var result0, result1, result2;
                    var pos0, pos1;

                    pos0 = pos;
                    pos1 = pos;
                    result0 = parse_implication();
                    if (result0 !== null) {
                        if (input.substr(pos, 3) === "<=>") {
                            result1 = "<=>";
                            pos += 3;
                        } else {
                            result1 = null;
                            if (reportFailures === 0) {
                                matchFailed("\"<=>\"");
                            }
                        }
                        if (result1 !== null) {
                            result2 = parse_equivalence();
                            if (result2 !== null) {
                                result0 = [result0, result1, result2];
                            } else {
                                result0 = null;
                                pos = pos1;
                            }
                        } else {
                            result0 = null;
                            pos = pos1;
                        }
                    } else {
                        result0 = null;
                        pos = pos1;
                    }
                    if (result0 !== null) {
                        result0 = (function (offset, left, right) {
                            return {
                                vars: left.vars.concat(right.vars),
                                eval: function (vars) {
                                    return left.eval(vars) === right.eval(vars)
                                }
                            }
                        })(pos0, result0[0], result0[2]);
                    }
                    if (result0 === null) {
                        pos = pos0;
                    }
                    if (result0 === null) {
                        result0 = parse_implication();
                    }
                    return result0;
                }

                function parse_implication() {
                    var result0, result1, result2;
                    var pos0, pos1;

                    pos0 = pos;
                    pos1 = pos;
                    result0 = parse_or();
                    if (result0 !== null) {
                        if (input.substr(pos, 2) === "=>") {
                            result1 = "=>";
                            pos += 2;
                        } else {
                            result1 = null;
                            if (reportFailures === 0) {
                                matchFailed("\"=>\"");
                            }
                        }
                        if (result1 !== null) {
                            result2 = parse_implication();
                            if (result2 !== null) {
                                result0 = [result0, result1, result2];
                            } else {
                                result0 = null;
                                pos = pos1;
                            }
                        } else {
                            result0 = null;
                            pos = pos1;
                        }
                    } else {
                        result0 = null;
                        pos = pos1;
                    }
                    if (result0 !== null) {
                        result0 = (function (offset, left, right) {
                            return {
                                vars: left.vars.concat(right.vars),
                                eval: function (vars) {
                                    return !left.eval(vars) || right.eval(vars)
                                }
                            }
                        })(pos0, result0[0], result0[2]);
                    }
                    if (result0 === null) {
                        pos = pos0;
                    }
                    if (result0 === null) {
                        result0 = parse_or();
                    }
                    return result0;
                }

                function parse_or() {
                    var result0, result1, result2;
                    var pos0, pos1;

                    pos0 = pos;
                    pos1 = pos;
                    result0 = parse_and();
                    if (result0 !== null) {
                        if (input.substr(pos, 2) === "||") {
                            result1 = "||";
                            pos += 2;
                        } else {
                            result1 = null;
                            if (reportFailures === 0) {
                                matchFailed("\"||\"");
                            }
                        }
                        if (result1 !== null) {
                            result2 = parse_or();
                            if (result2 !== null) {
                                result0 = [result0, result1, result2];
                            } else {
                                result0 = null;
                                pos = pos1;
                            }
                        } else {
                            result0 = null;
                            pos = pos1;
                        }
                    } else {
                        result0 = null;
                        pos = pos1;
                    }
                    if (result0 !== null) {
                        result0 = (function (offset, left, right) {
                            return {
                                vars: left.vars.concat(right.vars),
                                eval: function (vars) {
                                    return left.eval(vars) || right.eval(vars)
                                }
                            }
                        })(pos0, result0[0], result0[2]);
                    }
                    if (result0 === null) {
                        pos = pos0;
                    }
                    if (result0 === null) {
                        result0 = parse_and();
                    }
                    return result0;
                }

                function parse_and() {
                    var result0, result1, result2;
                    var pos0, pos1;

                    pos0 = pos;
                    pos1 = pos;
                    result0 = parse_negation();
                    if (result0 !== null) {
                        if (input.substr(pos, 2) === "&&") {
                            result1 = "&&";
                            pos += 2;
                        } else {
                            result1 = null;
                            if (reportFailures === 0) {
                                matchFailed("\"&&\"");
                            }
                        }
                        if (result1 !== null) {
                            result2 = parse_and();
                            if (result2 !== null) {
                                result0 = [result0, result1, result2];
                            } else {
                                result0 = null;
                                pos = pos1;
                            }
                        } else {
                            result0 = null;
                            pos = pos1;
                        }
                    } else {
                        result0 = null;
                        pos = pos1;
                    }
                    if (result0 !== null) {
                        result0 = (function (offset, left, right) {
                            return {
                                vars: left.vars.concat(right.vars),
                                eval: function (vars) {
                                    return left.eval(vars) && right.eval(vars)
                                }
                            }
                        })(pos0, result0[0], result0[2]);
                    }
                    if (result0 === null) {
                        pos = pos0;
                    }
                    if (result0 === null) {
                        result0 = parse_negation();
                    }
                    return result0;
                }

                function parse_negation() {
                    var result0, result1;
                    var pos0, pos1;

                    pos0 = pos;
                    pos1 = pos;
                    if (input.charCodeAt(pos) === 33) {
                        result0 = "!";
                        pos++;
                    } else {
                        result0 = null;
                        if (reportFailures === 0) {
                            matchFailed("\"!\"");
                        }
                    }
                    if (result0 !== null) {
                        result1 = parse_primary();
                        if (result1 !== null) {
                            result0 = [result0, result1];
                        } else {
                            result0 = null;
                            pos = pos1;
                        }
                    } else {
                        result0 = null;
                        pos = pos1;
                    }
                    if (result0 !== null) {
                        result0 = (function (offset, primary) {
                            return {
                                vars: primary.vars,
                                eval: function (vars) {
                                    return !primary.eval(vars)
                                }
                            }
                        })(pos0, result0[1]);
                    }
                    if (result0 === null) {
                        pos = pos0;
                    }
                    if (result0 === null) {
                        result0 = parse_primary();
                    }
                    return result0;
                }

                function parse_primary() {
                    var result0, result1, result2;
                    var pos0, pos1;

                    result0 = parse_variable();
                    if (result0 === null) {
                        pos0 = pos;
                        pos1 = pos;
                        if (input.charCodeAt(pos) === 40) {
                            result0 = "(";
                            pos++;
                        } else {
                            result0 = null;
                            if (reportFailures === 0) {
                                matchFailed("\"(\"");
                            }
                        }
                        if (result0 !== null) {
                            result1 = parse_equivalence();
                            if (result1 !== null) {
                                if (input.charCodeAt(pos) === 41) {
                                    result2 = ")";
                                    pos++;
                                } else {
                                    result2 = null;
                                    if (reportFailures === 0) {
                                        matchFailed("\")\"");
                                    }
                                }
                                if (result2 !== null) {
                                    result0 = [result0, result1, result2];
                                } else {
                                    result0 = null;
                                    pos = pos1;
                                }
                            } else {
                                result0 = null;
                                pos = pos1;
                            }
                        } else {
                            result0 = null;
                            pos = pos1;
                        }
                        if (result0 !== null) {
                            result0 = (function (offset, equivalence) {
                                return {
                                    vars: equivalence.vars,
                                    eval: function (vars) {
                                        return equivalence.eval(vars)
                                    }
                                }
                            })(pos0, result0[1]);
                        }
                        if (result0 === null) {
                            pos = pos0;
                        }
                    }
                    return result0;
                }

                function parse_variable() {
                    var result0, result1;
                    var pos0;

                    reportFailures++;
                    pos0 = pos;
                    if (/^[a-zA-Z]/.test(input.charAt(pos))) {
                        result1 = input.charAt(pos);
                        pos++;
                    } else {
                        result1 = null;
                        if (reportFailures === 0) {
                            matchFailed("[a-zA-Z]");
                        }
                    }
                    if (result1 !== null) {
                        result0 = [];
                        while (result1 !== null) {
                            result0.push(result1);
                            if (/^[a-zA-Z]/.test(input.charAt(pos))) {
                                result1 = input.charAt(pos);
                                pos++;
                            } else {
                                result1 = null;
                                if (reportFailures === 0) {
                                    matchFailed("[a-zA-Z]");
                                }
                            }
                        }
                    } else {
                        result0 = null;
                    }
                    if (result0 !== null) {
                        result0 = (function (offset, letters) {
                            return {
                                vars: letters,
                                eval: function (vars) {
                                    return vars[letters]
                                }
                            }
                        })(pos0, result0);
                    }
                    if (result0 === null) {
                        pos = pos0;
                    }
                    reportFailures--;
                    if (reportFailures === 0 && result0 === null) {
                        matchFailed("variable");
                    }
                    return result0;
                }


                function cleanupExpected(expected) {
                    expected.sort();

                    var lastExpected = null;
                    var cleanExpected = [];
                    for (var i = 0; i < expected.length; i++) {
                        if (expected[i] !== lastExpected) {
                            cleanExpected.push(expected[i]);
                            lastExpected = expected[i];
                        }
                    }
                    return cleanExpected;
                }

                function computeErrorPosition() {
                    /*
                     * The first idea was to use |String.split| to break the input up to the
                     * error position along newlines and derive the line and column from
                     * there. However IE's |split| implementation is so broken that it was
                     * enough to prevent it.
                     */

                    var line = 1;
                    var column = 1;
                    var seenCR = false;

                    for (var i = 0; i < Math.max(pos, rightmostFailuresPos); i++) {
                        var ch = input.charAt(i);
                        if (ch === "\n") {
                            if (!seenCR) {
                                line++;
                            }
                            column = 1;
                            seenCR = false;
                        } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
                            line++;
                            column = 1;
                            seenCR = true;
                        } else {
                            column++;
                            seenCR = false;
                        }
                    }

                    return {
                        line: line,
                        column: column
                    };
                }


                var result = parseFunctions[startRule]();

                /*
                 * The parser is now in one of the following three states:
                 *
                 * 1. The parser successfully parsed the whole input.
                 *
                 *    - |result !== null|
                 *    - |pos === input.length|
                 *    - |rightmostFailuresExpected| may or may not contain something
                 *
                 * 2. The parser successfully parsed only a part of the input.
                 *
                 *    - |result !== null|
                 *    - |pos < input.length|
                 *    - |rightmostFailuresExpected| may or may not contain something
                 *
                 * 3. The parser did not successfully parse any part of the input.
                 *
                 *   - |result === null|
                 *   - |pos === 0|
                 *   - |rightmostFailuresExpected| contains at least one failure
                 *
                 * All code following this comment (including called functions) must
                 * handle these states.
                 */
                if (result === null || pos !== input.length) {
                    var offset = Math.max(pos, rightmostFailuresPos);
                    var found = offset < input.length ? input.charAt(offset) : null;
                    var errorPosition = computeErrorPosition();

                    throw new this.SyntaxError(
                        cleanupExpected(rightmostFailuresExpected),
                        found,
                        offset,
                        errorPosition.line,
                        errorPosition.column);
                }

                return result;
            },

            /* Returns the parser source code. */
            toSource: function () {
                return this._source;
            }
        };

        /* Thrown when a parser encounters a syntax error. */

        result.SyntaxError = function (expected, found, offset, line, column) {
            function buildMessage(expected, found) {
                var expectedHumanized, foundHumanized;

                switch (expected.length) {
                    case 0:
                        expectedHumanized = "end of input";
                        break;
                    case 1:
                        expectedHumanized = expected[0];
                        break;
                    default:
                        expectedHumanized = expected.slice(0, expected.length - 1).join(", ") + " or " + expected[expected.length - 1];
                }

                foundHumanized = found ? quote(found) : "end of input";

                return "Expected " + expectedHumanized + " but " + foundHumanized + " found.";
            }

            this.name = "SyntaxError";
            this.expected = expected;
            this.found = found;
            this.message = buildMessage(expected, found);
            this.offset = offset;
            this.line = line;
            this.column = column;
        };

        result.SyntaxError.prototype = Error.prototype;

        return result;
    })(),

    generate: function (input) {
        var parse_result = truthtables.parser.parse(input)
        parse_result.vars = parse_result.vars.filter(function (e, i, arr) {
            return arr.lastIndexOf(e) === i
        })
        var var_values = {}
        for (index = 0; index < parse_result.vars.length; ++index) {
            var_values[parse_result.vars[index]] = null
        }

        var result = { vars: parse_result.vars }
        var row = 0
        rec_func = function (i, var_values) {
            if (i == parse_result.vars.length) {
                result[row] = []
                for (var val in var_values) result[row].push(var_values[val])
                result[row++].push(parse_result.eval(var_values))
            } else {
                var_values[Object.keys(var_values)[i]] = true
                rec_func(i + 1, var_values)
                var_values[Object.keys(var_values)[i]] = false
                rec_func(i + 1, var_values)
            }
        }
        rec_func(0, var_values)
        result["rows"] = row + 1
        return result
    }
}