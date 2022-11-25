package com.vikadata.social.feishu.event.v3;

import java.util.HashMap;
import java.util.Map;

import com.vikadata.social.feishu.annotation.FeishuEvent;
import com.vikadata.social.feishu.event.contact.v3.BaseV3ContactEvent;
import com.vikadata.social.feishu.event.contact.v3.ContactDeptCreateEvent;
import com.vikadata.social.feishu.event.contact.v3.ContactDeptDeleteEvent;
import com.vikadata.social.feishu.event.contact.v3.ContactDeptUpdateEvent;
import com.vikadata.social.feishu.event.contact.v3.ContactScopeUpdateEvent;
import com.vikadata.social.feishu.event.contact.v3.ContactUserCreateEvent;
import com.vikadata.social.feishu.event.contact.v3.ContactUserDeleteEvent;
import com.vikadata.social.feishu.event.contact.v3.ContactUserUpdateEvent;

/**
 * New Contact Event Parser
 */
public class FeishuV3ContactEventParser {

    /**
     * FeishuEvent event name as key,
     * The parser corresponding to each event content, here are all Jackson library conversions
     */
    private static final Map<String, V3ContactEventParser> EVENT_PARSER_MAP;

    static {
        EVENT_PARSER_MAP = new HashMap<>(16);

        registerClassEventParser(ContactScopeUpdateEvent.class);

        registerClassEventParser(ContactUserCreateEvent.class);
        registerClassEventParser(ContactUserDeleteEvent.class);
        registerClassEventParser(ContactUserUpdateEvent.class);

        registerClassEventParser(ContactDeptCreateEvent.class);
        registerClassEventParser(ContactDeptDeleteEvent.class);
        registerClassEventParser(ContactDeptUpdateEvent.class);
    }

    public static FeishuV3ContactEventParser create() {
        return new FeishuV3ContactEventParser();
    }

    private static void registerClassEventParser(Class<? extends BaseV3ContactEvent> eventClass) {
        FeishuEvent annotation = eventClass.getAnnotation(FeishuEvent.class);
        registerEventParser(annotation, new Jackson2ClassV3EventParser(eventClass));
    }

    private static void registerEventParser(FeishuEvent eventAnnotation, V3ContactEventParser eventParser) {
        if (eventAnnotation != null) {
            EVENT_PARSER_MAP.put(eventAnnotation.value(), eventParser);
        }
    }

    public BaseV3ContactEvent parseEvent(String type, Map<String, Object> data) {
        V3ContactEventParser parser = EVENT_PARSER_MAP.get(type);
        if (parser == null) {
            return null;
        }
        return parser.parse(data);
    }
}
