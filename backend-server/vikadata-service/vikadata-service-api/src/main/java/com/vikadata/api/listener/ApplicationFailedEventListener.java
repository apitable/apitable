package com.vikadata.api.listener;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationFailedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

/**
 * <p>
 * 服务启动失败监听器
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/3/23 00:21
 */
@Component
@Slf4j
public class ApplicationFailedEventListener implements ApplicationListener<ApplicationFailedEvent> {

    @Override
    public void onApplicationEvent(ApplicationFailedEvent event) {
        log.error("服务启动失败.....");
    }
}
