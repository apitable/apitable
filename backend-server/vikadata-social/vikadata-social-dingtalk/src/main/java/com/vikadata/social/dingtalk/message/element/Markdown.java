package com.vikadata.social.dingtalk.message.element;

import java.util.HashMap;
import java.util.Map;

import lombok.Getter;
import lombok.Setter;

import com.vikadata.social.dingtalk.message.AbstractElement;
import com.vikadata.social.dingtalk.message.Component;

/**
 * <p>
 * 链接消息
 * </p>
 * @author zoe zheng
 * @date 2021/4/21 3:42 下午
 */
@Getter
@Setter
public class Markdown extends AbstractElement implements Component {
    /**
     * 首屏会话透出的展示内容
     */
    private String title;

    /**
     * 消息描述，建议500字符以内。
     */
    private String text;

    @Override
    public Object toObj() {
        Map<String, String> map = new HashMap<>(4);
        map.put("title", getTitle());
        map.put("text", text);
        return map;
    }
}
