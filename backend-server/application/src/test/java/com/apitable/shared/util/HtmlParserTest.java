package com.apitable.shared.util;

import static org.assertj.core.api.Assertions.assertThat;

import java.net.MalformedURLException;
import java.net.URL;
import org.junit.jupiter.api.Test;

public class HtmlParserTest {

    @Test
    public void testExtractShortcutFaviconFromHeader() throws MalformedURLException {
        URL url = new URL("https://www.baidu.com");
        String faviconLink = HtmlParser.extractShortcutFaviconFromHeader(url);
        assertThat(faviconLink).isNotNull().isEqualTo("https://www.baidu.com/favicon.ico");
    }
}
