package com.vikadata.social.feishu.card.module;

import com.vikadata.social.feishu.card.objects.Text;

import java.util.HashMap;
import java.util.Map;

/**
 * <p>
 * 图片模块
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/11/24 16:23
 */
public class Img extends Module {

    private String imgKey;

    private Text alt;

    private Text title;

    public Img() {
    }

    public Img(String imgKey, Text alt, Text title) {
        super("img");
        this.imgKey = imgKey;
        this.alt = alt;
        this.title = title;
    }

    @Override
    public Object toObj() {
        Map<String, Object> map = new HashMap<>(16);
        map.put("tag", getTag());
        map.put("alt", alt.toObj());
        map.put("img_key", imgKey);

        if (title != null) {
            map.put("title", title.toObj());
        }

        return map;
    }
}
