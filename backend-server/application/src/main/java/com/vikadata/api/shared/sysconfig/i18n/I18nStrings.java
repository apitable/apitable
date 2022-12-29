package com.vikadata.api.shared.sysconfig.i18n;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

/**
 * <p>
 * I18n Strings
 * </p>
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
