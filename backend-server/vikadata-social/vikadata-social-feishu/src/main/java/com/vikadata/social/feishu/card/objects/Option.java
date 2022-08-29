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
 * @date 2020/11/24 13:16
 */
public class Option implements CardComponent {

    private String value;

    private Text text;

    private String url;

    private Url multiUrl;

    public Option() {
    }

    public Option(String value, Text text, String url) {
        this(value, text);
        this.url = url;
    }

    public Option(String value, Text text, Url multiUrl) {
        this(value, text);
        this.multiUrl = multiUrl;
    }

    public Option(String value, Text text) {
        this.value = value;
        this.text = text;
    }

    @Override
    public Object toObj() {

        Map<String, Object> m = new HashMap<>(16);
        m.put("text", text.toObj());
        m.put("url", url);
        m.put("value", value);

        if (multiUrl != null) {
            m.put("multi_url", multiUrl.toObj());
        }

        if (text != null) {
            m.put("text", text.toObj());
        }

        return m;
    }
}
