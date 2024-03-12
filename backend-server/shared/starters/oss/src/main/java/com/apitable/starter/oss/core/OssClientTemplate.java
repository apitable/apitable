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
 * oss client template.
 */
public class OssClientTemplate {

    private OssClientRequestFactory ossClientRequestFactory;

    public OssClientTemplate() {
    }

    public OssClientRequestFactory getOssClientRequestFactory() {
        return ossClientRequestFactory;
    }

    public void setOssClientRequestFactory(OssClientRequestFactory ossClientRequestFactory) {
        this.ossClientRequestFactory = ossClientRequestFactory;
    }

    /**
     * Upload network resources.
     *
     * @param bucketName Bucket name
     * @param remoteUrl  Network resource address
     * @param keyPath    The file name saved to the bucket. If it is empty, the address of the network resource will be retrieved
     * @return UrlFetchResponse
     * @throws IOException io exception
     */
    public UrlFetchResponse upload(String bucketName, String remoteUrl, String keyPath)
        throws IOException {
        OssClientRequest request = getOssClientRequestFactory().createClient();
        return request.uploadRemoteUrl(bucketName, remoteUrl, keyPath);
    }

    public void upload(String bucketName, InputStream in, String keyPath) throws IOException {
        OssClientRequest request = getOssClientRequestFactory().createClient();
        request.uploadStreamForObject(bucketName, in, keyPath);
    }

    public void upload(String bucketName, InputStream in, String path, String mimeType,
                       String digest) throws IOException {
        OssClientRequest request = getOssClientRequestFactory().createClient();
        request.uploadStreamForObject(bucketName, in, path, mimeType, digest);
    }

    public OssObject getObject(String bucketName, String key) {
        OssClientRequest request = getOssClientRequestFactory().createClient();
        return request.getObject(bucketName, key);
    }

    public OssStatObject getStatObject(String bucketName, String key) {
        OssClientRequest request = getOssClientRequestFactory().createClient();
        return request.getStatObject(bucketName, key);
    }

    public void executeStreamFunction(String bucketName, String key,
                                      Consumer<InputStream> function) {
        OssClientRequest request = getOssClientRequestFactory().createClient();
        request.executeStreamFunction(bucketName, key, function);
    }

    public boolean delete(String bucketName, String key) {
        OssClientRequest request = getOssClientRequestFactory().createClient();
        return request.deleteObject(bucketName, key);
    }

    public void refreshCdn(String bucketName, String[] url) {
        OssClientRequest request = getOssClientRequestFactory().createClient();
        request.refreshCdn(bucketName, url);
    }

    /**
     * this is the method that will be deleted.
     *
     * @param bucket       bucket's name
     * @param key          file position
     * @param expires      expires time
     * @param uploadPolicy upload policy
     * @return token
     */
    public OssUploadAuth uploadToken(String bucket, String key, long expires,
                                     OssUploadPolicy uploadPolicy) {
        OssClientRequest request = getOssClientRequestFactory().createClient();
        return request.uploadToken(bucket, key, expires, uploadPolicy);
    }

    public OssUploadAuth uploadToken(String bucket, String key, long expires) {
        return uploadToken(bucket, key, expires, new OssUploadPolicy());
    }


    public boolean isValidCallback(String originAuthorization, String url, byte[] body,
                                   String contentType) {
        OssClientRequest request = getOssClientRequestFactory().createClient();
        return request.isValidCallback(originAuthorization, url, body, contentType);
    }

    public void migrationResources(String sourceBucket, String targetBucket, String resourceKey) {
        OssClientRequest request = getOssClientRequestFactory().createClient();
        request.migrationResources(sourceBucket, targetBucket, resourceKey);
    }

}
