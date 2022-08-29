package com.vikadata.social.dingtalk;

import java.util.HashMap;
import java.util.Map;

import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vikadata.social.core.AppTicketStorage;
import com.vikadata.social.core.ConfigStorage;
import com.vikadata.social.dingtalk.DingtalkConfig.AgentApp;
import com.vikadata.social.dingtalk.DingtalkConfig.IsvApp;
import com.vikadata.social.dingtalk.enums.DingTalkEventTag;
import com.vikadata.social.dingtalk.enums.DingTalkSyncAction;
import com.vikadata.social.dingtalk.event.BaseEvent;
import com.vikadata.social.dingtalk.event.DingTalkEventParser;
import com.vikadata.social.dingtalk.exception.DingTalkEncryptException;
import com.vikadata.social.dingtalk.util.DingTalkCallbackCrypto;

import static com.vikadata.social.dingtalk.constants.DingTalkConst.DING_TALK_CALLBACK_SUCCESS;

/*** 飞书 服务类
 * <p>
 * 唯一入口类，包含配置管理、事件管理、HTTP请求管理、事件解析器
 *
 * @author Shawn Deng
 * @date 2020-11-20 17:54:21
 */
public class DingTalkServiceProvider {

    private static final Logger LOGGER = LoggerFactory.getLogger(DingTalkServiceProvider.class);

    public static final String EVENT_CALLBACK_TYPE_KEY = "EventType";

    public static final String EVENT_SYNC_ACTION_KEY = "syncAction";

    public static final String EVENT_SYNC_ACTION_CORP_ID_KEY = "corpId";

    public static final String EVENT_SYNC_ACTION_SUITE_ID_KEY = "suiteId";

    /**
     * 钉钉 配置
     */
    private DingtalkConfig dingtalkConfig;

    /**
     * 钉钉 API 接口实例
     */
    private DingTalkTemplate dingTalkTemplate;

    /**
     * 事件解析器，为监听器服务
     */
    private DingTalkEventParser eventParser = DingTalkEventParser.create();

    /**
     * 事件监听管理器
     */
    private DingTalkEventListenerManager eventListenerManager = new DingTalkEventListenerManager();

    public DingTalkServiceProvider(DingtalkConfig dingtalkConfig) {
        this.dingtalkConfig = dingtalkConfig;
        dingTalkTemplate = new DingTalkTemplate(dingtalkConfig);
    }

    public void setConfigStorage(ConfigStorage configStorage) {
        dingTalkTemplate.setConfigStorage(configStorage);
    }

    public void setSuiteTicketStorage(HashMap<String, AppTicketStorage> suiteTicketStorage) {
        dingTalkTemplate.setSuiteTicketStorage(suiteTicketStorage);
    }

    public DingtalkConfig getDingtalkConfig() {
        return dingtalkConfig;
    }

    public DingTalkEventListenerManager getEventListenerManager() {
        return eventListenerManager;
    }

    public void init() {
        // 实例化完成后，设置完一些属性后，必须调用此方法初始化
        dingTalkTemplate.initAppApis();
    }

    public DingTalkTemplate getDingTalkTemplate() {
        return dingTalkTemplate;
    }

    /**
     * 事件订阅推送
     *
     * @param agentId app的agentID
     * @param msgSignature 消息体签名
     * @param nonce 随机字符串
     * @param encryptMsg 推送body数据里面的encrypt
     * @return 响应结果
     */
    public String eventNotify(String agentId, String msgSignature, String timeStamp, String nonce, String encryptMsg) {
        // 解析成JSON结构
        AgentApp agentApp = getDingTalkTemplate().getDingTalkConfig().getAgentAppStorage().getAgentApp(agentId);
        DingTalkCallbackCrypto callbackCrypto;
        String decryptMsg;
        try {
            callbackCrypto = new DingTalkCallbackCrypto(agentApp.getToken(), agentApp.getAesKey(), agentApp.getCustomKey());
            decryptMsg = callbackCrypto.getDecryptMsg(msgSignature, timeStamp, nonce, encryptMsg);
        }
        catch (DingTalkEncryptException e) {
            LOGGER.error("钉钉解析事件通知数据失败", e);
            return "";
        }
        // 反序列化回调事件json数据
        JSONObject eventJson = JSONUtil.parseObj(decryptMsg);
        String eventType = eventJson.getStr(EVENT_CALLBACK_TYPE_KEY);
        if (LOGGER.isDebugEnabled()) {
            LOGGER.debug("钉钉事件数据结构:{}", decryptMsg);
        }
        if (StrUtil.isBlank(eventType)) {
            LOGGER.error("钉钉事件类型[{}]为空内容", EVENT_CALLBACK_TYPE_KEY);
            return "";
        }
        DingTalkEventTag eventTag = DingTalkEventTag.toEnum(eventType);
        if (eventTag == null) {
            LOGGER.error("钉钉推送未知事件类型[{}]", eventType);
            return "";
        }
        LOGGER.info("钉钉推送事件类型[{}]", eventType);
        BaseEvent event = eventParser.parseEvent(eventTag, eventJson);
        if (event == null) {
            LOGGER.info("找不到对应事件监听器，是否未给此事件配置处理方法，默认不处理");
            return "";
        }
        // 判断当前agentId todo
        Object eventResult = eventListenerManager.fireEventCallback(agentId, event);
        if (eventResult == null) {
            return "";
        }
        try {
            Map<String, String> jsonMap = callbackCrypto.getEncryptedMap("success");
            return JSONUtil.toJsonStr(jsonMap);
        }
        catch (DingTalkEncryptException e) {
            LOGGER.error("钉钉加密返回消息失败", e);
            return "";
        }
    }

