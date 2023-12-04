package com.apitable.sql.script.enhance;

import java.io.IOException;
import java.io.LineNumberReader;
import java.util.List;
import org.springframework.core.io.support.EncodedResource;
import org.springframework.jdbc.datasource.init.ScriptException;
import org.springframework.jdbc.datasource.init.ScriptParseException;
import org.springframework.lang.Nullable;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

public class ScriptEnhanceUtil {

    public static String readScript(LineNumberReader lineNumberReader,
                                    @Nullable String[] commentPrefixes,
                                    @Nullable String separator,
                                    @Nullable String blockCommentEndDelimiter) throws
        IOException {

        String currentStatement = lineNumberReader.readLine();
        StringBuilder scriptBuilder = new StringBuilder();
        while (currentStatement != null) {
            if ((blockCommentEndDelimiter != null &&
                currentStatement.contains(blockCommentEndDelimiter)) ||
                (commentPrefixes != null && !startsWithAny(currentStatement, commentPrefixes, 0))) {
                if (!scriptBuilder.isEmpty()) {
                    scriptBuilder.append('\n');
                }
                scriptBuilder.append(currentStatement);
            }
            currentStatement = lineNumberReader.readLine();
        }
        appendSeparatorToScriptIfNecessary(scriptBuilder, separator);
        return scriptBuilder.toString();
    }

    private static void appendSeparatorToScriptIfNecessary(StringBuilder scriptBuilder,
                                                           @Nullable String separator) {
        if (separator == null) {
            return;
        }
        String trimmed = separator.trim();
        if (trimmed.length() == separator.length()) {
            return;
        }
        // separator ends in whitespace, so we might want to see if the script is trying
        // to end the same way
        if (scriptBuilder.lastIndexOf(trimmed) == scriptBuilder.length() - trimmed.length()) {
            scriptBuilder.append(separator.substring(trimmed.length()));
        }
    }

    public static void splitSqlScript(@Nullable EncodedResource resource, String script,
                                      String separator, String[] commentPrefixes,
                                      String blockCommentStartDelimiter,
                                      String blockCommentEndDelimiter, List<String> statements)
        throws
        ScriptException {

        Assert.hasText(script, "'script' must not be null or empty");
        Assert.notNull(separator, "'separator' must not be null");
        Assert.notEmpty(commentPrefixes, "'commentPrefixes' must not be null or empty");
        for (String commentPrefix : commentPrefixes) {
            Assert.hasText(commentPrefix,
                "'commentPrefixes' must not contain null or empty elements");
        }
        Assert.hasText(blockCommentStartDelimiter,
            "'blockCommentStartDelimiter' must not be null or empty");
        Assert.hasText(blockCommentEndDelimiter,
            "'blockCommentEndDelimiter' must not be null or empty");

        StringBuilder sb = new StringBuilder();
        boolean inSingleQuote = false;
        boolean inDoubleQuote = false;
        boolean inEscape = false;

        for (int i = 0; i < script.length(); i++) {
            char c = script.charAt(i);
            if (inEscape) {
                inEscape = false;
                sb.append(c);
                continue;
            }
            // MySQL style escapes
            if (c == '\\') {
                inEscape = true;
                sb.append(c);
                continue;
            }
            if (!inDoubleQuote && (c == '\'')) {
                inSingleQuote = !inSingleQuote;
            } else if (!inSingleQuote && (c == '"')) {
                inDoubleQuote = !inDoubleQuote;
            }
            if (!inSingleQuote && !inDoubleQuote) {
                if (script.startsWith(separator, i)) {
                    // We've reached the end of the current statement
                    if (!sb.isEmpty()) {
                        statements.add(sb.toString());
                        sb = new StringBuilder();
                    }
                    i += separator.length() - 1;
                    continue;
                } else if (startsWithAny(script, commentPrefixes, i)) {
                    // Skip over any content from the start of the comment to the EOL
                    int indexOfNextNewline = script.indexOf('\n', i);
                    if (indexOfNextNewline > i) {
                        i = indexOfNextNewline;
                        continue;
                    } else {
                        // If there's no EOL, we must be at the end of the script, so stop here.
                        break;
                    }
                } else if (script.startsWith(blockCommentStartDelimiter, i)) {
                    // Skip over any block comments
                    int indexOfCommentEnd = script.indexOf(blockCommentEndDelimiter, i);
                    if (indexOfCommentEnd > i) {
                        i = indexOfCommentEnd + blockCommentEndDelimiter.length() - 1;
                        continue;
                    } else {
                        throw new ScriptParseException(
                            "Missing block comment end delimiter: " + blockCommentEndDelimiter,
                            resource);
                    }
                } else if (c == ' ' || c == '\r' || c == '\n' || c == '\t') {
                    // Avoid multiple adjacent whitespace characters
                    if (!sb.isEmpty() && sb.charAt(sb.length() - 1) != ' ') {
                        c = ' ';
                    } else {
                        continue;
                    }
                }
            }
            sb.append(c);
        }

        if (StringUtils.hasText(sb)) {
            statements.add(sb.toString());
        }
    }

    private static boolean startsWithAny(String script, String[] prefixes, int offset) {
        for (String prefix : prefixes) {
            if (script.startsWith(prefix, offset)) {
                return true;
            }
        }
        return false;
    }
}
