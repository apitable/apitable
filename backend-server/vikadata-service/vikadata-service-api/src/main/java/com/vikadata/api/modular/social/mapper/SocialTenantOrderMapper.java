package com.vikadata.api.modular.social.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.entity.SocialTenantOrderEntity;

/**
 * <p>
 * 第三方平台集成-企业租户订单 Mapper
 * </p>
 * @author zoe zheng
 * @date 2022/2/28 18:49
 */
public interface SocialTenantOrderMapper extends BaseMapper<SocialTenantOrderEntity> {
    /**
     *  根据订单号查找订单数量
     *
     * @param channelOrderId 渠道订单号
     * @param tenantId 企业ID
     * @param appId 应用ID
     * @param platform 应用类型
     * @return
     * @author zoe zheng
     * @date 2022/2/28 18:54
     */
    Integer selectCountByChannelOrderId(@Param("channelOrderId") String channelOrderId, @Param("tenantId") String tenantId,
            @Param("appId") String appId, @Param("platform") SocialPlatformType platform);

    /**
     * 获取第三方企业的订单信息
     *
     * @param tenantId 企业ID
     * @param appId 应用ID
     * @param platform 应用类型
     * @return orderData
     * @author zoe zheng
     * @date 2022/2/28 20:44
     */
    List<String> selectOrderDataByTenantIdAndAppId(@Param("tenantId") String tenantId, @Param("appId") String appId,
            @Param("platform") SocialPlatformType platform);
}
