package com.vikadata.social.feishu.card.element;

import java.util.HashMap;
import java.util.Map;

import com.vikadata.social.feishu.card.objects.Text;

/**
 * picture element
 */
public class Image extends Element {

    private String imgKey;

    private Text alt;

    public Image() {
    }

    public Image(String imgKey, Text alt) {
        super("img");
        this.imgKey = imgKey;
        this.alt = alt;
    }

    @Override
    public Object toObj() {
        Map<String, Object> map = new HashMap<>(3);
        map.put("tag", getTag());
        map.put("img_key", imgKey);
        map.put("alt", alt.toObj());
        return map;
    }
}
