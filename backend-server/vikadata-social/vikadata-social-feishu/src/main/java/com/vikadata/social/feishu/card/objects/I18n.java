package com.vikadata.social.feishu.card.objects;

import com.vikadata.social.feishu.card.CardComponent;

import java.util.HashMap;
import java.util.Map;

/**
 * <p>
 * 卡片标题-国际化
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/11/24 12:57
 */
public class I18n implements CardComponent {

    private String zhCn;

    private String enUs;

    private String jaJp;

    public I18n() {
    }

    public I18n(String zhCn, String enUs, String jaJp) {
        this.zhCn = zhCn;
        this.enUs = enUs;
        this.jaJp = jaJp;
    }

    @Override
    public Object toObj() {
        Map<String, String> map = new HashMap<>(3);
        map.put("zh_cn", zhCn);
        map.put("en_us", enUs);
        map.put("ja_jp", jaJp);
        return map;
    }
}
