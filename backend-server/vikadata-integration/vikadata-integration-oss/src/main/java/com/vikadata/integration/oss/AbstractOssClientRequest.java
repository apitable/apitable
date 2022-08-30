package com.vikadata.integration.oss;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.function.Consumer;

import cn.hutool.core.util.URLUtil;

/**
 *
 * @author Shawn Deng
 * @date 2021-03-23 14:04:57
 */
public abstract class AbstractOssClientRequest implements OssClientRequest {

    protected abstract boolean isBucketExist(String bucketName);

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
    public void executeStreamFunction(String bucketName, String key, Consumer<InputStream> function) {
        throw new NoSuchMethodError("Oss Client NoSuchMethod - 「executeStreamFunction」");
    }

    @Override
    public OssUploadAuth uploadToken(String bucket, String key, long expires, OssUploadPolicy uploadPolicy) {
        throw new NoSuchMethodError("Oss Client NoSuchMethod - 「createAuth」");
    }

    @Override
    public boolean isValidCallback(String originAuthorization, String url, byte[] body, String contentType) {
        throw new NoSuchMethodError("Oss Client NoSuchMethod - 「isValidCallback」");
    }
}
