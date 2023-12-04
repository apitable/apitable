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

package com.apitable.shared.component.notification;

import static com.apitable.shared.constants.NotificationConstants.BODY_EXTRAS;
import static com.apitable.shared.constants.NotificationConstants.INVOLVE_RECORD_IDS;
import static com.apitable.shared.constants.NotificationConstants.RECORD_MENTION_TIMES;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.text.CharSequenceUtil;
import cn.hutool.core.util.ArrayUtil;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSON;
import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.apitable.core.util.SpringContextHolder;
import com.apitable.shared.component.LanguageManager;
import com.apitable.shared.constants.NotificationConstants;
import com.apitable.shared.constants.ParamsConstants;
import com.apitable.shared.sysconfig.i18n.I18nConfigLoader;
import com.apitable.shared.sysconfig.i18n.I18nTypes;
import com.apitable.workspace.enums.IdRulePrefixEnum;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.util.AntPathMatcher;

/**
 * <p>
 * notification helper.
 * </p>
 *
 * @author zoe zheng
 */
@Slf4j
public class NotificationHelper {

    public static final int ID_PREFIX_LENGTH = 3;

    /**
     * The interface path of the operation node, which is used to determine whether to send space notifications.
     */
    private static final String[] NODE_OPERATION_PATHS = new String[] {
        "/internal/spaces/*/datasheets", "/internal/spaces/*/nodes/*/delete"
    };

    /**
     * get user locale.
     *
     * @param userId     target user
     * @param fromUserId from user id
     * @return user locale
     */
    public static I18nTypes getUserLanguageType(Long userId, Long fromUserId) {
        StringRedisTemplate stringRedisTemplate =
            SpringContextHolder.getBean(StringRedisTemplate.class);
        String lang;
        if (BooleanUtil.isTrue(stringRedisTemplate.hasKey(userId.toString()))) {
            lang = stringRedisTemplate.boundValueOps(userId.toString()).get();
        } else if (BooleanUtil.isTrue(stringRedisTemplate.hasKey(fromUserId.toString()))) {
            lang = stringRedisTemplate.boundValueOps(fromUserId.toString()).get();
        } else {
            return I18nTypes.aliasOf(LanguageManager.me().getDefaultLanguageTag());
        }
        return I18nTypes.of(lang);
    }

    /**
     * get extra data from notify body.
     *
     * @param notifyBody notify body
     * @return extra json object
     */
    public static JSONObject getExtrasFromNotifyBody(String notifyBody) {
        if (CharSequenceUtil.isNotBlank(notifyBody)) {
            return JSONUtil.parseObj(JSONUtil.parse(notifyBody).getByPath(BODY_EXTRAS));
        }
        return null;
    }

    /**
     * get extra data from notify body.
     *
     * @param notifyBody notify body
     * @return extra json object
     */
    public static JSONObject getExtrasFromNotifyBody(JSONObject notifyBody) {
        if (ObjectUtil.isNotNull(notifyBody)) {
            return JSONUtil.parseObj(notifyBody.getByPath(BODY_EXTRAS));
        }
        return null;
    }

    /**
     * get member id list from extra json object.
     *
     * @param extras extra json object
     * @return json key list
     */
    public static JSONArray getMemberIdsFromExtras(JSONObject extras) {
        if (ObjectUtil.isNotNull(extras)) {
            return JSONUtil.parseArray(extras.getByPath(NotificationConstants.INVOLVE_MEMBER_ID));
        }
        return null;
    }

    /**
     * get record id list of datasheet from extra json object.
     *
     * @param extras extra json object
     * @return json array
     */
    public static JSONArray getRecordIdsFromExtras(JSONObject extras) {
        if (ObjectUtil.isNotNull(extras)) {
            return JSONUtil.parseArray(extras.getByPath(NotificationConstants.INVOLVE_RECORD_IDS));
        }
        return null;
    }

    /**
     * append extra to render map.
     * todo update future
     *
     * @param extras extra json object
     * @return map
     */
    public static Map<String, Object> addExtrasToRenderMap(JSONObject extras) {
        Map<String, Object> map = new HashMap<>(16);
        if (extras != null && extras.size() > 0) {
            extras.forEach((k, v) -> {
                if (k.equals(INVOLVE_RECORD_IDS)) {
                    JSONArray arr = JSONUtil.parseArray(v);
                    if (arr.size() == 0) {
                        return;
                    }
                    map.put(StrUtil.removeSuffixIgnoreCase(k, "s"), arr.get(0));
                } else {
                    map.put(k, v);
                }
            });
        }
        return map;
    }

    /**
     * get template locale key.
     *
     * @param stringId i18n key
     * @param lang     user locale
     * @return locale
     */
    public static String getTemplateString(String stringId, I18nTypes lang) {
        return I18nConfigLoader.getText(stringId, lang);
    }

    /**
     * get mention body.
     *
     * @param oldBody old message body
     * @param newBody new message body
     * @return body
     */
    public static String getMentionBody(String oldBody, JSONObject newBody) {
        JSONArray oldRecordIds =
            NotificationHelper.getRecordIdsFromExtras(getExtrasFromNotifyBody(oldBody));
        JSONObject body = JSONUtil.parseObj(oldBody);
        if (ObjectUtil.isNotNull(newBody)) {
            JSONObject extras = JSONUtil.parseObj(newBody.get(BODY_EXTRAS));
            JSONArray newRecordIds = JSONUtil.parseArray(extras.get(INVOLVE_RECORD_IDS));
            ArrayList<Object> recordIds =
                CollUtil.distinct(CollUtil.addAll(oldRecordIds, newRecordIds.toArray()));
            extras.set(RECORD_MENTION_TIMES, ArrayUtil.length(recordIds.toArray()));
            extras.set(INVOLVE_RECORD_IDS, recordIds);
            body.set(BODY_EXTRAS, extras);
        } else {
            JSONObject extras = NotificationHelper.getExtrasFromNotifyBody(oldBody);
            if (extras != null) {
                extras.set(RECORD_MENTION_TIMES, oldRecordIds == null ? 0 : oldRecordIds.size());
                body.set(BODY_EXTRAS, extras);
            }
        }
        return JSONUtil.toJsonStr(body);
    }

