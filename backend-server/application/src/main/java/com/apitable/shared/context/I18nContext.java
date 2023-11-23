/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.shared.context;

import com.apitable.core.util.SpringContextHolder;
import com.apitable.shared.component.LanguageManager;
import java.util.Locale;
import org.springframework.context.MessageSource;

/**
 * <p>
 * i18n context util.
 * </p>
 *
 * @author Pengap
 */
public class I18nContext {

    private final MessageSource messageSource;

    public I18nContext(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    public static I18nContext me() {
        return SpringContextHolder.getBean(I18nContext.class);
    }

    /**
     * transform.
     *
     * @param msgKey         message key
     * @param locale         locale
     * @param defaultMessage default message
     * @return message
     */
    public String transform(String msgKey, Locale locale, String defaultMessage) {
        try {
            return messageSource.getMessage(msgKey, null, defaultMessage, locale);
        } catch (Exception e) {
            return null;
        }
    }

    public String transform(String msgKey, String defaultMessage) {
        return transform(msgKey, LanguageManager.me().getDefaultLanguage(), defaultMessage);
    }

    public String transform(String msgKey, Locale locale) {
        return transform(msgKey, locale, msgKey);
    }

    public String transform(String msgKey) {
        return transform(msgKey, LanguageManager.me().getDefaultLanguage());
    }

}

