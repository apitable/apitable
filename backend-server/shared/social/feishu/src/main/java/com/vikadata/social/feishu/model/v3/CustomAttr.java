package com.vikadata.social.feishu.model.v3;

import lombok.Getter;
import lombok.Setter;

/**
 * custom properties
 */
@Setter
@Getter
public class CustomAttr {

    private String type;

    private String id;

    private Value value;

    @Setter
    @Getter
    public static class Value {

        private String text;

        private String url;

        private String pcUrl;
    }
}
