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

import cn.hutool.core.util.URLUtil;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.function.Consumer;

/**
 * abstract oss client request.
 */
public abstract class AbstractOssClientRequest implements OssClientRequest {

    protected abstract void isBucketExist(String bucketName);

    protected InputStream getStream(String remoteUrl) throws IOException {
        URL url = URLUtil.url(remoteUrl);
        HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
        return urlConnection.getInputStream();
    }

    @Override
    public OssStatObject getStatObject(String bucketName, String key) {
        throw new NoSuchMethodError("Oss Client NoSuchMethod - 「getStatObject」");
    }

    @Override
    public void executeStreamFunction(String bucketName, String key,
                                      Consumer<InputStream> function) {
        throw new NoSuchMethodError("Oss Client NoSuchMethod - 「executeStreamFunction」");
    }

    @Override
    public OssUploadAuth uploadToken(String bucket, String key, long expires,
                                     OssUploadPolicy uploadPolicy) {
        throw new NoSuchMethodError("Oss Client NoSuchMethod - 「createAuth」");
    }


    @Override
    public boolean isValidCallback(String originAuthorization, String url, byte[] body,
                                   String contentType) {
        throw new NoSuchMethodError("Oss Client NoSuchMethod - 「isValidCallback」");
    }

    @Override
    public void migrationResources(String sourceBucket, String targetBucket, String resourceKey) {
        throw new NoSuchMethodError("Oss Client NoSuchMethod - 「migrationResources」");
    }
}
