package com.vikadata.api.modular.social.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.entity.SocialTenantOrderEntity;

/**
 * <p>
 * Third party platform integration - enterprise tenant order mapper
 * </p>
 */
public interface SocialTenantOrderMapper extends BaseMapper<SocialTenantOrderEntity> {
    /**
     *  Find the order quantity according to the order number
     *
     * @param channelOrderId Channel order No
     * @param tenantId Enterprise ID
     * @param appId App ID
     * @param platform Application Type
     * @return Number
     */
    Integer selectCountByChannelOrderId(@Param("channelOrderId") String channelOrderId, @Param("tenantId") String tenantId,
            @Param("appId") String appId, @Param("platform") SocialPlatformType platform);

    /**
     * Get the order information of the third-party enterprise
     *
     * @param tenantId Enterprise ID
     * @param appId App ID
     * @param platform Application Type
     * @return orderData
     */
    List<String> selectOrderDataByTenantIdAndAppId(@Param("tenantId") String tenantId, @Param("appId") String appId,
            @Param("platform") SocialPlatformType platform);
}
