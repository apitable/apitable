package com.vikadata.api.component.notification;

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
import cn.hutool.core.util.ReUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.component.LanguageManager;
import com.vikadata.api.component.audit.AuditHelper;
import com.vikadata.api.component.audit.ParamLocation;
import com.vikadata.api.constants.NodeExtraConstants;
import com.vikadata.api.constants.NotificationConstants;
import com.vikadata.api.constants.ParamsConstants;
import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;
import com.vikadata.system.config.I18nConfigManager;
import com.vikadata.system.config.i18n.I18nTypes;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.util.ContentCachingRequestWrapper;

import static com.vikadata.api.constants.NotificationConstants.BODY_EXTRAS;
import static com.vikadata.api.constants.NotificationConstants.INVOLVE_RECORD_IDS;
import static com.vikadata.api.constants.NotificationConstants.RECORD_MENTION_TIMES;

/**
 * <p>
 * template工具类
 * </p>
 *
 * @author zoe zheng
 * @date 2020/5/13 2:05 下午
 */
@Slf4j
public class NotificationHelper {
    /**
     * 钉钉isv应用入口页地址
     */
    public static String DINGTALK_ISV_ENTRY_URL = "{}/user/dingtalk/social_bind_space?corpId={}&suiteId={}";

    /**
     * 钉钉isv应用入口页地址
     */
    public static String DINGTALK_ENTRY_URL = "{}/user/dingtalk_callback?corpId={}&agentId={}";

    /**
     * 操作节点的接口路径，用于判断是否发送空间通知
     */
    private static final String[] NODE_OPERATION_PATHS = new String[] {
            "/internal/spaces/*/datasheets", "/internal/spaces/*/nodes/*/delete"
    };

    /**
     * @param userId     消息触达用户ID
     * @param fromUserId 消息来源ID
     * @return 用户语言
     * @author zoe zheng
     * @date 2020/6/3 12:41 下午
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
        log.info("用户语言: {}", lang);
        return I18nTypes.of(lang);
    }

    /**
     * 获取消息通知body里面的extras数据
     *
     * @param notifyBody 通知body
     * @return 解析之后的extras
     * @author zoe zheng
     * @date 2020/6/3 12:42 下午
     */
    public static JSONObject getExtrasFromNotifyBody(String notifyBody) {
        if (CharSequenceUtil.isNotBlank(notifyBody)) {
            return JSONUtil.parseObj(JSONUtil.parse(notifyBody).getByPath(BODY_EXTRAS));
        }
        return null;
    }

    /**
     * 获取消息通知body里面的extras数据
     *
     * @param notifyBody 通知body
     * @return 解析之后的extras
     * @author zoe zheng
     * @date 2020/6/3 12:42 下午
     */
    public static JSONObject getExtrasFromNotifyBody(JSONObject notifyBody) {
        if (ObjectUtil.isNotNull(notifyBody)) {
            return JSONUtil.parseObj(notifyBody.getByPath(BODY_EXTRAS));
        }
        return null;
    }

    /**
     * 获取extras里面的memberIds
     *
     * @param extras JSON结构
     * @return JSON数组
     * @author zoe zheng
     * @date 2020/6/17 2:56 下午
     */
    public static JSONArray getMemberIdsFromExtras(JSONObject extras) {
        if (ObjectUtil.isNotNull(extras)) {
            return JSONUtil.parseArray(extras.getByPath(NotificationConstants.INVOLVE_MEMBER_ID));
        }
        return null;
    }

    /**
     * 获取recordIds
     *
     * @param extras body中的额外字段
     * @return JSON数组
     * @author zoe zheng
     * @date 2020/6/18 5:46 下午
     */
    public static JSONArray getRecordIdsFromExtras(JSONObject extras) {
        if (ObjectUtil.isNotNull(extras)) {
            return JSONUtil.parseArray(extras.getByPath(NotificationConstants.INVOLVE_RECORD_IDS));
        }
        return null;
    }

