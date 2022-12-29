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
 * Feishu Services
 * The only entry class, including configuration management, event management, HTTP request management, event parser
 */
public class FeishuServiceProvider {

    private static final Logger LOGGER = LoggerFactory.getLogger(FeishuServiceProvider.class);

    public static final String URL_VERIFICATION_EVENT = "url_verification";

    public static final String EVENT_CALLBACK_EVENT = "event_callback";

    /**
     * Feishu API interface template
     */
    private final FeishuTemplate feishuTemplate;

    /**
     * Event parser serving for listeners
     */
    private final FeishuEventParser eventParser = FeishuEventParser.create();

    /**
     * New contact event parser
     */
    private final FeishuV3ContactEventParser v3ContactEventParser = FeishuV3ContactEventParser.create();

    /**
     * Event listener manager
     */
    private final FeishuEventListenerManager eventListenerManager = new FeishuEventListenerManager();

    /**
     * Delayed task thread pool
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
     * Event subscription push
     * @param jsonString push data
     * @return response result
     */
    public String eventNotify(String jsonString) {
        // Parse into JSON structure
        Map<String, Object> notifyData = decryptIfNeed(jsonString);
        if (LOGGER.isDebugEnabled()) {
            LOGGER.debug("event data structure:{}", JSONUtil.toJsonPrettyStr(notifyData));
        }
        Object type = notifyData.get("type");
        if (type == null) {
            Object schema = notifyData.get("schema");
            if (schema == null) {
                LOGGER.error("unable to parse event type");
                return "";
            }
            LOGGER.info("received a new contact change event");
            // Handling the new contact change event
            // headers
            Map<String, Object> headerMap = MapUtil.get(notifyData, "header", new cn.hutool.core.lang.TypeReference<Map<String, Object>>() {});
            checkToken(headerMap);
            // Get the type of the new contact event
            String contactType = (String) headerMap.get("event_type");
            BaseV3ContactEvent event = v3ContactEventParser.parseEvent(contactType, notifyData);
            if (event == null) {
                LOGGER.info("could not find new contact event handler, whether a handler is not configured for this "
                        + "event, not processed by default");
                return "";
            }
            if (!getFeishuTemplate().getConfigStorage().getAppId().equals(event.getHeader().getAppId())) {
                // APP ID Inconsistency is also wrong and may mess with app notifications
                throw new IllegalStateException("illegal application, wrong callback url");
            }
            Object eventResult = eventListenerManager.fireV3ContactEventCallback(event);
            if (eventResult == null) {
                return "";
            }
            return JSONUtil.toJsonStr(eventResult);
        }
        String eventType = (String) type;
        if (StrUtil.isBlank(eventType)) {
            LOGGER.error("Event[type] is empty");
            return "";
        }
        LOGGER.info("Event Type：{}", eventType);
        if (eventType.equals(URL_VERIFICATION_EVENT)) {
            // Verify callback address
            return challenge(notifyData);
        }
        else if (eventType.equals(EVENT_CALLBACK_EVENT)) {
            // check event
            checkToken(notifyData);
            // event content
            Map<String, Object> eventData = MapUtil.get(notifyData, "event", new cn.hutool.core.lang.TypeReference<Map<String, Object>>() {});
            if (eventData == null) {
                LOGGER.error("Event content cannot be empty");
                return "";
            }
            String eventSubType = eventData.get("type").toString();
            LOGGER.info("Event Name：{}", eventSubType);
            BaseEvent event = eventParser.parseEvent(eventSubType, eventData);
            if (event == null) {
                LOGGER.info("could not find event handler, whether a handler is not configured for this event, not processed by default");
                return "";
            }
            if (!getFeishuTemplate().getConfigStorage().getAppId().equals(event.getAppId())) {
                // APP ID Inconsistency is also wrong and may mess with app notifications
                throw new IllegalStateException("illegal application, wrong callback url");
            }
            // event routing
            BaseEvent.Meta meta = new BaseEvent.Meta();
            String uuid = (String) notifyData.get("uuid");
            meta.setUuid(uuid);
            String ts = (String) notifyData.get("ts");
            meta.setTs(ts);
            LOGGER.info("Event ID：{}, push time: {}", uuid, ts);
            event.setMeta(meta);
            if (LOGGER.isDebugEnabled()) {
                LOGGER.debug("Event data：{}", JSONUtil.toJsonStr(eventData));
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
     * message card event subscription push
     * @param jsonData push data
     * @return response data
     */
    public String cardNotify(String jsonData) {
        System.out.println(jsonData);
        return null;
    }

    /**
     * If the key is configured, the decrypted data will be parsed into JSON, otherwise the original data will be parsed
     * @param jsonString encrypted data
     * @return JSONObject JSON structure
     */
    public Map<String, Object> decryptIfNeed(String jsonString) {
        Map<String, Object> json;
        try {
            json = Jackson4FeishuConverter.toObject(jsonString, new TypeReference<Map<String, Object>>() {});
        }
        catch (IOException e) {
            throw new RuntimeException("Feishu decrypt data error: " + jsonString, e);
        }
        FeishuConfigStorage configStorage = getFeishuTemplate().getConfigStorage();
        if (!configStorage.needDecrypt()) {
            return json;
        }
        Object encryptData = json.get("encrypt");
        if (encryptData == null) {
            throw new RuntimeException("Feishu Data not encrypted");
        }

        String decryptJson;
        try {
            decryptJson = configStorage.decrypt(encryptData.toString());
        }
        catch (Exception e) {
            throw new IllegalStateException("Feishu decrypt json data error");
        }
        try {
            return Jackson4FeishuConverter.toObject(decryptJson, new TypeReference<Map<String, Object>>() {});
        }
        catch (IOException e) {
            throw new RuntimeException("Feishu parse data error", e);
        }
    }

    /**
     * Verify the response result of the URL
     *
     * @param notifyData notification data
     * @return Response JSON string
     */
    public String challenge(Map<String, Object> notifyData) {
        checkToken(notifyData);
        FeishuConfigStorage configStorage = getFeishuTemplate().getConfigStorage();
        if (configStorage != null && configStorage.isv()) {
            // When the store app verifies the callback URL for the first time, it actively resends the ticket event
            LOGGER.info("Feishu current is isv APP, Event register done, actively trigger re-send ticket after 1 s");
            delayExecutor.schedule(() ->
                    getFeishuTemplate().resendAppTicket(
                            configStorage.getAppId(), configStorage.getAppSecret()), 1, TimeUnit.SECONDS);
        }
        return JSONUtil.createObj().set("challenge", notifyData.get("challenge")).toString();
    }

    public void checkToken(Map<String, Object> json) {
        String token = json.get("token").toString();
        if (!getFeishuTemplate().getConfigStorage().checkVerificationToken(token)) {
            LOGGER.error("Verify token fail, illegal token: {}", token);
            throw new IllegalStateException("Encountered an illegal event attack, perhaps not configured correctly");
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
