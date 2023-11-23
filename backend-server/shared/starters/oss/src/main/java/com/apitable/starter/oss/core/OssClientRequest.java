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
import java.util.function.Consumer;

/**
 * oss client request.
 */
public interface OssClientRequest {

    /**
     * upload remote url to oss.
     *
     * @param bucketName   bucket name
     * @param remoteSrcUrl remote url
     * @param keyPath      key path
     * @return UrlFetchResponse
     * @throws IOException IOException
     */
    UrlFetchResponse uploadRemoteUrl(String bucketName, String remoteSrcUrl, String keyPath)
        throws IOException;

    /**
     * upload remote url to oss.
     *
     * @param bucketName bucket name
     * @param in         input stream
     * @param keyPath    key path
     * @throws IOException IOException
     */
    void uploadStreamForObject(String bucketName, InputStream in, String keyPath)
        throws IOException;

    /**
     * upload stream to oss.
     *
     * @param bucketName bucket name
     * @param in         input stream
     * @param path       path
     * @param mimeType   mime type
     * @param digest     digest
     * @throws IOException IOException
     */
    void uploadStreamForObject(String bucketName, InputStream in, String path, String mimeType,
                               String digest) throws IOException;

    /**
     * get object.
     *
     * @param bucketName bucket name
     * @param path       path
     * @return OssObject
     */
    OssObject getObject(String bucketName, String path);

    /**
     * get stat object.
     *
     * @param bucketName bucket name
     * @param key        key
     * @return OssStatObject
     */
    OssStatObject getStatObject(String bucketName, String key);

    /**
     * execute stream function.
     *
     * @param bucketName bucket name
     * @param key        key
     * @param function   function
     */
    void executeStreamFunction(String bucketName, String key, Consumer<InputStream> function);

    /**
     * delete object.
     *
     * @param bucketName bucket name
     * @param key        key
     * @return boolean
     */
    boolean deleteObject(String bucketName, String key);

    /**
     * refresh cdn.
     *
     * @param bucketName bucket name
     * @param url        url
     */
    void refreshCdn(String bucketName, String[] url);

    /**
     * upload token.
     *
     * @param bucket       bucket
     * @param key          key
     * @param expires      expires time
     * @param uploadPolicy upload policy
     * @return OssUploadAuth
     */
    OssUploadAuth uploadToken(String bucket, String key, long expires,
                              OssUploadPolicy uploadPolicy);

    /**
     * validate callback.
     *
     * @param originAuthorization origin authorization
     * @param url                 url
     * @param body                body
     * @param contentType         content type
     * @return boolean
     */
    boolean isValidCallback(String originAuthorization, String url, byte[] body,
                            String contentType);

    /**
     * migration resources.
     *
     * @param sourceBucket source bucket
     * @param targetBucket target bucket
     * @param resourceKey  resource key
     */
    void migrationResources(String sourceBucket, String targetBucket, String resourceKey);

}
