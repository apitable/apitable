package com.vikadata.social.feishu;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import cn.hutool.core.map.MapUtil;
import cn.hutool.core.thread.ThreadUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.fasterxml.jackson.core.type.TypeReference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vikadata.social.feishu.api.impl.FeishuTemplate;
import com.vikadata.social.feishu.config.FeishuConfigStorage;
import com.vikadata.social.feishu.event.BaseEvent;
import com.vikadata.social.feishu.event.FeishuEventParser;
import com.vikadata.social.feishu.event.contact.v3.BaseV3ContactEvent;
import com.vikadata.social.feishu.event.v3.FeishuV3ContactEventParser;

/**
 * 飞书 服务类
 * <p>
 * 唯一入口类，包含配置管理、事件管理、HTTP请求管理、事件解析器
 *
 * @author Shawn Deng
 * @date 2020-11-20 17:54:21
 */
public class FeishuServiceProvider {

    private static final Logger LOGGER = LoggerFactory.getLogger(FeishuServiceProvider.class);

    public static final String URL_VERIFICATION_EVENT = "url_verification";

    public static final String EVENT_CALLBACK_EVENT = "event_callback";

    /**
     * 飞书 API 接口实例
     */
    private final FeishuTemplate feishuTemplate;

    /**
     * 事件解析器，为监听器服务
     */
    private final FeishuEventParser eventParser = FeishuEventParser.create();

    /**
     * 新版通讯录事件解析器
     */
    private final FeishuV3ContactEventParser v3ContactEventParser = FeishuV3ContactEventParser.create();

    /**
     * 事件监听管理器
     */
    private final FeishuEventListenerManager eventListenerManager = new FeishuEventListenerManager();

    /**
     * 延迟任务线程池
     */
    private final ScheduledExecutorService delayExecutor = new ScheduledThreadPoolExecutor(1, ThreadUtil.newNamedThreadFactory("delay-task", true));

    public FeishuServiceProvider() {
        this.feishuTemplate = new FeishuTemplate();
    }

    public String wrapperEventNotify(String jsonString) {
        getFeishuTemplate().switchDefault();
        return eventNotify(jsonString);
    }

    /**
     * 事件订阅推送
     *
     * @param jsonString 推送数据
     * @return 响应结果
     */
    public String eventNotify(String jsonString) {
        // 解析成JSON结构
        Map<String, Object> notifyData = decryptIfNeed(jsonString);
        if (LOGGER.isDebugEnabled()) {
            LOGGER.debug("事件数据结构:{}", JSONUtil.toJsonPrettyStr(notifyData));
        }
        Object type = notifyData.get("type");
        if (type == null) {
            Object schema = notifyData.get("schema");
            if (schema == null) {
                LOGGER.error("无法解析事件类型");
                return "";
            }
            LOGGER.info("接收到新版的通讯录变更事件");
            // 处理新版的通讯录变更事件
            // header部分
            Map<String, Object> headerMap = MapUtil.get(notifyData, "header", new cn.hutool.core.lang.TypeReference<Map<String, Object>>() {});
            // 检查TOKEN
            checkToken(headerMap);
            // 获取新版通讯录的类型
            String contactType = (String) headerMap.get("event_type");
            BaseV3ContactEvent event = v3ContactEventParser.parseEvent(contactType, notifyData);
            if (event == null) {
                LOGGER.info("找不到对应新版通讯录事件监听器，是否未给此事件配置处理方法，默认不处理");
                return "";
            }
            if (!getFeishuTemplate().getConfigStorage().getAppId().equals(event.getHeader().getAppId())) {
                // APP ID 不一致也是错误的，可能会乱串应用通知
                throw new IllegalStateException("应用不匹配，回调地址配错");
            }
            Object eventResult = eventListenerManager.fireV3ContactEventCallback(event);
            if (eventResult == null) {
                return "";
            }
            return JSONUtil.toJsonStr(eventResult);
        }
        String eventType = (String) type;
        if (StrUtil.isBlank(eventType)) {
            LOGGER.error("事件类型[type]为空内容");
            return "";
        }
        LOGGER.info("Event Type：{}", eventType);
        if (eventType.equals(URL_VERIFICATION_EVENT)) {
            // 验证回调地址
            return challenge(notifyData);
        }
        else if (eventType.equals(EVENT_CALLBACK_EVENT)) {
            // 事件回调
            checkToken(notifyData);
            // 事件内容
            Map<String, Object> eventData = MapUtil.get(notifyData, "event", new cn.hutool.core.lang.TypeReference<Map<String, Object>>() {});
            if (eventData == null) {
                LOGGER.error("事件内容不能为空");
                return "";
            }
            String eventSubType = eventData.get("type").toString();
            LOGGER.info("Event Name：{}", eventSubType);
            BaseEvent event = eventParser.parseEvent(eventSubType, eventData);
            if (event == null) {
                LOGGER.info("找不到对应事件监听器，是否未给此事件配置处理方法，默认不处理");
                return "";
            }
            if (!getFeishuTemplate().getConfigStorage().getAppId().equals(event.getAppId())) {
                // APP ID 不一致也是错误的，可能会乱串应用通知
                throw new IllegalStateException("应用不匹配，回调地址配错");
            }
            // 事件路由处理
            BaseEvent.Meta meta = new BaseEvent.Meta();
            String uuid = (String) notifyData.get("uuid");
            meta.setUuid(uuid);
            String ts = (String) notifyData.get("ts");
            meta.setTs(ts);
            LOGGER.info("消息标识：{}, 发送时间: {}", uuid, ts);
            event.setMeta(meta);
            if (LOGGER.isDebugEnabled()) {
                LOGGER.debug("消息体：{}", JSONUtil.toJsonStr(eventData));
            }
            Object eventResult = eventListenerManager.fireEventCallback(event);
            if (eventResult == null) {
                return "";
            }
            return JSONUtil.toJsonStr(eventResult);
        }
        return "";
    }

