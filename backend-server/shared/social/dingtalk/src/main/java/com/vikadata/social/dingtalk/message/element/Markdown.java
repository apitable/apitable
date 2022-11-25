package com.vikadata.social.dingtalk.message.element;

import java.util.HashMap;
import java.util.Map;

import lombok.Getter;
import lombok.Setter;

import com.vikadata.social.dingtalk.message.AbstractElement;
import com.vikadata.social.dingtalk.message.Component;

@Getter
@Setter
public class Markdown extends AbstractElement implements Component {
    /**
     * Display content from the above-the-fold session
     */
    private String title;

    /**
     * Message description, within 500 characters is recommended.
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
