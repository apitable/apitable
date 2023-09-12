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

package com.apitable.shared.util;

import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import com.apitable.core.exception.BusinessException;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Dispatcher;
import okhttp3.Headers;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Request.Builder;
import okhttp3.Response;
import okhttp3.ResponseBody;
import org.jetbrains.annotations.NotNull;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;

/**
 * url request util.
 */
public class UrlRequestUtil {

    private static final Logger log = LoggerFactory.getLogger(UrlRequestUtil.class);

    private static final OkHttpClient HTTP_CLIENT;

    private static final Headers DEFAULT_HEADERS;

    static {
        HTTP_CLIENT = new OkHttpClient.Builder().build();
        Dispatcher dispatcher = HTTP_CLIENT.dispatcher();
        dispatcher.setMaxRequests(32);
        DEFAULT_HEADERS = new Headers.Builder()
            .add("User-Agent",
                "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36")
            .build();
    }

    /**
     * get site url title.
     *
     * @param url url
     * @return optional
     */
    public static Optional<String> getHtmlTitle(URL url) {
        try {
            Request request = new Request.Builder().url(url).headers(DEFAULT_HEADERS).build();
            Call call = HTTP_CLIENT.newCall(request);
            Response response = call.execute();
            return getTitle(response);
        } catch (IllegalArgumentException e) {
            log.info("url:[{}] is not http or https.", url.toString());
        } catch (IOException e) {
            log.info("fetch url:[{}] progress have io error, [{}]", url, e.getMessage());
        } catch (Throwable e) {
            // example：like github.com, Failed to connect to github.com/xx.xx.xx.xx:443 Operation timed out (Connection timed out)
            log.info("url [{}] fetch failure，[{}]", url.toString(), e.getMessage());
        }
        return Optional.empty();
    }

    private static Optional<String> getTitle(Response response) {
        if (!response.isSuccessful()) {
            return Optional.empty();
        }
        Headers headers = response.headers();
        String contentType = headers.get(HttpHeaders.CONTENT_TYPE);
        ResponseBody responseBody = response.body();
        // 1. determine if the resource type is text
        if (StrUtil.containsAnyIgnoreCase(contentType,
            org.springframework.http.MediaType.TEXT_HTML_VALUE)
            && ObjectUtil.isNotNull(responseBody)) {
            // 2. parse to get the url title
            MediaType mediaType = responseBody.contentType();
            Charset charset = ObjectUtil.isNotNull(mediaType)
                ? mediaType.charset(StandardCharsets.UTF_8)
                : StandardCharsets.UTF_8;
            if (charset == null) {
                charset = StandardCharsets.UTF_8;
            }
            // read up to 32 kb bytes at a time
            int bytesSize = 1024 * 32;
            // Network transfers are chunked and require multiple reads
            final int tryReadNetworkCount = 5;
            byte[] bytes = new byte[bytesSize];
            InputStream stream = responseBody.byteStream();
            int readLength = 0;
            int count = 0;
            try {
                while (readLength < bytesSize && count < tryReadNetworkCount) {
                    count++;
                    readLength += stream.read(bytes, readLength, bytesSize - readLength);
                }
            } catch (IOException e) {
                log.error("response body read io exception");
            } finally {
                responseBody.close();
            }
            String html = new String(bytes, 0, readLength, charset);
            Document document = Jsoup.parse(html);
            String title = document.title();
            if (StrUtil.isBlank(title)) {
                return getMetaTitle(document);
            }

            if (StrUtil.isNotBlank(title)) {
                return Optional.of(title);
            }
        }
        return Optional.empty();
    }

    /**
     * get site url title.
     *
     * @param url   url
     * @param calls calls
     * @return CompletableFuture
     */
    public static CompletableFuture<String> getTitle(String url, List<Call> calls) {
        CompletableFuture<String> completableFuture = new CompletableFuture<>();
        Request request = new Builder().url(url).build();
        Call call = HTTP_CLIENT.newCall(request);
        calls.add(call);
        call.enqueue(new TitleCallback(completableFuture));
        return completableFuture;
    }

    private static Optional<String> getMetaTitle(Document document) {
        Elements metas = document.getElementsByTag("meta");
        for (Element meta :
            metas) {
            String key = meta.attr("property");
            key = StrUtil.isBlank(key) ? meta.attr("name") : key;
            String value = meta.attr("content");
            if ("og:title".equals(key) || "twitter:title".equals(key)) {
                if (StrUtil.isNotBlank(value)) {
                    return Optional.of(value);
                }
            }
        }
        return Optional.empty();
    }

    public static int readyRequestCount() {
        return HTTP_CLIENT.dispatcher().queuedCallsCount();
    }

    static class TitleCallback implements Callback {
        CompletableFuture<String> future;

        public TitleCallback(CompletableFuture<String> future) {
            this.future = future;
        }


        @Override
        public void onFailure(@NotNull Call call, @NotNull IOException e) {
            future.completeExceptionally(e);
        }

        @Override
        public void onResponse(@NotNull Call call, @NotNull Response response) throws IOException {
            try {
                Optional<String> title = getTitle(response);
                if (title.isPresent()) {
                    future.complete(title.get());
                    return;
                }
            } catch (Throwable e) {
                log.info("url [{}] fetch failure，[{}]", response.request().toString(),
                    e.getMessage());
            }
            future.completeExceptionally(new BusinessException("fetch title failure"));
        }

    }
}
