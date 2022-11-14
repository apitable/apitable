package com.vikadata.api.shared.component.notification;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.text.CharSequenceUtil;
import cn.hutool.core.util.ArrayUtil;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.shared.component.LanguageManager;
import com.vikadata.api.shared.constants.NodeExtraConstants;
import com.vikadata.api.shared.constants.NotificationConstants;
import com.vikadata.api.shared.constants.ParamsConstants;
import com.vikadata.api.workspace.enums.IdRulePrefixEnum;
import com.vikadata.core.util.SpringContextHolder;
import com.vikadata.system.config.I18nConfigManager;
import com.vikadata.system.config.i18n.I18nTypes;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.util.ContentCachingRequestWrapper;

import static com.vikadata.api.shared.constants.NotificationConstants.BODY_EXTRAS;
import static com.vikadata.api.shared.constants.NotificationConstants.INVOLVE_RECORD_IDS;
import static com.vikadata.api.shared.constants.NotificationConstants.RECORD_MENTION_TIMES;

/**
 * <p>
 * notification helper
 * </p>
 *
 * @author zoe zheng
 */
@Slf4j
public class NotificationHelper {

    public static final int ID_PREFIX_LENGTH = 3;

    /**
     * dingtalk isv entry url
     */
    public static String DINGTALK_ISV_ENTRY_URL = "{}/user/dingtalk/social_bind_space?corpId={}&suiteId={}";

    /**
     * dingtalk entry url
     */
    public static String DINGTALK_ENTRY_URL = "{}/user/dingtalk_callback?corpId={}&agentId={}";

    /**
     * The interface path of the operation node, which is used to determine whether to send space notifications
     */
    private static final String[] NODE_OPERATION_PATHS = new String[] {
            "/internal/spaces/*/datasheets", "/internal/spaces/*/nodes/*/delete"
    };

    /**
     * @param userId    target user
     * @param fromUserId  from user id
     * @return user locale
     */
    public static I18nTypes getUserLanguageType(Long userId, Long fromUserId) {
        StringRedisTemplate stringRedisTemplate = SpringContextHolder.getBean(StringRedisTemplate.class);
        String lang;
        if (BooleanUtil.isTrue(stringRedisTemplate.hasKey(userId.toString()))) {
            lang = stringRedisTemplate.boundValueOps(userId.toString()).get();
        }
        else if (BooleanUtil.isTrue(stringRedisTemplate.hasKey(fromUserId.toString()))) {
            lang = stringRedisTemplate.boundValueOps(fromUserId.toString()).get();
        }
        else {
            return I18nTypes.aliasOf(LanguageManager.me().getDefaultLanguageTag());
        }
        return I18nTypes.of(lang);
    }

    /**
     * get extra data from notify body
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
     * get extra data from notify body
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
     * get member id list from extra json object
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
     * get record id list of datasheet from extra json object
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
     * append extra to render map
     * todo update future
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
                }
                else {
                    map.put(k, v);
                }
            });
        }
        return map;
    }

    /**
     * get template locale key
     *
     * @param stringId i18n key
     * @param lang user locale
     * @return locale
     */
    public static String getTemplateString(String stringId, I18nTypes lang) {
        return I18nConfigManager.getText(I18nConfigManager.getConfig().getStrings().get(stringId), lang);
    }

    /**
     * get mention body
     *
     * @param oldBody old message body
     * @param newBody new message body
     * @return body
     */
    public static String getMentionBody(String oldBody, JSONObject newBody) {
        JSONArray oldRecordIds = NotificationHelper.getRecordIdsFromExtras(getExtrasFromNotifyBody(oldBody));
        JSONObject body = JSONUtil.parseObj(oldBody);
        if (ObjectUtil.isNotNull(newBody)) {
            JSONObject extras = JSONUtil.parseObj(newBody.get(BODY_EXTRAS));
            JSONArray newRecordIds = JSONUtil.parseArray(extras.get(INVOLVE_RECORD_IDS));
            ArrayList<Object> recordIds = CollUtil.distinct(CollUtil.addAll(oldRecordIds, newRecordIds.toArray()));
            extras.set(RECORD_MENTION_TIMES, ArrayUtil.length(recordIds.toArray()));
            extras.set(INVOLVE_RECORD_IDS, recordIds);
            body.set(BODY_EXTRAS, extras);
        }
        else {
            JSONObject extras = NotificationHelper.getExtrasFromNotifyBody(oldBody);
            if (extras != null) {
                extras.set(RECORD_MENTION_TIMES, oldRecordIds == null ? 0 : oldRecordIds.size());
                body.set(BODY_EXTRAS, extras);
            }
        }
        return JSONUtil.toJsonStr(body);
    }

    /**
     * get node id from request
     *
     * @param requestWrapper request
     * @param response response
     * @return object
     */
    public static Object resolveNodeId(ContentCachingRequestWrapper requestWrapper, Object response) {
        for (ParamLocation paramLocation : ParamLocation.values()) {
            Object nodeId = resolveNodeId(paramLocation, requestWrapper, response);
            if (nodeId != null) {
                return nodeId;
            }
        }
        return null;
    }

