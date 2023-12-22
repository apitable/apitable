package com.apitable.shared.util;

import cn.hutool.core.util.CharUtil;
import cn.hutool.core.util.StrUtil;
import java.io.IOException;
import java.net.URL;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

/**
 * Html parser.
 */
@Slf4j
public class HtmlParser {

    /**
     * Extract favicon from header.
     *
     * @param url url
     * @return favicon url
     */
    public static String extractShortcutFaviconFromHeader(URL url) {
        try {
            Document document = Jsoup.connect(url.toString()).maxBodySize(0).get();
            Element head = document.head();
            Element iconLink = head.select("link[rel=shortcut icon]").first();
            if (iconLink == null) {
                return null;
            }
            return iconLink.attr("href");
        } catch (IOException e) {
            log.info("failed to connect url {}", url, e);
            return null;
        }
    }

    /**
     * return default favicon url.
     *
     * @param url url
     * @return favicon url
     */
    public static String usingUrlDefaultFaviconUrl(URL url) {
        StringBuilder builder = StrUtil.builder()
            .append(url.getProtocol())
            .append(StrUtil.COLON)
            .append(StrUtil.SLASH)
            .append(StrUtil.SLASH)
            .append(url.getHost());
        if (url.getPort() != -1) {
            builder.append(CharUtil.COLON)
                .append(url.getPort());
        }
        builder.append("/favicon.ico");
        return builder.toString();
    }
}
