package com.vikadata.api.handler;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.vikadata.api.annotation.PageObjectParam;
import com.vikadata.api.helper.PageHelper;
import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebArgumentResolver;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

/**
 * <p>
 * 分页字符串参数转对象
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/25 13:01
 */
public class PageParamHandlerMethodArgumentResolver implements HandlerMethodArgumentResolver {

    /**
     * 用于判定是否需要处理该参数分解，返回true为需要，并会去调用下面的方法resolveArgument
     */
    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return Page.class.isAssignableFrom(parameter.getParameterType()) && parameter.hasParameterAnnotation(PageObjectParam.class);
    }

    /**
     * 真正用于处理参数分解的方法，返回的Object就是controller方法上的形参对象
     */
    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
        PageObjectParam annotation = parameter.getParameterAnnotation(PageObjectParam.class);
        if (annotation == null) {
            throw new IllegalArgumentException("未知的参数名 [" + parameter.getParameterType().getName() + "]");
        }

        if (Page.class.isAssignableFrom(parameter.getParameterType())) {
            String value = webRequest.getParameter(annotation.name());
            return PageHelper.convert(value);
        }

        return WebArgumentResolver.UNRESOLVED;
    }
}
