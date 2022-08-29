package com.vikadata.api.aspect;

import java.util.Objects;
import java.util.Optional;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import cn.hutool.core.exceptions.UtilException;
import cn.hutool.core.text.StrBuilder;
import cn.hutool.core.util.ReflectUtil;
import cn.hutool.core.util.StrUtil;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;

import com.vikadata.api.constants.ParamsConstants;

import org.springframework.core.annotation.Order;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import static com.vikadata.api.constants.AspectOrderConstants.CHAIN_ON_GRAY_CONFIG_ORDER;
import static com.vikadata.define.constants.RedisConstants.KONG_GATEWAY_GRAY_SPACE;

/**
 * <p>
 * 灰度配置自动切换AOP
 * </p>
 *
 * @author Pengap
 * @date 2022/5/25 21:17:09
 */
@Aspect
@Component
@Order(CHAIN_ON_GRAY_CONFIG_ORDER)
public class ChainOnGrayConfigAspect {

    /*
     * 灰度属性统一标识
     * before:
     *  serverDomain::getServerDomain
     *
     * after:
     *  serverDomain::getGrayServerDomain
     */
    private final String GRAY_FLAG = "Gray";

    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    @Pointcut("execution(* com.vikadata.api.config.properties.ConstProperties.getServerDomain(..))"
            + " || execution(* com.vikadata.api.config.properties.ConstProperties.getCallbackDomain(..))")
    public void grayProperty() {
        // 需要拦截的属性
    }

    @Around("grayProperty()")
    public Object beforeMethod(ProceedingJoinPoint point) throws Throwable {
        Object target = point.getTarget();
        Object[] args = point.getArgs();
        Object result = point.proceed(args);
        RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
        if (Objects.isNull(requestAttributes)) {
            return result;
        }

        HttpServletRequest request = ((ServletRequestAttributes) requestAttributes).getRequest();
        // 根据请求头来获取空间站ID
        String spaceId = request.getHeader(ParamsConstants.SPACE_ID);
        if (this.isGrayEnv(spaceId)) {
            // 输出灰度变量
            String grayName = StrBuilder.create(point.getSignature().getName()).insert(3, GRAY_FLAG).toString();

            try {
                result = Optional.ofNullable(ReflectUtil.invoke(target, grayName, args))
                        // 如果灰度属性未设置，降级到以前的属性
                        .orElse(result);
            }
            catch (UtilException ignored) {
            }
        }
        return result;
    }

    /**
     * 查询空间站是否灰度环境
     *
     * @param spaceId 空间站Id
     * @return boolean
     * @author Pengap
     * @date 2022/6/16 16:45:37
     */
    private boolean isGrayEnv(String spaceId) {
        return StrUtil.isNotBlank(spaceId) && Boolean.TRUE.equals(
                redisTemplate.execute((RedisCallback<Boolean>) connection ->
                        connection.hExists(StrUtil.utf8Bytes(KONG_GATEWAY_GRAY_SPACE), StrUtil.utf8Bytes(spaceId))
                ));
    }

}
