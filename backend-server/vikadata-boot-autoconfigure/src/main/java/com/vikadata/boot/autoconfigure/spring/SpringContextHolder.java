package com.vikadata.boot.autoconfigure.spring;

import cn.hutool.core.util.ArrayUtil;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.ConfigurableApplicationContext;

/**
 * <p>
 * spring application context helper
 * </p>
 *
 * @author Shawn Deng
 */
public class SpringContextHolder implements ApplicationContextAware {

    private static ApplicationContext applicationContext;

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        SpringContextHolder.applicationContext = applicationContext;
    }

    public static ApplicationContext getApplicationContext() {
        assertApplicationContext();
        return applicationContext;
    }

    public static <T> T getBean(String beanName, Class<T> classType) {
        assertApplicationContext();
        return applicationContext.getBean(beanName, classType);
    }

    public static <T> T getBean(Class<T> requiredType) {
        assertApplicationContext();
        return applicationContext.getBean(requiredType);
    }

    /**
     * get active profile list
     *
     * @return profile list
     */
    public static String[] getActiveProfiles() {
        assertApplicationContext();
        return applicationContext.getEnvironment().getActiveProfiles();
    }

    /**
     * get first active profile
     *
     * @return profile name
     */
    public static String getActiveProfile() {
        assertApplicationContext();
        final String[] activeProfiles = getActiveProfiles();
        return ArrayUtil.isNotEmpty(activeProfiles) ? activeProfiles[0] : null;
    }

    /**
     * Dynamically register beans
     *
     * @param <T>      Bean class type
     * @param beanName bean name
     * @param bean     bean
     */
    public static <T> void registerBean(String beanName, T bean) {
        assertApplicationContext();
        ConfigurableApplicationContext context = (ConfigurableApplicationContext) applicationContext;
        context.getBeanFactory().registerSingleton(beanName, bean);
    }

    private static void assertApplicationContext() {
        if (SpringContextHolder.applicationContext == null) {
            throw new RuntimeException("ApplicationContext is null, please check whether SpringContextHolder is bean?");
        }
    }
}
