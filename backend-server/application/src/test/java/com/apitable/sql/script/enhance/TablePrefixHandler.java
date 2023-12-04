/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.sql.script.enhance;

import static org.springframework.jdbc.datasource.init.ScriptUtils.DEFAULT_STATEMENT_SEPARATOR;
import static org.springframework.jdbc.datasource.init.ScriptUtils.EOF_STATEMENT_SEPARATOR;
import static org.springframework.jdbc.datasource.init.ScriptUtils.FALLBACK_STATEMENT_SEPARATOR;

import cn.hutool.core.util.StrUtil;
import java.io.IOException;
import java.io.LineNumberReader;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.SQLWarning;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.support.EncodedResource;
import org.springframework.jdbc.datasource.init.CannotReadScriptException;
import org.springframework.jdbc.datasource.init.ScriptException;
import org.springframework.jdbc.datasource.init.ScriptParseException;
import org.springframework.jdbc.datasource.init.ScriptStatementFailedException;
import org.springframework.jdbc.datasource.init.UncategorizedScriptException;
import org.springframework.lang.Nullable;
import org.springframework.util.StringUtils;

@Slf4j
public class TablePrefixHandler {

    public String tablePrefix;

    public TablePrefixHandler(String tablePrefix) {
        this.tablePrefix = StrUtil.isNotBlank(tablePrefix) ? tablePrefix : StrUtil.EMPTY;
    }

    public void executeSqlScript(Connection connection, EncodedResource resource,
                                 boolean continueOnError,
                                 boolean ignoreFailedDrops, String[] commentPrefixes,
                                 @Nullable String separator,
                                 String blockCommentStartDelimiter, String blockCommentEndDelimiter)
        throws ScriptException {
        try {
            if (log.isDebugEnabled()) {
                log.debug("Executing SQL script from " + resource);
            }
            long startTime = System.currentTimeMillis();

            String script;
            try {
                script = readScript(resource, separator, commentPrefixes, blockCommentEndDelimiter);
            } catch (IOException ex) {
                throw new CannotReadScriptException(resource, ex);
            }

            if (separator == null) {
                separator = DEFAULT_STATEMENT_SEPARATOR;
            }
            if (!EOF_STATEMENT_SEPARATOR.equals(separator) &&
                !containsStatementSeparator(resource, script, separator, commentPrefixes,
                    blockCommentStartDelimiter, blockCommentEndDelimiter)) {
                separator = FALLBACK_STATEMENT_SEPARATOR;
            }

            List<String> statements = new ArrayList<>();
            splitSqlScript(resource, script, separator, commentPrefixes, blockCommentStartDelimiter,
                blockCommentEndDelimiter, statements);

            statements = statements.stream()
                .map(statement -> TablePrefixUtil.changeTablePrefix(statement, tablePrefix))
                .collect(Collectors.toList());

            int stmtNumber = 0;
            Statement stmt = connection.createStatement();
            try {
                for (String statement : statements) {
                    stmtNumber++;
                    try {
                        stmt.execute(statement);
                        int rowsAffected = stmt.getUpdateCount();
                        if (log.isDebugEnabled()) {
                            log.debug(
                                rowsAffected + " returned as update count for SQL: " + statement);
                            SQLWarning warningToLog = stmt.getWarnings();
                            while (warningToLog != null) {
                                log.debug(
                                    "SQLWarning ignored: SQL state '" + warningToLog.getSQLState() +
                                        "', error code '" + warningToLog.getErrorCode() +
                                        "', message [" + warningToLog.getMessage() + "]");
                                warningToLog = warningToLog.getNextWarning();
                            }
                        }
                    } catch (SQLException ex) {
                        boolean dropStatement =
                            StringUtils.startsWithIgnoreCase(statement.trim(), "drop");
                        if (continueOnError || (dropStatement && ignoreFailedDrops)) {
                            if (log.isDebugEnabled()) {
                                log.debug(
                                    ScriptStatementFailedException.buildErrorMessage(statement,
                                        stmtNumber, resource), ex);
                            }
                        } else {
                            throw new ScriptStatementFailedException(statement, stmtNumber,
                                resource, ex);
                        }
                    }
                }
            } finally {
                try {
                    stmt.close();
                } catch (Throwable ex) {
                    log.trace("Could not close JDBC Statement", ex);
                }
            }

            long elapsedTime = System.currentTimeMillis() - startTime;
            if (log.isDebugEnabled()) {
                log.debug("Executed SQL script from " + resource + " in " + elapsedTime + " ms.");
            }
        } catch (Exception ex) {
            if (ex instanceof ScriptException) {
                throw (ScriptException) ex;
            }
            throw new UncategorizedScriptException(
                "Failed to execute database script from resource [" + resource + "]", ex);
        }
    }

    public void splitSqlScript(@Nullable EncodedResource resource, String script,
                               String separator, String[] commentPrefixes,
                               String blockCommentStartDelimiter,
                               String blockCommentEndDelimiter, List<String> statements)
        throws ScriptException {
        ScriptEnhanceUtil.splitSqlScript(resource, script, separator, commentPrefixes,
            blockCommentStartDelimiter,
            blockCommentEndDelimiter, statements);
    }

    private String readScript(EncodedResource resource, @Nullable String separator,
                              String[] commentPrefixes, String blockCommentEndDelimiter)
        throws IOException {

        try (LineNumberReader lnr = new LineNumberReader(resource.getReader())) {
            return ScriptEnhanceUtil.readScript(lnr, commentPrefixes, separator,
                blockCommentEndDelimiter);
        }
    }

    private boolean containsStatementSeparator(@Nullable EncodedResource resource, String script,
                                               String separator, String[] commentPrefixes,
                                               String blockCommentStartDelimiter,
                                               String blockCommentEndDelimiter)
        throws ScriptException {

        boolean inSingleQuote = false;
        boolean inDoubleQuote = false;
        boolean inEscape = false;

        for (int i = 0; i < script.length(); i++) {
            char c = script.charAt(i);
            if (inEscape) {
                inEscape = false;
                continue;
            }
            // MySQL style escapes
            if (c == '\\') {
                inEscape = true;
                continue;
            }
            if (!inDoubleQuote && (c == '\'')) {
                inSingleQuote = !inSingleQuote;
            } else if (!inSingleQuote && (c == '"')) {
                inDoubleQuote = !inDoubleQuote;
            }
            if (!inSingleQuote && !inDoubleQuote) {
                if (script.startsWith(separator, i)) {
                    return true;
                } else if (startsWithAny(script, commentPrefixes, i)) {
                    // Skip over any content from the start of the comment to the EOL
                    int indexOfNextNewline = script.indexOf('\n', i);
                    if (indexOfNextNewline > i) {
                        i = indexOfNextNewline;
                    } else {
                        // If there's no EOL, we must be at the end of the script, so stop here.
                        break;
                    }
                } else if (script.startsWith(blockCommentStartDelimiter, i)) {
                    // Skip over any block comments
                    int indexOfCommentEnd = script.indexOf(blockCommentEndDelimiter, i);
                    if (indexOfCommentEnd > i) {
                        i = indexOfCommentEnd + blockCommentEndDelimiter.length() - 1;
                    } else {
                        throw new ScriptParseException(
                            "Missing block comment end delimiter: " + blockCommentEndDelimiter,
                            resource);
                    }
                }
            }
        }

        return false;
    }

    private boolean startsWithAny(String script, String[] prefixes, int offset) {
        for (String prefix : prefixes) {
            if (script.startsWith(prefix, offset)) {
                return true;
            }
        }
        return false;
    }

}
