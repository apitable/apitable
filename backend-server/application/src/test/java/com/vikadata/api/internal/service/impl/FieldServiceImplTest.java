package com.vikadata.api.internal.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractIntegrationTest;
import com.vikadata.api.internal.vo.UrlAwareContentsVo;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * @author tao
 */
// @Disabled
public class FieldServiceImplTest extends AbstractIntegrationTest {

    @Test
    void testFetchOffSiteUrl() {
        List<String> urls = new ArrayList<>();
        urls.add("https://www.bilibili.com/");
        UrlAwareContentsVo urlAwareContents = fieldService.getUrlAwareContents(urls, null);
        assertThat(urlAwareContents.getContents()).isNotNull();
    }

    @Test
    void testFetchOffSiteUrlMetaTitle() {
        List<String> urls = new ArrayList<>();
        urls.add("https://mp.weixin.qq.com/s/GRlMDR0DUjjuz82Ndbu96Q");
        UrlAwareContentsVo urlAwareContents = fieldService.getUrlAwareContents(urls, null);
        assertThat(urlAwareContents.getContents()).isNotNull();
    }

    @Test
    void testFetchOffSiteUrls() {
        List<String> urls = new ArrayList<>();
        urls.add("https://vika.cn");
        urls.add("www.baidu.com");
        urls.add("https://www.bilibili.com/");
        UrlAwareContentsVo urlAwareContents = fieldService.getUrlAwareContents(urls, null);
        assertThat(urlAwareContents.getContents()).isNotNull();
    }

}