    /**
     * 组装extras的渲染map todo 修改
     *
     * @param extras 通知消息body里面的extras
     * @return 键值对
     * @author zoe zheng
     * @date 2020/6/3 12:42 下午
     */
    public static Map<String, Object> addExtrasToRenderMap(JSONObject extras) {
        Map<String, Object> map = new HashMap<>(16);
        if (extras != null && extras.size() > 0) {
            extras.forEach((k, v) -> {
                // 解析记录行关键字
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
     * 获取渲染模版需要的字段
     *
     * @param content 模版内容
     * @return 模版需要渲染的字段list
     * @author zoe zheng
     * @date 2020/5/21 3:15 下午
     */
    public static List<String> getRenderField(String content) {
        return ReUtil.findAll("\\{\\{(.*?)\\}\\}", content, 1, new ArrayList<>());
    }

    /**
     * 根据模版id获取airtable,config.strings的内容
     *
     * @param stringId airtable中config.strings的id
     * @param lang     用户语言
     * @return 语言对应的字符串
     * @author zoe zheng
     * @date 2020/5/23 2:24 下午
     */
    public static String getTemplateString(String stringId, I18nTypes lang) {
        return I18nConfigManager.getText(I18nConfigManager.getConfig().getStrings().get(stringId), lang);
    }

    /**
     * 获取成员提及的body
     *
     * @param oldBody 数据库已经存在的body
     * @param newBody 更新的body
     * @return 消息体
     */
    public static String getMentionBody(String oldBody, JSONObject newBody) {
        JSONArray oldRecordIds = NotificationHelper.getRecordIdsFromExtras(getExtrasFromNotifyBody(oldBody));
        JSONObject body = JSONUtil.parseObj(oldBody);
        // 需要更新
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
     * 从返回数据中获取值
     *
     * @param requestWrapper  请求数据
     * @param response 返回数据
     * @return object
     * @author zoe zheng
     * @date 2020/7/10 11:45 上午
     */
    public static Object resolveNodeId(ContentCachingRequestWrapper requestWrapper, Object response) {
        // 从返回值获取
        for (ParamLocation paramLocation : ParamLocation.values()) {
            Object nodeId = AuditHelper.resolveNodeId(paramLocation, requestWrapper, response);
            if (nodeId != null) {
                return nodeId;
            }
        }
        return null;
    }

    /**
     * @param requestWrapper 请求体
     * @return 节点分享设置的值
     * @author zoe zheng
     * @date 2020/7/13 2:37 下午
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
     * 根据path判断是否是对节点的操作
     *
     * @param servletPath servlet 请求路径
     * @return 是否存在
     * @author zoe zheng
     * @date 2020/7/13 2:38 下午
     */
    public static boolean isNodeOperate(String servletPath) {
        String[] pathNames = StrUtil.split(servletPath, "/");
        for (String pathName : pathNames) {
            if ("node".equals(pathName)) {
                return true;
            }
            // 使用模版
            if ("quote".equals(pathName)) {
                return true;
            }
        }
        AntPathMatcher antPathMatcher = new AntPathMatcher();
        return Arrays.stream(NODE_OPERATION_PATHS)
                .anyMatch(e -> antPathMatcher.match(e, servletPath));
    }

    /**
     * 从返回数据中提取nodeInfo
     *
     * @param response 返回数据
     * @return NodeInfoVo 节点详细数据
     * @author zoe zheng
     * @date 2020/7/10 11:47 上午
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
     * 提出用户的长链socketId
     *
     * @param requestWrapper 请求体
     * @return socketId
     * @author zoe zheng
     * @date 2020/7/14 6:02 下午
     */
    public static String resolvePlayerSocketId(ContentCachingRequestWrapper requestWrapper) {
        String socketId = requestWrapper.getHeader(ParamsConstants.PLAYER_SOCKET_ID);
        return StrUtil.blankToDefault(socketId, "");
    }

    /**
     * 组织节点变更的消息（from request)
     *
     * @param requestWrapper 请求体
     * @return SpaceNotificationInfo.NodeInfo
     * @author zoe zheng
     * @date 2020/7/13 4:00 下午
     */
    public static SpaceNotificationInfo.NodeInfo
    resolveNodeInfoFromRequest(ContentCachingRequestWrapper requestWrapper) {
        SpaceNotificationInfo.NodeInfo nodeInfo = new SpaceNotificationInfo.NodeInfo();
        Object nodeName = AuditHelper.resolveFromBody(requestWrapper, "nodeName");
        Object icon = AuditHelper.resolveFromBody(requestWrapper, "icon");
        Object cover = AuditHelper.resolveFromBody(requestWrapper, "cover");
        Object parentId = AuditHelper.resolveFromBody(requestWrapper, "parentId");
        Object nodeShare = resolveNodeShared(requestWrapper);
        Object description = AuditHelper.resolveFromBody(requestWrapper, "description");
        Object preNodeId = AuditHelper.resolveFromBody(requestWrapper, "preNodeId");
        Object showRecordHistory = AuditHelper.resolveFromBody(requestWrapper, NodeExtraConstants.SHOW_RECORD_HISTORY);
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
}
