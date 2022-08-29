package com.vikadata.social.feishu.card.module;

import cn.hutool.core.map.MapUtil;
import com.vikadata.social.feishu.card.element.Element;
import com.vikadata.social.feishu.card.objects.Field;
import com.vikadata.social.feishu.card.objects.Text;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * <p>
 * 内容模块
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/11/24 16:22
 */
public class Div extends Module {

    private Text text;

    private List<Field> fields;

    private Element extra;

    public Div() {
    }

    public Div(Text text) {
        super("div");
        this.text = text;
    }

    public Div(Text text, List<Field> fields, Element extra) {
        super("div");
        this.text = text;
        this.fields = fields;
        this.extra = extra;
    }

    @Override
    public Object toObj() {
        Map<String, Object> r = MapUtil.of("tag", getTag());

        if (text != null) {
            r.put("text", text.toObj());
        }

        if (fields != null) {
            r.put("fields", fields.stream().map(Field::toObj).collect(Collectors.toList()));
        }

        if (extra != null) {
            r.put("extra", extra.toObj());
        }
        return r;
    }
}
