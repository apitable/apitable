package com.vikadata.system.config.i18n;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

/**
 * 国际化语言字符串
 * @author Shawn Deng
 * @date 2021-11-11 16:05:05
 */
@Data
public class I18nStrings {

    @JsonProperty("zh_CN")
    private String zhCN;

    @JsonProperty("en_US")
    private String enUS;

    @JsonProperty("zh_HK")
    private String zhHK;
}
