package com.vikadata.social.feishu.model.v3;

import lombok.Getter;
import lombok.Setter;

/**
 * 自定义属性
 * @author Shawn Deng
 * @date 2021-07-07 21:57:34
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
