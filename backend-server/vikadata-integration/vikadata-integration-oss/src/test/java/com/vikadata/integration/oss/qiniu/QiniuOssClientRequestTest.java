package com.vikadata.integration.oss.qiniu;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import cn.hutool.core.util.URLUtil;
import cn.hutool.crypto.digest.DigestUtil;
import com.qiniu.util.Auth;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.integration.oss.OssClientRequest;
import com.vikadata.integration.oss.OssObject;
import com.vikadata.integration.oss.UrlFetchResponse;

/**
 *
 * @author Shawn Deng
 * @date 2021-11-06 14:36:15
 */
@Disabled("no assertion")
public class QiniuOssClientRequestTest {

    @Test
    public void testUploadUrl() throws IOException {
        Auth auth = Auth.create("B7OyF1ZORX4iHaqJ5uN62qXAgoDnc7Jv7_zf1SpJ", "Hp26Vj4D2bv0JQ-qgExXYKlKc5EkFuVVgW1GA1Eh");
        String region = "z2";
        OssClientRequest request = new QiniuOssClientRequest(auth, region, "s1.vika.cn", true);
        String remoteUrl = "https://himg.bdimg.com/sys/portrait/item/pp.1.68bc23c.CCDZgMLmGWDP-rmcD2Dqgw?_t=1636359795694";
        URL url = URLUtil.url(remoteUrl);
        HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
        String checksum = DigestUtil.md5Hex(urlConnection.getInputStream());
        System.out.println("上传前的checksum: " + checksum);
        UrlFetchResponse response = request.uploadRemoteUrl("vk-assets-ltd",
                remoteUrl,
                "test/testjpg");
        System.out.println("上传后的结果: " + response.toString());
    }

    @Test
    public void testUpload() throws IOException {
        Auth auth = Auth.create("B7OyF1ZORX4iHaqJ5uN62qXAgoDnc7Jv7_zf1SpJ", "Hp26Vj4D2bv0JQ-qgExXYKlKc5EkFuVVgW1GA1Eh");
        String region = "z2";
        OssClientRequest request = new QiniuOssClientRequest(auth, region, "s1.vika.cn", true);
        InputStream inputStream = QiniuOssClientRequestTest.class.getClassLoader().getResourceAsStream("test.zip");
        request.uploadStreamForObject("vk-assets-ltd", inputStream, "test/test-dgh.zip");
    }

    @Test
    public void testDownload() {
        Auth auth = Auth.create("B7OyF1ZORX4iHaqJ5uN62qXAgoDnc7Jv7_zf1SpJ", "Hp26Vj4D2bv0JQ-qgExXYKlKc5EkFuVVgW1GA1Eh");
        String region = "z2";
        OssClientRequest request = new QiniuOssClientRequest(auth, region, "s1.vika.cn", true);
        OssObject object = request.getObject("vk-assets-ltd", "test/test-dgh.zip");
        System.out.println(object);
    }

    @Test
    public void testDelete() {
        Auth auth = Auth.create("B7OyF1ZORX4iHaqJ5uN62qXAgoDnc7Jv7_zf1SpJ", "Hp26Vj4D2bv0JQ-qgExXYKlKc5EkFuVVgW1GA1Eh");
        String region = "z2";
        OssClientRequest request = new QiniuOssClientRequest(auth, region, "s1.vika.cn", true);
        boolean ret = request.deleteObject("vk-assets-ltd", "test/test-dgh.zip");
        System.out.println(ret);
    }
}
