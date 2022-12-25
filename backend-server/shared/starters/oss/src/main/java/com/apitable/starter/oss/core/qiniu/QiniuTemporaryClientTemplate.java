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

package com.apitable.starter.oss.core.qiniu;

import com.apitable.starter.oss.core.OssClientRequest;
import com.apitable.starter.oss.core.OssUploadAuth;
import com.apitable.starter.oss.core.OssUploadPolicy;

public class QiniuTemporaryClientTemplate {

    private QiniuOssClientRequestFactory ossClientRequestFactory;

    public QiniuTemporaryClientTemplate() {
    }

    public QiniuTemporaryClientTemplate(QiniuOssClientRequestFactory ossClientRequestFactory) {
        this.ossClientRequestFactory = ossClientRequestFactory;
    }

    public QiniuOssClientRequestFactory getOssClientRequestFactory() {
        return ossClientRequestFactory;
    }

    public OssUploadAuth uploadToken(String bucket, String key, long expires, OssUploadPolicy uploadPolicy) {
        OssClientRequest request = getOssClientRequestFactory().createClient();
        return request.uploadToken(bucket, key, expires, uploadPolicy);
    }

    public boolean isValidCallback(String originAuthorization, String url, byte[] body, String contentType) {
        OssClientRequest request = getOssClientRequestFactory().createClient();
        return request.isValidCallback(originAuthorization, url, body, contentType);
    }

}