    /**
     * get node id from request.
     *
     * @param requestWrapper request
     * @param response       response
     * @return object
     */
    public static Object resolveNodeId(RequestStorage requestWrapper,
                                       Object response) {
        for (ParamLocation paramLocation : ParamLocation.values()) {
            Object nodeId = resolveNodeIdFromParameter(paramLocation, requestWrapper, response);
            if (nodeId != null) {
                return nodeId;
            }
        }
        return null;
    }

    /**
     * is node request.
     *
     * @param servletPath servlet context path
     * @return true | false
     */
    public static boolean isNodeOperate(String servletPath) {
        String[] pathNames = StrUtil.splitToArray(servletPath, "/");
        for (String pathName : pathNames) {
            if ("node".equals(pathName)) {
                return true;
            }
            if ("quote".equals(pathName)) {
                return true;
            }
        }
        AntPathMatcher antPathMatcher = new AntPathMatcher();
        return Arrays.stream(NODE_OPERATION_PATHS)
            .anyMatch(e -> antPathMatcher.match(e, servletPath));
    }

    /**
     * get node info view from response.
     *
     * @param response response object
     * @return Node info view
     */
    public static SpaceNotificationInfo.NodeInfo resolveNodeInfoFromResponse(Object response) {
        SpaceNotificationInfo.NodeInfo nodeInfo = new SpaceNotificationInfo.NodeInfo();
        JSONObject resObj = JSONUtil.parseObj(response);
        if (!resObj.isEmpty()) {
            JSONObject data = resObj.getJSONObject("data");
            if (data != null) {
                String parent = "parentId";
                if (data.containsKey(parent)) {
                    nodeInfo.setParentId(data.getStr(parent));
                }
            }
        }
        return nodeInfo;
    }

    /**
     * get user socket id from request.
     *
     * @param requestStorage request parameter map
     * @return socketId
     */
    public static String resolvePlayerSocketId(RequestStorage requestStorage) {
        String socketId =
            requestStorage.getHeaderMap().get(ParamsConstants.PLAYER_SOCKET_ID);
        return StrUtil.blankToDefault(socketId, "");
    }

    /**
     * resolve node id param location.
     *
     * @param paramLocation  param location
     * @param requestWrapper request wrapper
     * @param responseData   responseData
     * @return Object
     */
    public static Object resolveNodeIdFromParameter(ParamLocation paramLocation,
                                                    RequestStorage requestWrapper,
                                                    Object responseData) {
        String paramName = "nodeId";

        if (paramLocation == ParamLocation.RESPONSE) {
            JSONObject response = JSONUtil.parseObj(responseData);
            Object data = response.get("data");
            if (data != null) {
                JSON json = JSONUtil.parse(data);
                if (json instanceof JSONObject) {
                    String value = ((JSONObject) json).getStr(paramName);
                    if (isNodeId(value)) {
                        return value;
                    }
                }
            }
        }

        if (paramLocation == ParamLocation.QUERY) {
            return resolveFromQuery(requestWrapper, paramName);
        }

        if (paramLocation == ParamLocation.BODY) {
            return resolveFromBody(requestWrapper, paramName);
        }

        if (paramLocation == ParamLocation.PATH) {
            String[] pathNames = StrUtil.splitToArray(requestWrapper.getServletPath(), "/");
            if (pathNames.length > 0) {
                String pathName = pathNames[pathNames.length - 1];
                if (isNodeId(pathName)) {
                    return pathName;
                }
            }
        }
        return null;
    }

    public static Object resolveFromQuery(RequestStorage requestWrapper,
                                          String paramName) {
        return requestWrapper.getParamMap().get(paramName);
    }

    /**
     * resolve from body.
     *
     * @param requestWrapper request wrapper
     * @param paramName      param name
     * @return Object
     */
    public static Object resolveFromBody(RequestStorage requestWrapper,
                                         String paramName) {
        String requestBody = new String(requestWrapper.getRequestContentAsByteArray());
        if (StrUtil.isNotBlank(requestBody)) {
            JSONObject map = JSONUtil.parseObj(requestBody);
            if (map.containsKey(paramName)) {
                return map.get(paramName);
            }
        }

        return null;
    }

    /**
     * whether is node id.
     *
     * @param id string key
     * @return true | false
     */
    public static boolean isNodeId(String id) {
        List<String> nodeIdPrefixes = Arrays.asList(IdRulePrefixEnum.FOD.getIdRulePrefixEnum(),
            IdRulePrefixEnum.DST.getIdRulePrefixEnum(), IdRulePrefixEnum.FORM.getIdRulePrefixEnum(),
            IdRulePrefixEnum.DASHBOARD.getIdRulePrefixEnum(),
            IdRulePrefixEnum.MIRROR.getIdRulePrefixEnum());
        return nodeIdPrefixes.contains(id.substring(0, ID_PREFIX_LENGTH));
    }
}
