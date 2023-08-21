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

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.function.Consumer;

public interface OssClientRequest {

    UrlFetchResponse uploadRemoteUrl(String bucketName, String remoteSrcUrl, String keyPath) throws IOException;

    void uploadStreamForObject(String bucketName, InputStream in, String keyPath) throws IOException;

    void uploadStreamForObject(String bucketName, InputStream in, String path, String mimeType, String digest) throws IOException;

    OssObject getObject(String bucketName, String path);

    OssStatObject getStatObject(String bucketName, String key);

    void executeStreamFunction(String bucketName, String key, Consumer<InputStream> function);

    boolean deleteObject(String bucketName, String key);

    void refreshCdn(String bucketName, String[] url);

    OssUploadAuth uploadToken(String bucket, String key, long expires, OssUploadPolicy uploadPolicy);

    boolean isValidCallback(String originAuthorization, String url, byte[] body, String contentType);

    void migrationResources(String sourceBucket, String targetBucket, String resourceKey);

}
