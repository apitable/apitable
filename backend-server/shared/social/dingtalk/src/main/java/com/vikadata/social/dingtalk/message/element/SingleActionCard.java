package com.vikadata.social.dingtalk.message.element;

import java.util.HashMap;
import java.util.Map;

import lombok.Getter;
import lombok.Setter;

import com.vikadata.social.dingtalk.message.Component;

@Getter
@Setter
public class SingleActionCard extends ActionCard implements Component {

    private String singleTitle;

    private String singleUrl;

    @Override
    public Object toObj() {
        Map<String, Object> map = new HashMap<>(4);
        map.put("title", getTitle());
        map.put("markdown", getMarkdown());
        map.put("single_title", singleTitle);
        map.put("single_url", singleUrl);
        return map;
    }
}
