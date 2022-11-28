package com.vikadata.api.util;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.shared.util.UrlRequestUtil;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * @author tao
 */
public class UrlRequestUtilTest {

    @Test
    @Disabled
    void testGetTitle() throws ExecutionException, InterruptedException {
        CompletableFuture<String> title = UrlRequestUtil.getTitle("https://www.baidu.com", new ArrayList<>());
        String titleString = title.get();
        assertThat(titleString).isNotNull();
    }

    @Test
    @Disabled
    void testGetHtmlTitle() throws MalformedURLException {
        Optional<String> title = UrlRequestUtil.getHtmlTitle(new URL("http://www.baidu.com"));
        assertThat(title).isNotNull();
    }

}