    /**
     * SyncHTTP方式的ISV钉钉事件订阅推送
     *
     * @param suiteId 套件ID
     * @param msgSignature 消息体签名
     * @param nonce 随机字符串
     * @param encryptMsg 推送body数据里面的encrypt
     * @return 响应结果
     */
    public String syncHttpEventNotifyForIsv(String suiteId, String msgSignature, String timeStamp, String nonce,
            String encryptMsg) {
        // todo lock
        // 解析成JSON结构
        DingTalkCallbackCrypto callbackCrypto;
        String decryptMsg;
        try {
            callbackCrypto = getIsvDingTalkCallbackCrypto(suiteId);
            decryptMsg = callbackCrypto.getDecryptMsg(msgSignature, timeStamp, nonce, encryptMsg);
        }
        catch (Exception e) {
            LOGGER.error("ISV钉钉解析事件通知数据失败", e);
            return "";
        }
        if (LOGGER.isInfoEnabled()) {
            LOGGER.debug("ISV钉钉事件String数据结构:{}", decryptMsg);
        }
        // 反序列化回调事件json数据
        JSONObject eventJson = JSONUtil.parseObj(decryptMsg);
        Object eventResult = handleIsvAppEventNotify(suiteId, eventJson, null, null);
        if (eventResult == null) {
            return "";
        }
        try {
            Map<String, String> jsonMap = callbackCrypto.getEncryptedMap(DING_TALK_CALLBACK_SUCCESS);
            return JSONUtil.toJsonStr(jsonMap);
        }
        catch (DingTalkEncryptException e) {
            LOGGER.error("钉钉加密返回消息失败", e);
            return "";
        }
    }

    /**
     * 解析并处理事件
     *
     * @param bizId 套件ID/或者对应类目的ID
     * @param eventJson 事件消息体
     * @param corpId 企业ID，可以为null
     * @return Object
     */
    public Object handleIsvAppEventNotify(String bizId, JSONObject eventJson, String corpId, String suiteId) {
        if (LOGGER.isDebugEnabled()) {
            LOGGER.debug("ISV钉钉事件JSON数据结构:[{}]", eventJson);
        }
        String eventType = eventJson.getStr(EVENT_CALLBACK_TYPE_KEY);
        if (StrUtil.isBlank(eventType)) {
            LOGGER.error("ISV钉钉事件类型为空内容");
            return DING_TALK_CALLBACK_SUCCESS;
        }
        DingTalkEventTag eventTag = DingTalkEventTag.toEnum(eventType);
        if (eventTag == null) {
            LOGGER.error("ISV钉钉推送未定义的事件类型[{}]", eventType);
            return DING_TALK_CALLBACK_SUCCESS;
        }
        BaseEvent event;
        String syncActionStr = eventJson.getStr(EVENT_SYNC_ACTION_KEY);
        if (syncActionStr != null) {
            LOGGER.info("ISV钉钉SyncHttp推送事件类型[{}]", syncActionStr);
            DingTalkSyncAction syncAction = DingTalkSyncAction.toEnum(syncActionStr);
            if (syncAction == null) {
                LOGGER.error("ISV钉钉SyncHttp推送未定义的事件类型[{}]", syncActionStr);
                return DING_TALK_CALLBACK_SUCCESS;
            }
            if (corpId != null) {
                eventJson.set(EVENT_SYNC_ACTION_CORP_ID_KEY, corpId);
            }
            if (suiteId != null) {
                eventJson.set(EVENT_SYNC_ACTION_SUITE_ID_KEY, suiteId);
            }
            event = eventParser.parseEvent(syncAction, eventJson);
        }
        else {
            LOGGER.info("ISV钉钉推送事件类型[{}]", eventType);
            event = eventParser.parseEvent(eventTag, eventJson);
        }
        if (event == null) {
            LOGGER.info("ISV找不到对应事件监听器，是否未给此事件配置处理方法，默认不处理");
            return DING_TALK_CALLBACK_SUCCESS;
        }
        // 判断当前agentId todo
        return eventListenerManager.fireEventCallback(bizId, event);
    }

    public DingTalkCallbackCrypto getIsvDingTalkCallbackCrypto(String suiteId) {
        IsvApp isvApp = getDingTalkTemplate().getDingTalkConfig().getIsvAppMap().get(suiteId);
        if (isvApp == null) {
            LOGGER.error("未配置ISV钉钉应用:{}", suiteId);
            return null;
        }
        try {
            return new DingTalkCallbackCrypto(isvApp.getToken(), isvApp.getAesKey(), isvApp.getSuiteKey());
        }
        catch (DingTalkEncryptException e) {
            LOGGER.error("ISV钉钉解析事件通知数据失败", e);
            return null;
        }
    }

}
