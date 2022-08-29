package com.vikadata.api.component.sentry;

import io.sentry.Breadcrumb;
import io.sentry.SentryOptions;
import lombok.extern.slf4j.Slf4j;

/**
 * Registering Custom Before Breadcrumb Callback
 * @author Shawn Deng
 * @date 2021-07-13 12:07:37
 */
@Slf4j
public class SentryBeforeBreadcrumbCallback implements SentryOptions.BeforeBreadcrumbCallback {

    @Override
    public Breadcrumb execute(Breadcrumb breadcrumb, Object hint) {
        log.info("Sentry Breadcrumb Callback");
        return breadcrumb;
    }
}
