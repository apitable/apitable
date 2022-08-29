package com.vikadata.social.feishu.card;

import cn.hutool.core.map.MapUtil;
import com.vikadata.social.feishu.card.objects.Text;

import java.util.Map;

/**
 * <p>
 * 消息卡片标题
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/11/24 12:52
 */
public class Header implements CardComponent {

    private Text title;

    private TemplateColor templateColor;

    public Header() {
    }

    public Header(Text title) {
        this.title = title;
    }

    public Header(Text text, TemplateColor templateColor) {
        this.title = text;
        this.templateColor = templateColor;
    }

    @Override
    public Object toObj() {
        Map<String, Object> headerMap = MapUtil.of("title", this.title.toObj());
        if (this.templateColor != null) {
            headerMap.put("template", templateColor.getColor());
        }
        return headerMap;
    }
}
