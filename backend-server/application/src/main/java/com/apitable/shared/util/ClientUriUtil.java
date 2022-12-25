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

import com.apitable.workspace.enums.IdRulePrefixEnum;
import com.apitable.workspace.enums.UrlRulePrefixEnum;

/**
 * <p>
 * client nginx $request_uri parse util
 * </p>
 *
 * @author Pengap
 */
public class ClientUriUtil {

    private static final Logger logger = LoggerFactory.getLogger(ClientUriUtil.class);

    /**
     * parsing client uri
     * <p>
     * before：http://{ip}/share/shrKk0fJy24hZhkJWFmlG sheet description......
     * <p>
     * after：https://{ip}/share/shrKk0fJy24hZhkJWFmlG
     *
     * @param originalUrl nginx $request_uri
     * @return uri
     */
    public static String parseOriginUrlPath(String originalUrl) {
        String uri = "";
        if (StrUtil.isNotBlank(originalUrl)) {
            uri = URLUtil.toURI(URLUtil.decode(originalUrl), true).getPath();
        }
        // Filter data after spaces
        if (StrUtil.contains(uri, " ")) {
            uri = StrUtil.subBetween(uri, "", " ");
        }
        return URLUtil.getPath(uri);
    }

    /**
     * Get meta specific information
     *
     * @param uri nginx $request_uri
     * @return meta
     */
    public static boolean isMatchSharePath(String uri) {
        String uriCase = "/share/" + IdRulePrefixEnum.SHARE.getIdRulePrefixEnum();
        String tpcCase = "/template/" + IdRulePrefixEnum.TPC.getIdRulePrefixEnum();
        String spaceCase = "/space/" + IdRulePrefixEnum.SPC.getIdRulePrefixEnum();
        String tplCase = "/" + IdRulePrefixEnum.TPL.getIdRulePrefixEnum();
        if (StrUtil.containsIgnoreCase(uri, uriCase)) {
            return true;
        }
        return StrUtil.containsIgnoreCase(uri, tpcCase) && !StrUtil.containsIgnoreCase(uri, spaceCase) && StrUtil.containsIgnoreCase(uri, tplCase);
    }

    /**
     * Get various IDs with prefix from uri, case-insensitive<br>
     *
     * getIdFromUri(uri, IdRulePrefixEnum.SHARE.getIdRulePrefixEnum());
     *
     * @param uri uri address
     * @param prefix prefix
     * @return null|string
     */
    public static String getIdFromUri(String uri, String prefix) {
        String uriSeparator = "/";
        String[] path = StrUtil.split(StrUtil.removePrefix(StrUtil.removeSuffix(uri, uriSeparator), uriSeparator), uriSeparator);
        for (String s : path) {
            // There is a shr keyword in the route to describe the shared node, find the node description and name
            if (StrUtil.containsIgnoreCase(s, prefix)) {
                return s;
            }
        }
        return null;
    }

    /**
     * whether the address is the workbench node address
     * @param uri uri address
     * @return true | false
     */
    public static boolean isMatchWorkbenchPath(URI uri) {
        return StrUtil.startWithIgnoreCase(uri.getPath(),
                UrlRulePrefixEnum.WORKBENCH_URL_PFE_SUFFIX.getValue());
    }

    /**
     * Whether the address is a shared node address
     * @param uri uri address
     * @return true | false
     */
    public static boolean isMatchSharePath(URI uri) {
        return StrUtil.startWithIgnoreCase(uri.getPath(),
                UrlRulePrefixEnum.SHARE_URL_PFE_SUFFIX.getValue());
    }

    /**
     * Get sharing information according to the sharing address
     * @param uri uri
     * @return node id optional
     */
    public static Optional<String> getShareIdByPath(URI uri) {
        String pathAboutSharedInfo = uri.getPath()
                .substring(UrlRulePrefixEnum.SHARE_URL_PFE_SUFFIX.getValue().length());
        return getIdByPath(pathAboutSharedInfo);
    }

    /**
     * Get the node id information according to the workbench node address
     * @param uri uri
     * @return node id optional
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
            logger.error("[{}] parsing failed [{}]", url, e.getMessage());
        }
        return Optional.empty();
    }

    public static Optional<URI> urlTurnIntoURI(String url) {
        try {
            // Delete redundant information about the address, such as sharing address.
            if (StrUtil.contains(url, StrUtil.SPACE)) {
                String trimmedUrl = StrUtil.subBetween(url, StrUtil.EMPTY, StrUtil.SPACE);
                return Optional.of(new URI(trimmedUrl));
            }
            return Optional.of(new URI(url));
        }
        catch (URISyntaxException e) {
            logger.error("[{}] parsing failed [{}]", url, e.getMessage());
        }
        return Optional.empty();
    }
}
