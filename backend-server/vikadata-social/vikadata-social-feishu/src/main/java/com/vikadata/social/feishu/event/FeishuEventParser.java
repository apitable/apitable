package com.vikadata.social.feishu.event;

import java.util.HashMap;
import java.util.Map;

import com.vikadata.social.feishu.annotation.FeishuEvent;
import com.vikadata.social.feishu.event.app.AppOpenEvent;
import com.vikadata.social.feishu.event.app.AppStatusChangeEvent;
import com.vikadata.social.feishu.event.app.AppTicketEvent;
import com.vikadata.social.feishu.event.app.AppUninstalledEvent;
import com.vikadata.social.feishu.event.app.OrderPaidEvent;
import com.vikadata.social.feishu.event.bot.AddBotEvent;
import com.vikadata.social.feishu.event.bot.BaseMessageEvent;
import com.vikadata.social.feishu.event.bot.FileMessageEvent;
import com.vikadata.social.feishu.event.bot.ImageMessageEvent;
import com.vikadata.social.feishu.event.bot.MergeForwardMessageEvent;
import com.vikadata.social.feishu.event.bot.P2pChatCreateEvent;
import com.vikadata.social.feishu.event.bot.PostMessageEvent;
import com.vikadata.social.feishu.event.bot.TextMessageEvent;

/**
 * 事件解析器
 *
 * @author Shawn Deng
 * @date 2020-11-24 18:03:36
 */
public class FeishuEventParser {

    /**
     * FeishuEvent 事件名称作为key，
     * 每个事件内容对应的解析器，这里是全部都是Jackson库转换
     */
    private static final Map<String, EventParser> EVENT_PARSER_MAP;

    static {
        EVENT_PARSER_MAP = new HashMap<>(16);
        // 应用事件
        registerClassEventParser(AppTicketEvent.class);
        registerClassEventParser(AppOpenEvent.class);
        registerClassEventParser(AppStatusChangeEvent.class);
        registerClassEventParser(AppUninstalledEvent.class);
        registerClassEventParser(OrderPaidEvent.class);

        registerClassEventParser(P2pChatCreateEvent.class);
        registerClassEventParser(AddBotEvent.class);
        BotMessageEventParser parser = new BotMessageEventParser();
        parser.registerTypes(
                TextMessageEvent.class,
                PostMessageEvent.class,
                ImageMessageEvent.class,
                MergeForwardMessageEvent.class,
                FileMessageEvent.class
        );
        registerEventParser(BaseMessageEvent.class.getAnnotation(FeishuEvent.class), parser);
    }

    public static FeishuEventParser create() {
        return new FeishuEventParser();
    }

    private static void registerClassEventParser(Class<? extends BaseEvent> eventClass) {
        FeishuEvent annotation = eventClass.getAnnotation(FeishuEvent.class);
        registerEventParser(annotation, new Jackson2ClassEventParser(eventClass));
    }

    private static void registerEventParser(FeishuEvent eventAnnotation, EventParser eventParser) {
        if (eventAnnotation != null) {
            EVENT_PARSER_MAP.put(eventAnnotation.value(), eventParser);
        }
    }

    public BaseEvent parseEvent(String type, Map<String, Object> data) {
        EventParser parser = EVENT_PARSER_MAP.get(type);
        if (parser == null) {
            return null;
        }
        return parser.parse(data);
    }
}
