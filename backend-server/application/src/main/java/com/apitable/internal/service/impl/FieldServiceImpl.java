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

package com.apitable.internal.service.impl;

import java.net.URI;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

import javax.annotation.Resource;

import cn.hutool.core.util.CharUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;
import okhttp3.Call;

import com.apitable.internal.vo.UrlAwareContentVo;
import com.apitable.internal.vo.UrlAwareContentsVo;
import com.apitable.internal.service.IFieldService;
import com.apitable.shared.config.properties.ConstProperties;
import com.apitable.workspace.service.INodeService;
import com.apitable.workspace.service.INodeShareService;
import com.apitable.shared.util.ClientUriUtil;
import com.apitable.shared.util.UrlRequestUtil;

import org.springframework.stereotype.Service;


/**
 * @author tao
 */
@Service
@Slf4j
public class FieldServiceImpl implements IFieldService {

    @Resource
    private INodeService nodeService;

    @Resource
    private ConstProperties constProperties;


    @Resource
    private INodeShareService nodeShareService;

    private String getSiteUrlHost() {
        String siteUrlHost = StrUtil.EMPTY;
        try {
            String serverDomain = constProperties.getServerDomain();
            URL url = new URL(serverDomain);
            siteUrlHost = url.getHost();
        }
        catch (Throwable e) {
            log.error(e.getMessage());
        }
        log.info("hostname: [{}]", siteUrlHost);
        return siteUrlHost;
    }

    @Override
    public UrlAwareContentsVo getUrlAwareContents(List<String> urls, Long userId) {
        UrlAwareContentsVo contents = new UrlAwareContentsVo();
        Map<String, UrlAwareContentVo> urlToUrlAwareContents = new HashMap<>(urls.size());
        contents.setContents(urlToUrlAwareContents);
        if (urls.size() == 1) {
            String url = urls.get(0);
            UrlAwareContentVo urlAwareContent = getUrlAwareContent(url, userId);
            urlToUrlAwareContents.put(url, urlAwareContent);
            return contents;
        }
        String siteUrlHost = getSiteUrlHost();
        CompletableFuture<String> lastFuture = null;
        boolean isStopFetchOffSiteUrl = false;
        List<Call> calls = new ArrayList<>();
        for (String url : urls) {
            if (urlToUrlAwareContents.containsKey(url)) {
                continue;
            }
            URL urlObj;
            // Check the validity of the URL, if successful, convert the URL to a JAVA object
            Optional<URL> checkUrl = ClientUriUtil.checkUrl(url);
            if (checkUrl.isPresent()) {
                urlObj = checkUrl.get();
            }
            else {
                urlToUrlAwareContents.put(url, new UrlAwareContentVo(false));
                continue;
            }
            // determine whether the url address is an internal site url
            if (isIntranetSite(siteUrlHost, urlObj)) {
                // identify the internal url content of the site s address
                UrlAwareContentVo vo = getIntranetSiteUrlContent(urlObj, siteUrlHost, userId);
                if (vo.getIsAware()) {
                    urlToUrlAwareContents.put(url, vo);
                    continue;
                }
            }
            // identify extranet link addresses
            final UrlAwareContentVo vo = new UrlAwareContentVo();
            vo.setIsAware(false);
            vo.setFavicon(getUrlFavicon(urlObj));
            urlToUrlAwareContents.put(url, vo);
            if (isStopFetchOffSiteUrl) {
                continue;
            }
            if (calls.size() % 20 == 0 && UrlRequestUtil.readyRequestCount() > 200) {
                // crawl busy stop crawling external links
                isStopFetchOffSiteUrl = true;
            }
            else {
                lastFuture = getOffSiteUrlContent(vo, calls, urlObj);
            }
        }
        waitFetchOffSiteUrl(lastFuture, calls);
        return contents;
    }

    private UrlAwareContentVo getUrlAwareContent(String url, Long userId) {
        URL urlObj;
        Optional<URL> checkUrl = ClientUriUtil.checkUrl(url);
        if (!checkUrl.isPresent()) {
            return new UrlAwareContentVo(false);
        }
        urlObj = checkUrl.get();
        // determine whether the url address is an internal site url
        String siteUrlHost = getSiteUrlHost();
        if (isIntranetSite(siteUrlHost, urlObj)) {
            // identify the internal url content of the site s address
            UrlAwareContentVo vo = getIntranetSiteUrlContent(urlObj, siteUrlHost, userId);
            if (vo.getIsAware()) {
                return vo;
            }
        }
        // identify off the external link
        return tryGetOffSiteUrlContent(urlObj);
    }

