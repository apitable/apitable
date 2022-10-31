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

/**
 * The only entry class of Dingtalk, including configuration management, event management, HTTP request management, event
 * parser
 */
public class DingTalkServiceProvider {

    private static final Logger LOGGER = LoggerFactory.getLogger(DingTalkServiceProvider.class);

    public static final String EVENT_CALLBACK_TYPE_KEY = "EventType";

    public static final String EVENT_SYNC_ACTION_KEY = "syncAction";

    public static final String EVENT_SYNC_ACTION_CORP_ID_KEY = "corpId";

    public static final String EVENT_SYNC_ACTION_SUITE_ID_KEY = "suiteId";

    /**
     * DingTalk configuration
     */
    private DingtalkConfig dingtalkConfig;

    /**
     * DingTalk API interface instance
     */
    private DingTalkTemplate dingTalkTemplate;

    /**
     * Event parser, serving listeners
     */
    private DingTalkEventParser eventParser = DingTalkEventParser.create();

    /**
     * event listener manager
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
        // After the instantiation is complete, after setting some properties, you must call this method to initialize
        dingTalkTemplate.initAppApis();
    }

    public DingTalkTemplate getDingTalkTemplate() {
        return dingTalkTemplate;
    }

    /**
     * event subscription push
     *
     * @param agentId The agent ID of the app
     * @param msgSignature message body signature
     * @param nonce random string
     * @param encryptMsg Push the encrypt in the body data
     * @return String
     */
    public String eventNotify(String agentId, String msgSignature, String timeStamp, String nonce, String encryptMsg) {
        // Parse into JSON structure
        AgentApp agentApp = getDingTalkTemplate().getDingTalkConfig().getAgentAppStorage().getAgentApp(agentId);
        DingTalkCallbackCrypto callbackCrypto;
        String decryptMsg;
        try {
            callbackCrypto = new DingTalkCallbackCrypto(agentApp.getToken(), agentApp.getAesKey(), agentApp.getCustomKey());
            decryptMsg = callbackCrypto.getDecryptMsg(msgSignature, timeStamp, nonce, encryptMsg);
        }
        catch (DingTalkEncryptException e) {
            LOGGER.error("DingTalk failed to parse event data", e);
            return "";
        }
        // Deserialize callback event json data
        JSONObject eventJson = JSONUtil.parseObj(decryptMsg);
        String eventType = eventJson.getStr(EVENT_CALLBACK_TYPE_KEY);
        if (LOGGER.isDebugEnabled()) {
            LOGGER.debug("DingTalk event data:{}", decryptMsg);
        }
        if (StrUtil.isBlank(eventType)) {
            LOGGER.error("DingTalk eventType[{}] is empty", EVENT_CALLBACK_TYPE_KEY);
            return "";
        }
        DingTalkEventTag eventTag = DingTalkEventTag.toEnum(eventType);
        if (eventTag == null) {
            LOGGER.error("DingTalk push unknown eventType[{}]", eventType);
            return "";
        }
        LOGGER.info("DingTalk push eventType[{}]", eventType);
        BaseEvent event = eventParser.parseEvent(eventTag, eventJson);
        if (event == null) {
            LOGGER.info("Cannot find DingTalk event listener, Whether a handler is not configured for this event, not handle by default");
            return "";
        }
        // Determine the current agent Id
        Object eventResult = eventListenerManager.fireEventCallback(agentId, event);
        if (eventResult == null) {
            return "";
        }
        try {
            Map<String, String> jsonMap = callbackCrypto.getEncryptedMap("success");
            return JSONUtil.toJsonStr(jsonMap);
        }
        catch (DingTalkEncryptException e) {
            LOGGER.error("DingTalk encryption return message failed", e);
            return "";
        }
    }

    /**
     * SyncHTTP ISV DingTalk event subscription push method
     *
     * @param suiteId suite Id
     * @param msgSignature message body signature
     * @param nonce random string
     * @param encryptMsg Push the encrypt in the body data
     * @return response result
     */
    public String syncHttpEventNotifyForIsv(String suiteId, String msgSignature, String timeStamp, String nonce,
            String encryptMsg) {
        // Parse into JSON structure
        DingTalkCallbackCrypto callbackCrypto;
        String decryptMsg;
        try {
            callbackCrypto = getIsvDingTalkCallbackCrypto(suiteId);
            decryptMsg = callbackCrypto.getDecryptMsg(msgSignature, timeStamp, nonce, encryptMsg);
        }
        catch (Exception e) {
            LOGGER.error("DingTalk isv parse event error", e);
            return "";
        }
        if (LOGGER.isInfoEnabled()) {
            LOGGER.debug("DingTalk isv event encrypt data:{}", decryptMsg);
        }
        // Deserialize callback event json data
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
            LOGGER.error("DingTalk isv encryption return message failed", e);
            return "";
        }
    }

    /**
     * Parse and handle events
     *
     * @param bizId suite ID/ biz id
     * @param eventJson event message body
     * @param corpId corp id, can be null
     * @return Object
     */
    public Object handleIsvAppEventNotify(String bizId, JSONObject eventJson, String corpId, String suiteId) {
        if (LOGGER.isDebugEnabled()) {
            LOGGER.debug("DingTalk isv event data:[{}]", eventJson);
        }
        String eventType = eventJson.getStr(EVENT_CALLBACK_TYPE_KEY);
        if (StrUtil.isBlank(eventType)) {
            LOGGER.error("DingTalk isv eventType is blank");
            return DING_TALK_CALLBACK_SUCCESS;
        }
        DingTalkEventTag eventTag = DingTalkEventTag.toEnum(eventType);
        if (eventTag == null) {
            LOGGER.error("DingTalk isv eventType unknown[{}]", eventType);
            return DING_TALK_CALLBACK_SUCCESS;
        }
        BaseEvent event;
        String syncActionStr = eventJson.getStr(EVENT_SYNC_ACTION_KEY);
        if (syncActionStr != null) {
            LOGGER.info("DingTalk isv syncHttp eventType[{}]", syncActionStr);
            DingTalkSyncAction syncAction = DingTalkSyncAction.toEnum(syncActionStr);
            if (syncAction == null) {
                LOGGER.error("DingTalk isv syncHttp eventType unknown[{}]", syncActionStr);
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
            LOGGER.info("DingTalk isv eventType[{}]", eventType);
            event = eventParser.parseEvent(eventTag, eventJson);
        }
        if (event == null) {
            LOGGER.info("Cannot find DingTalk isv event listener, Whether a handler is not configured for this event, not handle by default");
            return DING_TALK_CALLBACK_SUCCESS;
        }
        return eventListenerManager.fireEventCallback(bizId, event);
    }

    public DingTalkCallbackCrypto getIsvDingTalkCallbackCrypto(String suiteId) {
        IsvApp isvApp = getDingTalkTemplate().getDingTalkConfig().getIsvAppMap().get(suiteId);
        if (isvApp == null) {
            LOGGER.error("DingTalk isv app not configured:{}", suiteId);
            return null;
        }
        try {
            return new DingTalkCallbackCrypto(isvApp.getToken(), isvApp.getAesKey(), isvApp.getSuiteKey());
        }
        catch (DingTalkEncryptException e) {
            LOGGER.error("DingTalk decrypt data error", e);
            return null;
        }
    }

}