    /**
     * get share node id from request
     * @param requestWrapper request object
     * @return share node id
     */
    public static Object resolveNodeShared(ContentCachingRequestWrapper requestWrapper) {
        String uri = requestWrapper.getServletPath();
        String[] pathNames = StrUtil.split(uri, "/");
        for (String pathName : pathNames) {
            if ("updateShare".equals(pathName)) {
                return true;
            }
            if ("disableShare".equals(pathName)) {
                return false;
            }
        }
        return null;
    }

    /**
     * is node request
     *
     * @param servletPath servlet context path
     * @return true | false
     */
    public static boolean isNodeOperate(String servletPath) {
        String[] pathNames = StrUtil.split(servletPath, "/");
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
     * get node info view from response
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
     * get user socket id from request
     *
     * @param requestWrapper request object
     * @return socketId
     */
    public static String resolvePlayerSocketId(ContentCachingRequestWrapper requestWrapper) {
        String socketId = requestWrapper.getHeader(ParamsConstants.PLAYER_SOCKET_ID);
        return StrUtil.blankToDefault(socketId, "");
    }

    /**
     * get node info view from request
     *
     * @param requestWrapper request object
     * @return SpaceNotificationInfo.NodeInfo
     */
    public static SpaceNotificationInfo.NodeInfo resolveNodeInfoFromRequest(ContentCachingRequestWrapper requestWrapper) {
        SpaceNotificationInfo.NodeInfo nodeInfo = new SpaceNotificationInfo.NodeInfo();
        Object nodeName = resolveFromBody(requestWrapper, "nodeName");
        Object icon = resolveFromBody(requestWrapper, "icon");
        Object cover = resolveFromBody(requestWrapper, "cover");
        Object parentId = resolveFromBody(requestWrapper, "parentId");
        Object nodeShare = resolveNodeShared(requestWrapper);
        Object description = resolveFromBody(requestWrapper, "description");
        Object preNodeId = resolveFromBody(requestWrapper, "preNodeId");
        Object showRecordHistory = resolveFromBody(requestWrapper, NodeExtraConstants.SHOW_RECORD_HISTORY);
        if (nodeName != null) {
            nodeInfo.setNodeName(nodeName.toString());
        }
        if (icon != null) {
            nodeInfo.setIcon(icon.toString());
        }
        if (cover != null) {
            nodeInfo.setCover(cover.toString());
        }
        if (parentId != null) {
            nodeInfo.setParentId(parentId.toString());
        }
        if (nodeShare != null) {
            nodeInfo.setNodeShared(Boolean.valueOf(nodeShare.toString()));
        }
        if (description != null) {
            nodeInfo.setDescription(description.toString());
        }
        if (preNodeId != null && !StrUtil.isBlankOrUndefined(preNodeId.toString())) {
            nodeInfo.setPreNodeId(preNodeId.toString());
        }
        if (showRecordHistory != null) {
            nodeInfo.setShowRecordHistory(Integer.parseInt(showRecordHistory.toString()));
        }
        return nodeInfo;
    }

    public static Object resolveNodeId(ParamLocation nodeParamLoc, ContentCachingRequestWrapper requestWrapper, Object responseData) {
        String paramName = "nodeId";

        if (nodeParamLoc == ParamLocation.RESPONSE) {
            JSONObject response = JSONUtil.parseObj(responseData);
            JSONObject data = response.getJSONObject("data");
            if (ObjectUtil.isNotNull(data)) {
                Object value = data.get(paramName);
                if (ObjectUtil.isNotNull(value) && StrUtil.isNotBlank(value.toString())) {
                    if (isNodeId(value.toString())) {
                        return value;
                    }
                }
            }
        }

        if (nodeParamLoc == ParamLocation.QUERY) {
            return resolveFromQuery(requestWrapper, paramName);
        }

        if (nodeParamLoc == ParamLocation.BODY) {
            return resolveFromBody(requestWrapper, paramName);
        }

        if (nodeParamLoc == ParamLocation.PATH) {
            String[] pathNames = StrUtil.split(requestWrapper.getServletPath(), "/");
            if (pathNames.length > 0) {
                String pathName = pathNames[pathNames.length - 1];
                if (isNodeId(pathName)) {
                    return pathName;
                }
            }
        }
        return null;
    }

    public static Object resolveFromQuery(ContentCachingRequestWrapper requestWrapper, String paramName) {
        return requestWrapper.getParameter(paramName);
    }

    public static Object resolveFromBody(ContentCachingRequestWrapper requestWrapper, String paramName) {
        String requestBody = new String(requestWrapper.getContentAsByteArray());
        if (StrUtil.isNotBlank(requestBody)) {
            JSONObject map = JSONUtil.parseObj(requestBody);
            if (map.containsKey(paramName)) {
                return map.get(paramName);
            }
        }

        return null;
    }

    public static boolean isNodeId(String id) {
        List<String> nodeIdPrefixes = Arrays.asList(IdRulePrefixEnum.FOD.getIdRulePrefixEnum(),
                IdRulePrefixEnum.DST.getIdRulePrefixEnum(), IdRulePrefixEnum.FORM.getIdRulePrefixEnum(),
                IdRulePrefixEnum.DASHBOARD.getIdRulePrefixEnum(), IdRulePrefixEnum.MIRROR.getIdRulePrefixEnum());
        return nodeIdPrefixes.contains(id.substring(0, ID_PREFIX_LENGTH));
    }
}
