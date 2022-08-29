package com.vikadata.social.dingtalk.event;

import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;

import com.vikadata.social.dingtalk.annotation.DingTalkEvent;
import com.vikadata.social.dingtalk.enums.DingTalkEventTag;
import com.vikadata.social.dingtalk.enums.DingTalkSyncAction;
import com.vikadata.social.dingtalk.event.contact.OrgAdminAddEvent;
import com.vikadata.social.dingtalk.event.contact.OrgAdminRemoveEvent;
import com.vikadata.social.dingtalk.event.contact.OrgDeptCreateEvent;
import com.vikadata.social.dingtalk.event.contact.OrgDeptModifyEvent;
import com.vikadata.social.dingtalk.event.contact.OrgDeptRemoveEvent;
import com.vikadata.social.dingtalk.event.contact.UserActiveOrgEvent;
import com.vikadata.social.dingtalk.event.contact.UserAddOrgEvent;
import com.vikadata.social.dingtalk.event.contact.UserLeaveOrgEvent;
import com.vikadata.social.dingtalk.event.contact.UserModifyOrgEvent;
import com.vikadata.social.dingtalk.event.order.SyncHttpMarketOrderEvent;
import com.vikadata.social.dingtalk.event.order.SyncHttpMarketServiceCloseEvent;
import com.vikadata.social.dingtalk.event.sync.http.OrgMicroAppRemoveEvent;
import com.vikadata.social.dingtalk.event.sync.http.OrgMicroAppRestoreEvent;
import com.vikadata.social.dingtalk.event.sync.http.OrgMicroAppScopeUpdateEvent;
import com.vikadata.social.dingtalk.event.sync.http.OrgMicroAppStopEvent;
import com.vikadata.social.dingtalk.event.sync.http.OrgRemoveEvent;
import com.vikadata.social.dingtalk.event.sync.http.OrgSuiteAuthEvent;
import com.vikadata.social.dingtalk.event.sync.http.OrgSuiteChangeEvent;
import com.vikadata.social.dingtalk.event.sync.http.OrgSuiteRelieveEvent;
import com.vikadata.social.dingtalk.event.sync.http.OrgUpdateEvent;
import com.vikadata.social.dingtalk.event.sync.http.SuiteTicketEvent;
import com.vikadata.social.dingtalk.event.sync.http.contact.SyncHttpUserActiveOrgEvent;
import com.vikadata.social.dingtalk.event.sync.http.contact.SyncHttpUserAddOrgEvent;
import com.vikadata.social.dingtalk.event.sync.http.contact.SyncHttpUserLeaveOrgEvent;
import com.vikadata.social.dingtalk.event.sync.http.contact.SyncHttpUserModifyOrgEvent;
import com.vikadata.social.dingtalk.event.sync.http.contact.SyncHttpUserRoleChangeEvent;

/**
 * <p>
 * 事件解析器
 * </p>
 * @author zoe zheng
 * @date 2021/5/13 1:56 下午
 */
public class DingTalkEventParser {

    /**
     * DingTalkEvent 事件名称作为key，
     * 每个事件内容对应的解析器，这里是全部都是Jackson库转换
     */
    private static final Map<String, EventParser> EVENT_PARSER_MAP;

    public static final String SYNC_HTTP_ACTION = "sync_http_";

    static {
        EVENT_PARSER_MAP = new HashMap<>(16);

        // 通讯录事件
        registerClassEventParser(UserAddOrgEvent.class);
        registerClassEventParser(UserModifyOrgEvent.class);
        registerClassEventParser(UserLeaveOrgEvent.class);
        registerClassEventParser(UserActiveOrgEvent.class);

        registerClassEventParser(OrgAdminAddEvent.class);
        registerClassEventParser(OrgAdminRemoveEvent.class);

        registerClassEventParser(OrgDeptCreateEvent.class);
        registerClassEventParser(OrgDeptModifyEvent.class);
        registerClassEventParser(OrgDeptRemoveEvent.class);

        // 注册回调url事件
        registerClassEventParser(CheckUrlEvent.class);
        registerClassEventParser(CheckCreateSuiteUrlEvent.class);
        registerClassEventParser(CheckUpdateSuiteUrlEvent.class);

        // 注册syncHttp推送的事件
        registerClassEventParser(SyncHttpPushHighEvent.class);
        registerClassEventParser(SyncHttpPushMediumEvent.class);

        // 注册syncHttpAction事件
        registerClassEventParser(SuiteTicketEvent.class);
        registerClassEventParser(OrgSuiteAuthEvent.class);
        registerClassEventParser(OrgSuiteChangeEvent.class);
        registerClassEventParser(OrgSuiteRelieveEvent.class);
        registerClassEventParser(OrgMicroAppRestoreEvent.class);
        registerClassEventParser(OrgMicroAppStopEvent.class);
        registerClassEventParser(OrgMicroAppRemoveEvent.class);
        registerClassEventParser(OrgMicroAppScopeUpdateEvent.class);
        registerClassEventParser(OrgUpdateEvent.class);
        registerClassEventParser(OrgRemoveEvent.class);
        // syncHttp 通讯录
        registerClassEventParser(SyncHttpUserAddOrgEvent.class);
        registerClassEventParser(SyncHttpUserActiveOrgEvent.class);
        registerClassEventParser(SyncHttpUserLeaveOrgEvent.class);
        registerClassEventParser(SyncHttpUserModifyOrgEvent.class);
        registerClassEventParser(SyncHttpUserRoleChangeEvent.class);
        // syncHttp 订单信息
        registerClassEventParser(SyncHttpMarketOrderEvent.class, PropertyNamingStrategies.LOWER_CAMEL_CASE);
        registerClassEventParser(SyncHttpMarketServiceCloseEvent.class, PropertyNamingStrategies.LOWER_CAMEL_CASE);
    }

    public static DingTalkEventParser create() {
        return new DingTalkEventParser();
    }

    private static void registerClassEventParser(Class<? extends BaseEvent> eventClass) {
        DingTalkEvent annotation = eventClass.getAnnotation(DingTalkEvent.class);
        registerEventParser(annotation, new Jackson2ClassEventParser(eventClass));
    }

    private static void registerClassEventParser(Class<? extends BaseEvent> eventClass, PropertyNamingStrategy strategy) {
        DingTalkEvent annotation = eventClass.getAnnotation(DingTalkEvent.class);
        registerEventParser(annotation, new Jackson2ClassEventParser(eventClass, strategy));
    }

    private static void registerEventParser(DingTalkEvent eventAnnotation, EventParser eventParser) {
        if (eventAnnotation != null) {
            String action = eventAnnotation.action().getValue();
            if (DingTalkSyncAction.DEFAULT.getValue().equals(action)) {
                EVENT_PARSER_MAP.put(eventAnnotation.value().getValue(), eventParser);
            }
            else {
                EVENT_PARSER_MAP.put(SYNC_HTTP_ACTION + action, eventParser);
            }
        }
    }

    public BaseEvent parseEvent(DingTalkEventTag type, Map<String, Object> data) {
        EventParser parser = EVENT_PARSER_MAP.get(type.getValue());
        if (parser == null) {
            return null;
        }
        return parser.parse(data);
    }

    public BaseEvent parseEvent(DingTalkSyncAction type, Map<String, Object> data) {
        EventParser parser = EVENT_PARSER_MAP.get(SYNC_HTTP_ACTION + type.getValue());
        if (parser == null) {
            return null;
        }
        return parser.parse(data);
    }
}
