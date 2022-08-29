package com.vikadata.api.modular.finance.strategy;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import cn.hutool.core.lang.Assert;

import com.vikadata.api.enums.social.SocialPlatformType;

/**
 * <p>
 * third party orders strategy factory
 * </p>
 * @author zoe zheng
 * @date 2022/5/18 18:32
 */
@SuppressWarnings({"unchecked","rawtypes"})
public class SocialOrderStrategyFactory {

    private static final Map<Integer, ISocialOrderService> services = new ConcurrentHashMap<>();

    public static <T, R> ISocialOrderService<T, R> getService(SocialPlatformType platformType) {
        return services.get(platformType.getValue());
    }

    public static <T, R> void register(SocialPlatformType platformType, ISocialOrderService<T, R> socialOrderService) {
        Assert.notNull(platformType, "social platformType can't be null");
        services.put(platformType.getValue(), socialOrderService);
    }
}
