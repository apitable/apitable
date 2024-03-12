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

package com.apitable.core.exception;

import java.util.Map;

/**
 * <p>
 * Business Exception.
 * </p>
 */
public class BusinessException extends RuntimeException {

    private static final long serialVersionUID = 6018501357401552444L;

    /**
     * Business Exception Status Code.
     */
    private Integer code;

    /**
     * Fixed enumeration encoding for i18n internationalization recognition.
     */
    private String fixedCode;

    private Map<String, Object> body;

    public Map<String, Object> getBody() {
        return body;
    }

    /**
     * constructor.
     *
     * @param exception base exception
     * @param body      body.
     */
    public BusinessException(BaseException exception, Map<String, Object> body) {
        super(exception.getMessage());
        this.code = exception.getCode();
        this.body = body;
        this.fixedCode = exception.toString();
    }

    public BusinessException(Throwable cause) {
        super(cause);
    }

    public BusinessException(String message) {
        super(message);
    }

    public BusinessException(String message, Throwable cause) {
        super(message, cause);
    }

    public BusinessException(int code, String message) {
        super(message);
        this.code = code;
    }

    public BusinessException(int code, String msgFormat, Object... args) {
        super(String.format(msgFormat, args));
        this.code = code;
    }

    /**
     * constructor.
     *
     * @param exception base exception
     */
    public BusinessException(BaseException exception) {
        super(exception.getMessage());
        this.code = exception.getCode();
        this.fixedCode = exception.toString();
    }

    public Integer getCode() {
        return code;
    }

    public String getFixedCode() {
        return fixedCode;
    }
}
