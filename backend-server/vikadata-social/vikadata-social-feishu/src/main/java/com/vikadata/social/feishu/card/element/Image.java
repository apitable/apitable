package com.vikadata.social.feishu.card.element;

import com.vikadata.social.feishu.card.objects.Text;

import java.util.HashMap;
import java.util.Map;

/**
 * <p>
 * 图片元素
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/11/24 14:17
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