    public String wrapperCardEventNotify(String jsonString) {
        String result = cardNotify(jsonString);
        return result;
    }

    /**
     * 消息卡片事件订阅推送
     *
     * @param jsonData 推送数据
     * @return 响应数据
     */
    public String cardNotify(String jsonData) {
        System.out.println(jsonData);
        return null;
    }

    /**
     * 如果配置了密钥，则解密数据解析成JSON，否则返回原数据的解析
     *
     * @param jsonString 加密的数据
     * @return JSONObject JSON结构
     */
    public Map<String, Object> decryptIfNeed(String jsonString) {
        Map<String, Object> json;
        try {
            json = Jackson4FeishuConverter.toObject(jsonString, new TypeReference<Map<String, Object>>() {});
        }
        catch (IOException e) {
            throw new RuntimeException("解析事件通知数据失败: " + jsonString, e);
        }
        FeishuConfigStorage configStorage = getFeishuTemplate().getConfigStorage();
        if (!configStorage.needDecrypt()) {
            return json;
        }
        Object encryptData = json.get("encrypt");
        if (encryptData == null) {
            throw new RuntimeException("数据未加密");
        }

        String decryptJson;
        try {
            decryptJson = configStorage.decrypt(encryptData.toString());
        }
        catch (Exception e) {
            throw new IllegalStateException("decrypt json data error");
        }
        try {
            return Jackson4FeishuConverter.toObject(decryptJson, new TypeReference<Map<String, Object>>() {});
        }
        catch (IOException e) {
            throw new RuntimeException("解析已解密的数据失败", e);
        }
    }

    /**
     * 验证URL的响应结果
     *
     * @param notifyData 通知数据
     * @return 响应的JSON字符串
     */
    public String challenge(Map<String, Object> notifyData) {
        checkToken(notifyData);
        FeishuConfigStorage configStorage = getFeishuTemplate().getConfigStorage();
        if (configStorage != null && configStorage.isv()) {
            // 商店应用初次验证回调URL时，主动重新发送ticket事件
            LOGGER.info("当前应用是独立服务商，事件订阅地址验证完成，1秒后主动触发重新发送ticket");
            delayExecutor.schedule(() ->
                    getFeishuTemplate().resendAppTicket(
                            configStorage.getAppId(), configStorage.getAppSecret()), 1, TimeUnit.SECONDS);
        }
        return JSONUtil.createObj().set("challenge", notifyData.get("challenge")).toString();
    }

    public void checkToken(Map<String, Object> json) {
        String token = json.get("token").toString();
        if (!getFeishuTemplate().getConfigStorage().checkVerificationToken(token)) {
            LOGGER.error("验证Token失败, illegal token: {}", token);
            throw new IllegalStateException("遇到非法事件攻击，也许是未配置正确");
        }
    }

    public FeishuTemplate getFeishuTemplate() {
        return feishuTemplate;
    }

    public FeishuEventListenerManager getEventListenerManager() {
        return eventListenerManager;
    }

    public FeishuEventParser getEventParser() {
        return eventParser;
    }

    public FeishuV3ContactEventParser getV3ContactEventParser() {
        return v3ContactEventParser;
    }
}
