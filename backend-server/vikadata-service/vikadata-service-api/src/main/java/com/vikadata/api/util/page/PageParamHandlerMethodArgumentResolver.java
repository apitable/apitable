package com.vikadata.api.util.page;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebArgumentResolver;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

/**
 * <p>
 * string to page object resolver
 * </p>
 *
 * @author Shawn Deng
 */
public class PageParamHandlerMethodArgumentResolver implements HandlerMethodArgumentResolver {

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return Page.class.isAssignableFrom(parameter.getParameterType()) && parameter.hasParameterAnnotation(PageObjectParam.class);
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest, WebDataBinderFactory binderFactory) {
        PageObjectParam annotation = parameter.getParameterAnnotation(PageObjectParam.class);
        if (annotation == null) {
            throw new IllegalArgumentException("unknown parameter name [" + parameter.getParameterType().getName() + "]");
        }

        if (Page.class.isAssignableFrom(parameter.getParameterType())) {
            String value = webRequest.getParameter(annotation.name());
            return PageHelper.convert(value);
        }

        return WebArgumentResolver.UNRESOLVED;
    }
}
