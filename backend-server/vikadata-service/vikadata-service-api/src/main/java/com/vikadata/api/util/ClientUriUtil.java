package com.vikadata.api.util;

import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Optional;

import cn.hutool.core.util.ArrayUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.core.util.URLUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vikadata.api.enums.datasheet.IdRulePrefixEnum;
import com.vikadata.api.enums.datasheet.UrlRulePrefixEnum;

/**
 * <p>
 * 客户端 nginx $request_uri 解析工具类
 * </p>
 *
 * @author Pengap
 * @date 2022/5/30 15:54:19
 */
public class ClientUriUtil {

    private static final Logger logger = LoggerFactory.getLogger(ClientUriUtil.class);

    /**
     * 解析客户端uri
     *
     * 比如：https://integration.vika.ltd/share/shrKk0fJy24hZhkJWFmlG 【维格表】- 彭安平给你分享了《新建维格表 2》，为了更好的体验，建议通过电脑浏览器访问
     *
     * 解析后：https://integration.vika.ltd/share/shrKk0fJy24hZhkJWFmlG
     *
     * @param originalUrl nginx $request_uri
     * @return uri
     * @author zoe zheng
     * @date 2020/5/19 12:34 下午
     */
    public static String parseOriginUrlPath(String originalUrl) {
        String uri = "";
        if (StrUtil.isNotBlank(originalUrl)) {
            uri = URLUtil.toURI(URLUtil.decode(originalUrl), true).getPath();
        }
        // 过滤空格之后的数据
        if (StrUtil.contains(uri, " ")) {
            uri = StrUtil.subBetween(uri, "", " ");
        }
        return URLUtil.getPath(uri);
    }

    /**
     * 获取meta具体信息
     *
     * @param uri nginx $request_uri
     * @return meta
     * @author zoe zheng
     * @date 2020/5/19 12:34 下午
     */
    public static boolean isMatchSharePath(String uri) {
        String uriCase = "/share/" + IdRulePrefixEnum.SHARE.getIdRulePrefixEnum();
        String tpcCase = "/template/" + IdRulePrefixEnum.TPC.getIdRulePrefixEnum();
        String spaceCase = "/space/" + IdRulePrefixEnum.SPC.getIdRulePrefixEnum();
        String tplCase = "/" + IdRulePrefixEnum.TPL.getIdRulePrefixEnum();
        // 分享页渲染meta
        if (StrUtil.containsIgnoreCase(uri, uriCase)) {
            return true;
        }
        // 模版分享页
        return StrUtil.containsIgnoreCase(uri, tpcCase) && !StrUtil.containsIgnoreCase(uri, spaceCase) && StrUtil.containsIgnoreCase(uri, tplCase);
    }

    /**
     * 从uri里面获取含有prefix的各种ID,不区分大小写<br>
     *
     * getIdFromUri(uri, IdRulePrefixEnum.SHARE.getIdRulePrefixEnum());
     *
     * @param uri 地址
     * @param prefix 前缀
     * @return null|string
     * @author zoe zheng
     * @date 2020/5/22 4:41 下午
     */
    public static String getIdFromUri(String uri, String prefix) {
        String uriSeparator = "/";
        String[] path = StrUtil.split(StrUtil.removePrefix(StrUtil.removeSuffix(uri, uriSeparator), uriSeparator), uriSeparator);
        for (String s : path) {
            // 路由中有shr关键字，说明分享的节点，查找节点描述和名称
            if (StrUtil.containsIgnoreCase(s, prefix)) {
                return s;
            }
        }
        return null;
    }

    /**
     * 地址是否为工作台节点地址
     * @param uri 地址
     * @return 是否为工作台节点地址
     */
    public static boolean isMatchWorkbenchPath(URI uri) {
        return StrUtil.startWithIgnoreCase(uri.getPath(),
                UrlRulePrefixEnum.WORKBENCH_URL_PFE_SUFFIX.getValue());
    }

    /**
     * 地址是否为分享节点地址
     * @param uri 地址
     * @return 是否为分享节点地址
     */
    public static boolean isMatchSharePath(URI uri) {
        return StrUtil.startWithIgnoreCase(uri.getPath(),
                UrlRulePrefixEnum.SHARE_URL_PFE_SUFFIX.getValue());
    }

    /**
     * 根据分享uri获取分享信息
     * @param uri uri
     * @return 节点id
     */
    public static Optional<String> getShareIdByPath(URI uri) {
        String pathAboutSharedInfo = uri.getPath()
                .substring(UrlRulePrefixEnum.SHARE_URL_PFE_SUFFIX.getValue().length());
        return getIdByPath(pathAboutSharedInfo);
    }

    /**
     * 根据工作台节点uri获取节点id信息
     * @param uri uri
     * @return 节点id
     */
    public static Optional<String> getNodeIdByPath(URI uri) {
        String pathAboutNodeInfo = uri.getPath()
                .substring(UrlRulePrefixEnum.WORKBENCH_URL_PFE_SUFFIX.getValue().length());
        return getIdByPath(pathAboutNodeInfo);
    }


    private static Optional<String> getIdByPath(String pathAboutNodeInfo) {
        String pathAboutNodeId;
        if (StrUtil.startWith(pathAboutNodeInfo, StrUtil.SLASH)) {
            pathAboutNodeId = pathAboutNodeInfo.substring(StrUtil.SLASH.length());
        }
        else {
            pathAboutNodeId = pathAboutNodeInfo;
        }
        String[] split = StrUtil.split(pathAboutNodeId, StrUtil.SLASH);
        if (ArrayUtil.isNotEmpty(split)
                && StrUtil.isNotBlank(split[0])) {
            return Optional.of(split[0]);
        }
        return Optional.empty();
    }

    public static Optional<URL> checkUrl(String url)  {
        try {
            String normalizeUrl = URLUtil.normalize(url);
            return Optional.of(new URL(normalizeUrl));
        } catch (MalformedURLException e) {
            logger.error("[{}] 解析失败 [{}]", url, e.getMessage());
        }
        return Optional.empty();
    }

    public static Optional<URI> urlTurnIntoURI(String url) {
        try {
            // 删除地址的多余信息，如分享地址。
            if (StrUtil.contains(url, StrUtil.SPACE)) {
                String trimmedUrl = StrUtil.subBetween(url, StrUtil.EMPTY, StrUtil.SPACE);
                return Optional.of(new URI(trimmedUrl));
            }
            return Optional.of(new URI(url));
        }
        catch (URISyntaxException e) {
            logger.error("[{}] 解析失败 [{}]", url, e.getMessage());
        }
        return Optional.empty();
    }
}
