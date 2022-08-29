package com.vikadata.api.component;

import java.lang.annotation.Annotation;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import cn.hutool.core.net.NetUtil;
import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.helper.IgnorePathHelper;
import com.vikadata.api.lang.ResourceDefinition;
import com.vikadata.api.util.AopTargetUtils;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 * API资源扫描器
 * BEAN后置器实现，每个BEAN初始化之后的操作
 * </p>
 *
 * @author Shawn Deng
 * @date 2018/11/5 16:16
 */
@Slf4j
@Component
public class ApiResourceScanner implements BeanPostProcessor, Ordered, ApplicationContextAware {

    /**
     * 编码连接符
     */
    private static final String LINK_SYMBOL = "$";

    private ApplicationContext applicationContext;

    private ApiResourceFactory apiResourceFactory;

    public ApiResourceFactory getApiResourceFactory() {
        if (apiResourceFactory == null) {
            apiResourceFactory = applicationContext.getBean(ApiResourceFactory.class);
        }
        return apiResourceFactory;
    }

    /**
     * 实例化、依赖注入完毕，在调用显示的初始化之前完成一些定制的初始化
     *
     * @author Shawn Deng
     * @date 2018/11/5 16:20
     */
    @Override
    public Object postProcessBeforeInitialization(final Object bean, final String beanName) throws BeansException {
        return bean;
    }

    /**
     * 实例化、依赖注入、初始化完毕时执行
     *
     * @author Shawn Deng
     * @date 2018/11/5 16:20
     */
    @Override
    public Object postProcessAfterInitialization(final Object bean, final String beanName) throws BeansException {
        // 如果controller是代理对象,则需要获取原始类的信息
        Object aopTarget = AopTargetUtils.getTarget(bean);

        if (aopTarget == null) {
            aopTarget = bean;
        }

        final Class<?> clazz = aopTarget.getClass();

        // 判断是不是控制器,不是控制器就略过
        final boolean controllerFlag = checkControllerFlag(clazz);
        if (!controllerFlag) {
            return bean;
        }

        // 扫描控制器的所有带自定义资源注解Resource注解的方法
        final List<ResourceDefinition> apiResourceDefinitions = doScan(clazz);

        // 将扫描到的注解资源转化为资源实体存储到缓存
        persistApiResources(apiResourceDefinitions);

        return bean;
    }

    @Override
    public int getOrder() {
        return Ordered.LOWEST_PRECEDENCE - 11;
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }

    /**
     * 判断一个类是否是控制器
     *
     * @author Shawn Deng
     * @date 2018/11/5 16:25
     */
    private boolean checkControllerFlag(final Class<?> clazz) {
        final Annotation[] annotations = clazz.getAnnotations();

        for (final Annotation annotation : annotations) {
            if (RestController.class.equals(annotation.annotationType())
                    || Controller.class.equals(annotation.annotationType())) {
                return true;
            }
        }
        return false;
    }

    /**
     * 存储资源列表
     *
     * @author Shawn Deng
     * @date 2018/11/5 17:35
     */
    private void persistApiResources(final List<ResourceDefinition> apiResources) {
        getApiResourceFactory().registerDefinition(apiResources);
    }

    /**
     * 扫描控制器类生成资源列表
     *
     * @author Shawn Deng
     * @date 2018/11/5 17:10
     */
    private List<ResourceDefinition> doScan(final Class<?> clazz) {
        // 绑定类的code-中文名称映射
        final ArrayList<ResourceDefinition> apiResources = new ArrayList<>();
        final ApiResource classApiAnnotation = clazz.getAnnotation(ApiResource.class);
        if (classApiAnnotation != null && !classApiAnnotation.ignore()) {
            final Method[] declaredMethods = clazz.getDeclaredMethods();
            if (declaredMethods.length > 0) {
                for (final Method declaredMethod : declaredMethods) {
                    final Annotation annotation = this.getOnMethod(declaredMethod);
                    if (annotation != null) {
                        final ResourceDefinition definition = createDefinition(clazz, declaredMethod, annotation);
                        apiResources.add(definition);
                    }
                }
            }
        }

        return apiResources;
    }

