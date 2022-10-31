package com.vikadata.api.listener;

import java.util.Locale;
import java.util.TimeZone;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.component.LanguageManager;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import static com.vikadata.api.constants.TimeZoneConstants.DEFAULT_TIME_ZONE;

/**
 * <p>
 * service startup success event listener
 * </p>
 *
 * @author Shawn Deng
 */
@Component
@Slf4j
public class ApplicationReadyEventListener implements ApplicationListener<ApplicationReadyEvent> {

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        event.getApplicationContext().getBean(OnReadyListener.class).init();
        TimeZone.setDefault(TimeZone.getTimeZone(DEFAULT_TIME_ZONE));
        Locale.setDefault(LanguageManager.me().getDefaultLanguage());
        log.info("Server Locale is「{}」", Locale.getDefault());
    }
}
