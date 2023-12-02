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
 * oss file property object.
 */
public class OssStatObject {

    /**
     * resource key (file relative path).
     */
    private String key;

    /**
     * hash.
     */
    private String hash;

    /**
     * file size.
     */
    private long fileSize;

    /**
     * file mimeType.
     */
    private String mimeType;

    /**
     * constructor.
     *
     * @param key      resource key (file relative path).
     * @param hash     hash.
     * @param fileSize file size.
     * @param mimeType file mimeType.
     */
    public OssStatObject(String key, String hash, long fileSize, String mimeType) {
        this.key = key;
        this.hash = hash;
        this.fileSize = fileSize;
        this.mimeType = mimeType;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getHash() {
        return hash;
    }

    public void setHash(String hash) {
        this.hash = hash;
    }

    public long getFileSize() {
        return fileSize;
    }

    public void setFileSize(long fileSize) {
        this.fileSize = fileSize;
    }

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

}
