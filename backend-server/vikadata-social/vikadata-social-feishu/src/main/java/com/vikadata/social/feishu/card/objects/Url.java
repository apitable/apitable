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
 * @date 2020/11/24 13:17
 */
public class Url implements CardComponent {

    private String url;

    private String androidUrl;

    private String iosUrl;

    private String pcUrl;

    public Url() {
    }

    public Url(String url) {
        this.url = url;
    }

    public Url(String androidUrl, String iosUrl, String pcUrl) {
        this.androidUrl = androidUrl;
        this.iosUrl = iosUrl;
        this.pcUrl = pcUrl;
    }

    @Override
    public Object toObj() {
        Map<String, String> map = new HashMap<>(4);
        map.put("url", url);
        map.put("android_url", androidUrl);
        map.put("ios_url", iosUrl);
        map.put("pc_url", pcUrl);
        return map;

    }
}
