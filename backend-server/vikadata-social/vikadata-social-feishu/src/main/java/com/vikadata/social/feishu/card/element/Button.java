package com.vikadata.social.feishu.card.element;

import cn.hutool.core.map.MapUtil;
import com.vikadata.social.feishu.card.objects.Confirm;
import com.vikadata.social.feishu.card.objects.Text;
import com.vikadata.social.feishu.card.objects.Url;

import java.util.Map;

/**
 * <p>
 * 按钮元素
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/11/24 14:20
 */
public class Button extends ActionElement {

    /**
     * 按钮样式
     */
    public enum StyleType {
        /**
         * 默认样式
         */
        DEFAULT,

        /**
         * primary 样式
         */
        PRIMARY,

        /**
         * danger 样式
         */
        DANGER
    }

    private Text text;

    private String url;

    private Url multiUrl;

    private StyleType type = StyleType.DEFAULT;

    private Confirm confirm;

    public Button() {
    }

    public Button(Text text) {
        super("button");
        this.text = text;
    }

    public Button(String methodName, Text text) {
        super("button", methodName);
        this.text = text;
    }

    public Button setType(StyleType s) {
        this.type = s;
        return this;
    }

    public Button setConfirm(Confirm c) {
        this.confirm = c;
        return this;
    }

    public Button setValue(Map<String, String> v) {
        super.addActionValues(v);
        return this;
    }

    public Button setUrl(String url) {
        this.url = url;
        this.multiUrl = null;
        return this;
    }

    public Button setMultiUrl(Url url) {
        this.multiUrl = url;
        this.url = null;
        return this;
    }

    @Override
    public Object toObj() {
        Map<String, Object> map = MapUtil.of("tag", getTag());

        if (text != null) {
            map.put("text", text.toObj());
        }

        if (url != null) {
            map.put("url", url);
        }

        if (multiUrl != null) {
            map.put("multi_url", multiUrl.toObj());
        }

        if (type != null) {
            map.put("type", type.name().toLowerCase());
        }

        map.put("value", getValue());

        if (confirm != null) {
            map.put("confirm", confirm.toObj());
        }

        return map;
    }
}
