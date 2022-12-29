package com.vikadata.social.feishu.card.objects;

import java.util.HashMap;
import java.util.Map;

import com.vikadata.social.feishu.card.CardComponent;

/**
 * Text
 */
public class Text implements CardComponent {

    private String content;

    private I18n i18n;

    private Mode m;

    private Integer lines;

    public Text() {
    }

    public Text(Mode m, String content) {
        this(m, content, 0);
    }

    public Text(Mode m, I18n i18n) {
        this(m, i18n, 0);
    }

    public Text(Mode m, String content, int lines) {
        this.m = m;
        this.content = content;
        this.lines = lines;
    }

    public Text(Mode m, String content, Integer lines) {
        this.m = m;
        this.content = content;
        this.lines = lines;
    }

    public Text(Mode m, I18n i18n, int lines) {
        this.m = m;
        this.i18n = i18n;
        this.lines = lines;
    }

    @Override
    public Object toObj() {
        Map<String, Object> r = new HashMap<>(2);
        r.put("tag", m.name().toLowerCase());
        if (content != null) {
            r.put("content", content);
        }
        if (i18n != null) {
            r.put("i18n", i18n.toObj());
        }
        if (lines != null) {
            r.put("lines", lines);
        }
        return r;
    }

    public enum Mode {

        /**
         * Plain Text
         */
        PLAIN_TEXT,

        /**
         * Markdown
         */
        LARK_MD
    }
}
