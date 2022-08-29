package com.vikadata.api.handler;

import cn.hutool.json.JSONUtil;
import com.vikadata.api.annotation.StringObjectParam;
import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import javax.annotation.Nonnull;

/**
 * <p>
 * 字符串参数转JSON
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/25 13:01
 */
public class StringObjectParamHandlerMethodArgumentResolver implements HandlerMethodArgumentResolver {

    /**
     * 用于判定是否需要处理该参数分解，返回true为需要，并会去调用下面的方法resolveArgument
     */
    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(StringObjectParam.class);
    }

    /**
     * 真正用于处理参数分解的方法，返回的Object就是controller方法上的形参对象
     */
    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
        StringObjectParam annotation = parameter.getParameterAnnotation(StringObjectParam.class);
        if (annotation == null) {
            throw new IllegalArgumentException("未知的参数名 [" + parameter.getParameterType().getName() + "]");
        }

        // 获取参数值
        String value = webRequest.getParameter(annotation.name());
        return JSONUtil.toBean(value, parameter.getParameterType());
    }
}
