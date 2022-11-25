package com.vikadata.social.feishu.card.objects;

import com.vikadata.social.feishu.card.CardComponent;

import java.util.HashMap;
import java.util.Map;

/**
 * <p>
 *
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/11/24 12:55
 */
public class Confirm implements CardComponent {

    private Text title;

    private Text text;

    public Confirm() {
    }

    public Confirm(Text title, Text text) {
        this.title = title;
        this.text = text;
    }

    @Override
    public Object toObj() {
        Map<String, Object> map = new HashMap<>(2);
        map.put("title", title.toObj());
        map.put("text", text.toObj());
        return map;
    }
}
