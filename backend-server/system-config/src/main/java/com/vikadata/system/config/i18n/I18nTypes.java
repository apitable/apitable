package com.vikadata.system.config.i18n;

import java.util.Arrays;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 国际化语言
 * @author Shawn Deng
 * @date 2021-11-11 16:11:46
 */
@RequiredArgsConstructor
@Getter
public enum I18nTypes {

    ZH_CN("zh_CN", new String[] { "zh-CN" }, true),

    EN_US("en_US", new String[] { "en-US" }, true),

    ZH_HK("zh_HK", new String[] { "zh-HK" }, false);

    private final String name;

    private final String[] alias;

    private final boolean isSupport;

    public static I18nTypes of(String name) {
        for (I18nTypes value : I18nTypes.values()) {
            if (value.getName().equals(name)) {
                return value;
            }
        }
        return I18nTypes.ZH_CN;
    }

    public static I18nTypes aliasOf(String name) {
        for (I18nTypes value : I18nTypes.values()) {
            if (value.getName().equals(name) || (null != value.getAlias() && Arrays.asList(value.getAlias()).contains(name))) {
                return value;
            }
        }
        return I18nTypes.ZH_CN;
    }

    public I18nTypes isBackoff() {
        // 是否退避的语言，防止出现系统暂时为兼容但是意外返回
        return this.isSupport ? this : I18nTypes.ZH_CN;
    }

}
