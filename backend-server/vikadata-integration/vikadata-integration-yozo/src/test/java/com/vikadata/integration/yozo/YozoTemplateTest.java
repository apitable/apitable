package com.vikadata.integration.yozo;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.integration.yozo.YozoConfig.Uri;

@Disabled("no assertion")
public class YozoTemplateTest {

    private static YozoTemplate yozoTemplate;

    @BeforeAll
    public static void setup() {
        YozoConfig config = new YozoConfig();
        config.setAppId("ina5645957505507647");
        config.setKey("55143998003190169672618");
        Uri uri = new Uri();
        uri.setPreview("http://api.yozocloud.cn/getPreview");
        config.setUri(uri);
        yozoTemplate = new YozoTemplate(config);
    }

    @Test
    public void testPreview() throws UnsupportedEncodingException {
        String fileUrl = "https://s1.vika.cn/%s?attname=%s";
        String token = "space/2021/06/21/677157111a7c4e62be512aa6d210565a";
        String attachName = "JAVA-LiJing-20+2-1!0@6#2$1%D&H*;) [].pdf";
        String encode = URLEncoder.encode(attachName.replaceAll("\\s|%", ""), "UTF-8");
        String url = String.format(fileUrl, token, encode);
        String previewUrl = yozoTemplate.preview(url);
        System.out.println(previewUrl);
    }
}
