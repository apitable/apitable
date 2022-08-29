package com.vikadata.api.modular.internal.service.impl;

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

import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.api.modular.internal.model.UrlAwareContentVo;
import com.vikadata.api.modular.internal.model.UrlAwareContentsVo;
import com.vikadata.api.modular.internal.service.IFieldService;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.api.modular.workspace.service.INodeShareService;
import com.vikadata.api.util.ClientUriUtil;
import com.vikadata.api.util.UrlRequestUtil;

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
            // 检查URL的合法性，成功则将URL转为JAVA对象
            Optional<URL> checkUrl = ClientUriUtil.checkUrl(url);
            if (checkUrl.isPresent()) {
                urlObj = checkUrl.get();
            }
            else {
                urlToUrlAwareContents.put(url, new UrlAwareContentVo(false));
                continue;
            }
            // 判断url地址是否站内网址
            if (isIntranetSite(siteUrlHost, urlObj)) {
                // 识别站内地址的URL内容
                UrlAwareContentVo vo = getIntranetSiteUrlContent(urlObj, siteUrlHost, userId);
                if (vo.getIsAware()) {
                    urlToUrlAwareContents.put(url, vo);
                    continue;
                }
            }
            // 识别站外地址
            final UrlAwareContentVo vo = new UrlAwareContentVo();
            vo.setIsAware(false);
            vo.setFavicon(getUrlFavicon(urlObj));
            urlToUrlAwareContents.put(url, vo);
            if (isStopFetchOffSiteUrl) {
                continue;
            }
            if (calls.size() % 20 == 0 && UrlRequestUtil.readyRequestCount() > 200) {
                // 爬取繁忙，停止爬取外部链接
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
        // 判断url地址是否站内网址
        String siteUrlHost = getSiteUrlHost();
        if (isIntranetSite(siteUrlHost, urlObj)) {
            // 识别站内地址的URL内容
            UrlAwareContentVo vo = getIntranetSiteUrlContent(urlObj, siteUrlHost, userId);
            if (vo.getIsAware()) {
                return vo;
            }
        }
        // 识别站外地址
        return tryGetOffSiteUrlContent(urlObj);
    }

    /**
     * 判断url是否属于站内
     * @param siteUrlHost 站内域名
     * @param url 网址
     * @return url是否属于站内
     */
    private boolean isIntranetSite(String siteUrlHost, URL url) {
        String host = url.getHost();
        if (ObjectUtil.isNull(host)) {
            return false;
        }
        return StrUtil.equalsIgnoreCase(siteUrlHost, host);
    }

    /**
     * 获取站内URL相关内容
     *
     * @param url 站内URL
     * @param siteUrlHost 站内域名
     * @param userId 用户id
     * @return 站外URL相关内容
     */
    private UrlAwareContentVo getIntranetSiteUrlContent(URL url, String siteUrlHost, Long userId) {
        UrlAwareContentVo vo = defaultIntranetSiteUrlContent(siteUrlHost);
        Optional<URI> turnIntoUri = ClientUriUtil.urlTurnIntoURI(url.toString());
        if (!turnIntoUri.isPresent()) {
            return urlAwareFailureWithFavicon(url);
        }
        URI uri = turnIntoUri.get();
        // 判断是否是分享地址
        if (ClientUriUtil.isMatchSharePath(uri)) {
            Optional<String> shareId = ClientUriUtil.getShareIdByPath(uri);
            shareId.ifPresent(id -> {
                Optional<String> nodeName = nodeShareService.getNodeNameByShareId(id);
                nodeName.ifPresent(vo::setTitle);
            });
        }
        // 判断网址是否是工作台节点
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
     * 获取站外URL相关内容
     *
     * @param url 站外URL
     * @return 站外URL相关内容
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
            // 限制超时
            if (ObjectUtil.isNotNull(lastFuture)) {
                lastFuture.get(2, TimeUnit.SECONDS);
            }
        }
        catch (ExecutionException | TimeoutException | InterruptedException e) {
            log.info("请求失败：[{}]", e.getMessage());
        }
        // 取消掉还没有处理的请求
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
                log.info("站外地址[{}]识别失败：[{}]", urlObj, e.getMessage());
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
