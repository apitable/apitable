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

package com.apitable.shared.component.scanner;

import cn.hutool.core.net.NetUtil;
import cn.hutool.core.util.StrUtil;
import com.apitable.shared.component.ResourceDefinition;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.component.scanner.annotation.PostResource;
import com.apitable.shared.util.AopTargetUtils;
import com.apitable.shared.util.IgnorePathHelper;
import java.lang.annotation.Annotation;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
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
 * api source scanner.
 *
 * @author Shawn Deng
 */
@Slf4j
@Component
public class ApiResourceScanner
    implements BeanPostProcessor, Ordered, ApplicationContextAware {

    /**
     * string connector.
     */
    private static final String LINK_SYMBOL = "$";

    /**
     * minuend.
     */
    private static final int MINUEND = 11;

    private ApplicationContext applicationContext;

    private ApiResourceFactory apiResourceFactory;

    /**
     * GetApiResourceFactory.
     *
     * @return ApiResourceFactory
     */
    public ApiResourceFactory getApiResourceFactory() {
        if (apiResourceFactory == null) {
            apiResourceFactory =
                applicationContext.getBean(ApiResourceFactory.class);
        }
        return apiResourceFactory;
    }

    @Override
    public Object postProcessBeforeInitialization(
        @NotNull final Object bean, @NotNull final String beanName
    ) throws BeansException {
        return bean;
    }

    @Override
    public Object postProcessAfterInitialization(
        @NotNull final Object bean, @NotNull final String beanName
    ) throws BeansException {
        Object aopTarget = AopTargetUtils.getTarget(bean);

        if (aopTarget == null) {
            aopTarget = bean;
        }

        final Class<?> clazz = aopTarget.getClass();

        final boolean controllerFlag = checkControllerFlag(clazz);
        if (!controllerFlag) {
            return bean;
        }

        final List<ResourceDefinition> apiResourceDefinitions = doScan(clazz);

        persistApiResources(apiResourceDefinitions);

        return bean;
    }

    @Override
    public int getOrder() {
        return Ordered.LOWEST_PRECEDENCE - MINUEND;
    }

    @Override
    public void setApplicationContext(@NotNull final ApplicationContext context)
        throws BeansException {
        this.applicationContext = context;
    }

    /**
     * whether class is controller.
     *
     * @param clazz class
     * @return true | false
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
     * save api resource.
     *
     * @param apiResources api resource list
     */
    private void persistApiResources(
        final List<ResourceDefinition> apiResources) {
        getApiResourceFactory().registerDefinition(apiResources);
    }

    /**
     * scan bean.
     *
     * @param clazz class
     * @return resource list
     */
    private List<ResourceDefinition> doScan(final Class<?> clazz) {
        final ArrayList<ResourceDefinition> apiResources = new ArrayList<>();
        final ApiResource classApiAnnotation =
            clazz.getAnnotation(ApiResource.class);
        if (classApiAnnotation != null && !classApiAnnotation.ignore()) {
            final Method[] declaredMethods = clazz.getDeclaredMethods();
            for (final Method declaredMethod : declaredMethods) {
                final Annotation annotation = this.getOnMethod(declaredMethod);
                if (annotation != null) {
                    final ResourceDefinition definition =
                        createDefinition(clazz, declaredMethod, annotation);
                    apiResources.add(definition);
                }
            }
        }

        return apiResources;
    }

    private ResourceDefinition createDefinition(
        final Class<?> clazz, final Method method, final Annotation apiResource
    ) {
        final ResourceDefinition resourceDefinition = new ResourceDefinition();
        resourceDefinition.setClassName(clazz.getSimpleName());
        resourceDefinition.setMethodName(method.getName());

        String modularCode;
        final ApiResource classApiAnnotation =
            clazz.getAnnotation(ApiResource.class);
        if (StrUtil.isEmpty(classApiAnnotation.code())) {
            final String className = clazz.getSimpleName();
            modularCode = getControllerClassPrefix(className);
        } else {
            modularCode = classApiAnnotation.code();
        }
        resourceDefinition.setModularCode(modularCode);
        resourceDefinition.setModularName(classApiAnnotation.name());

        final String resourceCode = invokeAnnotationMethod(apiResource, "code");
        if (StrUtil.isEmpty(resourceCode)) {
            final String definitionCode =
                StrUtil.join(
                    LINK_SYMBOL,
                    StrUtil.toUnderlineCase(modularCode),
                    StrUtil.toUnderlineCase(method.getName()));
            resourceDefinition.setResourceCode(definitionCode);
        } else {
            resourceDefinition.setResourceCode(
                StrUtil.join(LINK_SYMBOL, modularCode, resourceCode));
        }

        final String name = invokeAnnotationMethod(apiResource, "name");
        resourceDefinition.setResourceName(name);
        final String[] paths = invokeAnnotationMethod(apiResource, "path");
        String[] resourceUrls = new String[paths.length];
        for (int i = 0; i < paths.length; i++) {
            resourceUrls[i] = getControllerClassRequestPath(clazz) + paths[i];
        }
        resourceDefinition.setResourceUrls(resourceUrls);
        final Boolean requiredLogin =
            invokeAnnotationMethod(apiResource, "requiredLogin");
        resourceDefinition.setRequiredLogin(requiredLogin);
        if (!requiredLogin) {
            IgnorePathHelper.getInstant()
                .addAll(Arrays.asList(resourceDefinition.getResourceUrls()));
        }
        final Boolean requiredPermission =
            invokeAnnotationMethod(apiResource, "requiredPermission");
        resourceDefinition.setRequiredPermission(requiredPermission);
        final String[] tags = invokeAnnotationMethod(apiResource, "tags");
        resourceDefinition.setTags(tags);
        final Boolean requiredAccessDomain =
            invokeAnnotationMethod(apiResource, "requiredAccessDomain");
        resourceDefinition.setRequiredAccessDomain(requiredAccessDomain);

        final RequestMethod[] requestMethods =
            invokeAnnotationMethod(apiResource, "method");
        final List<String> methodNames = new ArrayList<>();
        for (final RequestMethod requestMethod : requestMethods) {
            methodNames.add(requestMethod.name());
        }
        resourceDefinition.setHttpMethod(StrUtil.join(",", methodNames));

        final String localMacAddress = NetUtil.getLocalhostStr();
        resourceDefinition.setIpAddress(
            localMacAddress == null ? "" : localMacAddress);
        resourceDefinition.setCreateTime(LocalDateTime.now());
        return resourceDefinition;
    }

    @SuppressWarnings("unchecked")
    private <T> T invokeAnnotationMethod(
        final Annotation apiResource, final String methodName) {
        try {
            final Class<? extends Annotation> annotationType =
                apiResource.annotationType();
            final Method method = annotationType.getMethod(methodName);
            return (T) method.invoke(apiResource);
        } catch (NoSuchMethodException | IllegalAccessException
                 | InvocationTargetException e) {
            log.error("fail to scan api resources!", e);
            throw new RuntimeException("fail to scan api resources!", e);
        }
    }

    private String getControllerClassRequestPath(final Class<?> clazz) {
        String result = "";

        final ApiResource controllerRequestMapping =
            clazz.getDeclaredAnnotation(ApiResource.class);
        if (controllerRequestMapping != null) {
            final String[] paths = controllerRequestMapping.path();
            if (paths.length > 0) {
                result = paths[0];
            } else {
                result = "";
            }
        }

        return result;
    }

    private String getControllerClassPrefix(final String className) {
        final int controllerIndex = className.indexOf("Controller");
        if (controllerIndex == -1) {
            throw new IllegalArgumentException(
                "Controller naming error, " + "should ends with Controller！");
        }
        return className.substring(0, controllerIndex);
    }

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
