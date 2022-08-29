package com.vikadata.api.listener;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.web.session.HttpSessionEventPublisher;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpSessionEvent;

/**
 * <p>
 * 会话事件监听器
 * 扩展的HttpSessionEventPublisher
 * 支持在线人数统计
 * 监听会话创建、会话销毁动作，操作自己业务
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/10/28 20:50
 */
@Slf4j
@Component
public class EnhancedHttpSessionEventPublisher extends HttpSessionEventPublisher {

    @Override
    public void sessionCreated(HttpSessionEvent event) {
        log.info("创建会话: {}", event.getSession().getId());
        super.sessionCreated(event);
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent event) {
        log.info("销毁会话: {}", event.getSession().getId());
        super.sessionDestroyed(event);
    }
}