    /**
     * 构造 ResourceDefinition 资源对象
     *
     * @author Shawn Deng
     * @date 2018/11/5 17:10
     */
    private ResourceDefinition createDefinition(final Class<?> clazz, final Method method,
            final Annotation apiResource) {
        final ResourceDefinition resourceDefinition = new ResourceDefinition();
        resourceDefinition.setClassName(clazz.getSimpleName());
        resourceDefinition.setMethodName(method.getName());

        // 设置模块编码和名称
        String modularCode;
        final ApiResource classApiAnnotation = clazz.getAnnotation(ApiResource.class);
        if (StrUtil.isEmpty(classApiAnnotation.code())) {
            final String className = clazz.getSimpleName();
            modularCode = getControllerClassPrefix(className);
            getApiResourceFactory().registerModular(StrUtil.toUnderlineCase(modularCode), classApiAnnotation.name());
        }
        else {
            modularCode = classApiAnnotation.code();
            getApiResourceFactory().registerModular(StrUtil.toUnderlineCase(classApiAnnotation.code()),
                    classApiAnnotation.name());
        }
        resourceDefinition.setModularCode(modularCode);
        resourceDefinition.setModularName(classApiAnnotation.name());

        // 资源编码
        final String resourceCode = invokeAnnotationMethod(apiResource, "code");
        if (StrUtil.isEmpty(resourceCode)) {
            final String definitionCode = StrUtil.join(LINK_SYMBOL, StrUtil.toUnderlineCase(modularCode),
                    StrUtil.toUnderlineCase(method.getName()));
            resourceDefinition.setResourceCode(definitionCode);
        }
        else {
            resourceDefinition.setResourceCode(StrUtil.join(LINK_SYMBOL, modularCode, resourceCode));
        }

        // 设置其他属性
        final String name = invokeAnnotationMethod(apiResource, "name");
        resourceDefinition.setResourceName(name);
        final String[] path = invokeAnnotationMethod(apiResource, "path");
        resourceDefinition.setResourceUrl(getControllerClassRequestPath(clazz) + path[0]);
        final Boolean requiredLogin = invokeAnnotationMethod(apiResource, "requiredLogin");
        resourceDefinition.setRequiredLogin(requiredLogin);
        if (!requiredLogin) {
            IgnorePathHelper.getInstant().add(resourceDefinition.getResourceUrl());
        }
        final Boolean requiredPermission = invokeAnnotationMethod(apiResource, "requiredPermission");
        resourceDefinition.setRequiredPermission(requiredPermission);
        final String[] tags = invokeAnnotationMethod(apiResource, "tags");
        resourceDefinition.setTags(tags);
        final Boolean requiredAccessDomain = invokeAnnotationMethod(apiResource, "requiredAccessDomain");
        resourceDefinition.setRequiredAccessDomain(requiredAccessDomain);

        // 资源支持多个请求方法
        final RequestMethod[] requestMethods = invokeAnnotationMethod(apiResource, "method");
        final List<String> methodNames = new ArrayList<>();
        for (final RequestMethod requestMethod : requestMethods) {
            methodNames.add(requestMethod.name());
        }
        resourceDefinition.setHttpMethod(StrUtil.join(",", methodNames));

        final String localMacAddress = NetUtil.getLocalhostStr();
        resourceDefinition.setIpAddress(localMacAddress == null ? "" : localMacAddress);
        resourceDefinition.setCreateTime(LocalDateTime.now());
        return resourceDefinition;
    }

    /**
     * 获取注解里的属性方法
     *
     * @author Shawn Deng
     * @date 2018/11/5 17:12
     */
    @SuppressWarnings("unchecked")
    private <T> T invokeAnnotationMethod(final Annotation apiResource, final String methodName) {
        try {
            final Class<? extends Annotation> annotationType = apiResource.annotationType();
            final Method method = annotationType.getMethod(methodName);
            return (T) method.invoke(apiResource);
        }
        catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
            log.error("扫描api资源时出错!", e);
        }
        throw new RuntimeException("扫描api资源时出错!");
    }

    /**
     * 获取控制器类上的RequestMapping注解的映射路径,用于拼接请求资源URL
     *
     * @author Shawn Deng
     * @date 2018/11/5 17:08
     */
    private String getControllerClassRequestPath(final Class<?> clazz) {
        String result = "";

        final ApiResource controllerRequestMapping = clazz.getDeclaredAnnotation(ApiResource.class);
        if (controllerRequestMapping != null) {
            final String[] paths = controllerRequestMapping.path();
            if (paths.length > 0) {
                result = paths[0];
            }
            else {
                result = "";
            }
        }

        return result;
    }

    /**
     * 获取控制器名称前缀
     *
     * @param className 类名
     * @return 前缀
     * @author Shawn Deng
     * @date 2018/11/5 18:15
     */
    private String getControllerClassPrefix(final String className) {
        final int controllerIndex = className.indexOf("Controller");
        if (controllerIndex == -1) {
            throw new IllegalArgumentException("控制器命名错误，应用以Controller结尾！");
        }
        return className.substring(0, controllerIndex);
    }

    /**
     * 获取方法上面的注解
     *
     * @param method 方法
     * @return Annotation
     * @author Shawn Deng
     * @date 2019-04-13 23:06
     */
    private Annotation getOnMethod(final Method method) {
        Annotation annotation = null;

        final GetResource getResource = method.getAnnotation(GetResource.class);

        if (getResource != null && !getResource.ignore()) {
            annotation = getResource;
        }

        final PostResource postResource = method.getAnnotation(PostResource.class);

        if (postResource != null && !postResource.ignore()) {
            annotation = postResource;
        }

        return annotation;
    }
}
