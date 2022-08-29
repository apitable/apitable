package com.vikadata.api.listener;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.component.ApiResourceFactory;
import com.vikadata.api.support.ResourceHandlerSupport;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

/**
 * <p>
 * 上下文准备时触发
 * 监听扫描器初始化完毕，扫描的资源初始化到数据库，与数据库同步
 * 后期开发
 * </p>
 *
 * @author Shawn Deng
 * @date 2018/11/5 18:23
 */
@Component
@ConditionalOnBean(ResourceHandlerSupport.class)
@Slf4j
public class ResourceInitListener implements ApplicationListener<ApplicationReadyEvent>, ApplicationContextAware, InitializingBean {

	private ApplicationContext applicationContext;

	@Override
	public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
		this.applicationContext = applicationContext;
	}

	@Override
	public void onApplicationEvent(ApplicationReadyEvent event) {
		ApiResourceFactory resourceFactory = applicationContext.getBean(ApiResourceFactory.class);
		ResourceHandlerSupport resourceHandlerSupport = applicationContext.getBean(ResourceHandlerSupport.class);
		resourceHandlerSupport.doHandle(resourceFactory);
	}

	@Override
	public void afterPropertiesSet() {
		log.info("资源初始化监听器（自定义资源分配）");
	}
}
