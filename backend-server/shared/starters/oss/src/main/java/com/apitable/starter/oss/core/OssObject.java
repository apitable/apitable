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

package com.apitable.starter.oss.core;

import java.io.InputStream;

/**
 * <p>
 * Oss object.
 * </p>
 */
public class OssObject {

    private String contentDigest;

    private Long contentLength;

    private String contentType;

    private InputStream inputStream;

    /**
     * <p>
     * Constructor for OssObject.
     * </p>
     *
     * @param contentDigest a {@link java.lang.String} object.
     * @param contentLength a {@link java.lang.Long} object.
     * @param contentType   a {@link java.lang.String} object.
     * @param inputStream   a {@link java.io.InputStream} object.
     */
    public OssObject(String contentDigest, Long contentLength, String contentType,
                     InputStream inputStream) {
        this.contentDigest = contentDigest;
        this.contentLength = contentLength;
        this.contentType = contentType;
        this.inputStream = inputStream;
    }

    public String getContentDigest() {
        return contentDigest;
    }

    public void setContentDigest(String contentDigest) {
        this.contentDigest = contentDigest;
    }

    public Long getContentLength() {
        return contentLength;
    }

    public void setContentLength(Long contentLength) {
        this.contentLength = contentLength;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public InputStream getInputStream() {
        return inputStream;
    }

    public void setInputStream(InputStream inputStream) {
        this.inputStream = inputStream;
    }

    @Override
    public String toString() {
        return "OssObject{"
            + "contentDigest='" + contentDigest + '\''
            + ", contentLength=" + contentLength
            + ", contentType='" + contentType + '\''
            + '}';
    }
}
