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

package com.apitable.core.support;

/**
 * default response data builder.
 */
public class DefaultResponseDataBuilder implements ResponseDataBuilder {

    private final Boolean success;

    private final Integer statusCode;

    private final String message;

    /**
     * constructor.
     *
     * @param success    success
     * @param statusCode status code
     * @param message    message
     */
    public DefaultResponseDataBuilder(Boolean success, Integer statusCode, String message) {
        this.success = success;
        this.statusCode = statusCode;
        this.message = message;
    }

    @Override
    public <T> ResponseData<T> data(T data) {
        return new ResponseData<>(success, this.statusCode, this.message, data);
    }

    @Override
    public <T> ResponseData<T> build() {
        return data(null);
    }
}
