package com.vikadata.api.context;

import java.util.Locale;

import com.vikadata.api.component.LanguageManager;
import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;

import org.springframework.context.MessageSource;

/**
 * <p>
 * i18n国际化上下文工具
 * </p>
 *
 * @author Pengap
 * @date 2021/11/24 11:47:17
 */
public class I18nContext {

    private final MessageSource messageSource;

    public I18nContext(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    /**
     * 获取自身INSTANCE
     */
    public static I18nContext me() {
        return SpringContextHolder.getBean(I18nContext.class);
    }

    /**
     * 获取单个国际化翻译值
     */
    public String transform(String msgKey, Locale locale, String defaultMessage) {
        try {
            return messageSource.getMessage(msgKey, null, defaultMessage, locale);
        }
        catch (Exception e) {
            return null;
        }
    }

    /**
     * 获取单个国际化翻译值，使用默认语言
     */
    public String transform(String msgKey, String defaultMessage) {
        return transform(msgKey, LanguageManager.me().getDefaultLanguage(), defaultMessage);
    }

    /**
     * 获取单个国际化翻译值，没有匹配记录，使用代码作为默认消息
     */
    public String transform(String msgKey, Locale locale) {
        return transform(msgKey, locale, msgKey);
    }

    /**
     * 获取单个国际化翻译值，使用默认语言，没有匹配记录，使用代码作为默认消息
     */
    public String transform(String msgKey) {
        return transform(msgKey, LanguageManager.me().getDefaultLanguage());
    }

}