    /**
     * determine whether the url belongs to the internal site
     * @param siteUrlHost the internal site domain name
     * @param url url
     * @return whether the url belongs to the internal site
     */
    private boolean isIntranetSite(String siteUrlHost, URL url) {
        String host = url.getHost();
        if (ObjectUtil.isNull(host)) {
            return false;
        }
        return StrUtil.equalsIgnoreCase(siteUrlHost, host);
    }

    /**
     * get url related content on the internal site
     *
     * @param url internal site url
     * @param siteUrlHost internal domain
     * @param userId user id
     * @return internal related content
     */
    private UrlAwareContentVo getIntranetSiteUrlContent(URL url, String siteUrlHost, Long userId) {
        UrlAwareContentVo vo = defaultIntranetSiteUrlContent(siteUrlHost);
        Optional<URI> turnIntoUri = ClientUriUtil.urlTurnIntoURI(url.toString());
        if (!turnIntoUri.isPresent()) {
            return urlAwareFailureWithFavicon(url);
        }
        URI uri = turnIntoUri.get();
        // determine whether it is a shared address
        if (ClientUriUtil.isMatchSharePath(uri)) {
            Optional<String> shareId = ClientUriUtil.getShareIdByPath(uri);
            shareId.ifPresent(id -> {
                Optional<String> nodeName = nodeShareService.getNodeNameByShareId(id);
                nodeName.ifPresent(vo::setTitle);
            });
        }
        // determine if the url is a workbench node
        else if (ClientUriUtil.isMatchWorkbenchPath(uri)) {
            Optional<String> nodeId = ClientUriUtil.getNodeIdByPath(uri);
            nodeId.ifPresent(id -> {
                Optional<String> nodeName = nodeService.getNodeName(id, userId);
                nodeName.ifPresent(vo::setTitle);
            });
        }
        else {
            vo.setIsAware(false);
        }
        return vo;
    }

    /**
     * get extranet site url related content
     *
     * @param url extranet url
     * @return extranet url related content
     */
    private UrlAwareContentVo tryGetOffSiteUrlContent(URL url) {
        UrlAwareContentVo urlAwareContentVo = new UrlAwareContentVo();
        Optional<String> title = UrlRequestUtil.getHtmlTitle(url);
        if (title.isPresent() && StrUtil.isNotBlank(title.get())) {
            urlAwareContentVo.setIsAware(true);
            urlAwareContentVo.setTitle(title.get());
        }
        else {
            urlAwareContentVo.setIsAware(false);
        }
        urlAwareContentVo.setFavicon(getUrlFavicon(url));
        return urlAwareContentVo;
    }

    private void waitFetchOffSiteUrl(CompletableFuture<String> lastFuture, List<Call> calls) {
        try {
            // limit timeout
            if (ObjectUtil.isNotNull(lastFuture)) {
                lastFuture.get(2, TimeUnit.SECONDS);
            }
        }
        catch (ExecutionException | TimeoutException | InterruptedException e) {
            log.info("request failed:[{}]", e.getMessage());
        }
        // Cancel pending requests
        calls.forEach(Call::cancel);
    }

    private CompletableFuture<String> getOffSiteUrlContent(UrlAwareContentVo vo,
            List<Call> calls, URL urlObj) {
        CompletableFuture<String> future = UrlRequestUtil.getTitle(urlObj.toString(), calls);
        future.whenComplete((title, e) -> {
            if (ObjectUtil.isNotNull(title)) {
                vo.setIsAware(true);
                vo.setTitle(title);
            }
            else {
                log.info("Offsite address [{}] recognition failed: [{}]", urlObj, e.getMessage());
            }
        });
        return future;
    }

    private UrlAwareContentVo urlAwareFailureWithFavicon(URL url) {
        UrlAwareContentVo failure = new UrlAwareContentVo(false);
        failure.setFavicon(getUrlFavicon(url));
        return failure;
    }

    private String getUrlFavicon(URL url) {
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

    private UrlAwareContentVo defaultIntranetSiteUrlContent(String siteUrlHost) {
        UrlAwareContentVo vo = new UrlAwareContentVo();
        vo.setIsAware(true);
        vo.setFavicon(getIntranetSiteFaviconUrl(siteUrlHost));
        return vo;
    }

    private String getIntranetSiteFaviconUrl(String siteUrlHost) {
        return StrUtil.builder()
                .append("https://")
                .append(siteUrlHost)
                .append("/favicon.ico")
                .toString();
    }

}
