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

/**
 * <p>
 * Upload results of network resources.
 * </p>
 */
public class UrlFetchResponse {

    private String keyName;

    private String hash;

    private Long size;

    private String mimeType;

    public UrlFetchResponse() {
    }

    /**
     * constructor.
     *
     * @param keyName  keyName
     * @param hash     hash
     * @param size     size
     * @param mimeType mimeType
     */
    public UrlFetchResponse(String keyName, String hash, Long size, String mimeType) {
        this.keyName = keyName;
        this.hash = hash;
        this.size = size;
        this.mimeType = mimeType;
    }

    public String getKeyName() {
        return keyName;
    }

    public void setKeyName(String keyName) {
        this.keyName = keyName;
    }

    public String getHash() {
        return hash;
    }

    public void setHash(String hash) {
        this.hash = hash;
    }

    public Long getSize() {
        return size;
    }

    public void setSize(Long size) {
        this.size = size;
    }

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    @Override
    public String toString() {
        return "UrlFetchResponse{"
            + "digest='" + hash + '\''
            + ", size=" + size
            + ", mimeType='" + mimeType + '\''
            + '}';
    }
}
