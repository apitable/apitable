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

import java.util.Map;

/**
 * <p>
 * Front end direct transmission credentials.
 * </p>
 */
public class OssUploadPolicy {

    /**
     * If it is 1, it means that users are allowed to upload files prefixed with keyPrefix of scope.
     * </p>
     * support：
     * 1.qiniu cloud
     */
    private Integer isPrefixalScope;

    /**
     * It is limited to new semantics. If it is set to a value other than 0, files can only be uploaded in the new mode regardless of the scope setting.
     */
    private Integer insertOnly;

    /**
     * The minimum size of the uploaded file is limited in Byte. If it is smaller than the minimum upload file size,
     * it will be judged as upload failure, and a 403 status code will be returned
     * </p>
     * support：
     * 1.qiniu cloud
     */
    private Long fsizeMin;

    /**
     * The maximum size of the uploaded file is limited in Byte. If the maximum upload file size exceeds the limit,
     * the upload will be judged as failed, and a 413 status code will be returned.
     * </p>
     * support：
     * 1.qiniu
     */
    private Long fsizeLimit;

    /**
     * Limit the file types uploaded by users. If this field value is specified, the 7N server will detect the file content to determine the MimeType, and then match the value with the specified value.
     * If the matching is successful, upload is allowed, and if the matching fails, 403 status code will be returned. Example:
     * image/* Indicates that only image types can be uploaded
     * image/jpeg;image/png Indicates that only jpg and png images can be uploaded
     * !application/json;text/plain Indicates that the upload of json text and plain text is prohibited. Pay attention to the front exclamation point!
     * </p>
     * support：qiniu cloud
     */
    private String mimeLimit;

    /**
     * File storage type. 0 is standard storage (default), 1 is low-frequency storage, 2 is archive storage, and 3 is deep archive storage. <br>
     * support：
     * 1.qiniu cloud
     */
    private Integer fileType;

    /**
     * CallBack Body extended parameters.
     */
    private Map<String, Object> putExtra;

    public Integer getIsPrefixalScope() {
        return isPrefixalScope;
    }

    public void setIsPrefixalScope(Integer isPrefixalScope) {
        this.isPrefixalScope = isPrefixalScope;
    }

    public Integer getInsertOnly() {
        return insertOnly;
    }

    public void setInsertOnly(Integer insertOnly) {
        this.insertOnly = insertOnly;
    }

    public Long getFsizeMin() {
        return fsizeMin;
    }

    public void setFsizeMin(Long fsizeMin) {
        this.fsizeMin = fsizeMin;
    }

    public Long getFsizeLimit() {
        return fsizeLimit;
    }

    public void setFsizeLimit(Long fsizeLimit) {
        this.fsizeLimit = fsizeLimit;
    }

    public String getMimeLimit() {
        return mimeLimit;
    }

    public void setMimeLimit(String mimeLimit) {
        this.mimeLimit = mimeLimit;
    }

    public Integer getFileType() {
        return fileType;
    }

    public void setFileType(Integer fileType) {
        this.fileType = fileType;
    }

    public Map<String, Object> getPutExtra() {
        return putExtra;
    }

    public void setPutExtra(Map<String, Object> putExtra) {
        this.putExtra = putExtra;
    }
}
