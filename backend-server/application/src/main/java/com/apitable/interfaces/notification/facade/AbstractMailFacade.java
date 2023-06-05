package com.apitable.interfaces.notification.facade;

import cn.hutool.core.util.StrUtil;

/**
 * abstract class for mail facade.
 */
public abstract class AbstractMailFacade implements MailFacade {

    /**
     * * Load Template Resource Path.
     *
     * @param locale       locale
     * @param templateName templateName
     * @return Path
     */
    public String loadTemplateResourcePath(
        final String locale,
        final String templateName
    ) {
        return StrUtil.format("notification/{}", templateName);
    }
}
