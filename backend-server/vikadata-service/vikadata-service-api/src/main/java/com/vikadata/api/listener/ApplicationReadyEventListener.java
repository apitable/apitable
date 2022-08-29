package com.vikadata.api.listener;

import java.util.Locale;
import java.util.TimeZone;

import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.component.LanguageManager;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.boot.info.BuildProperties;
import org.springframework.context.ApplicationListener;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import static com.vikadata.api.constants.TimeZoneConstants.DEFAULT_TIME_ZONE;

/**
 * <p>
 * 服务启动成功事件监听器
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/3/23 00:23
 */
@Component
@Slf4j
public class ApplicationReadyEventListener implements ApplicationListener<ApplicationReadyEvent> {

    private final BuildProperties buildProperties;

    public ApplicationReadyEventListener(BuildProperties buildProperties, Environment environment) {
        this.buildProperties = buildProperties;
    }

    @SneakyThrows
    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        log.info("工程版本:[{}], 运行环境: {}", buildProperties.getVersion(), System.getenv("ENV"));
        // 过滤配置中的环境
        event.getApplicationContext().getBean(OnReadyListener.class).init();
        // 以防本地机器开发时区不同出现误判
        TimeZone.setDefault(TimeZone.getTimeZone(DEFAULT_TIME_ZONE));
        Locale.setDefault(LanguageManager.me().getDefaultLanguage());
        log.info("服务语言配置「{}」", Locale.getDefault());
    }
}
