package com.vikadata.api.modular.finance.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.SocialDingtalkRefundEntity;

/**
 * 订阅计费系统-钉钉退款订单表 Mapper
 * @author Zoe
 * @date 2022-05-13 16:36:42
 */
public interface SocialDingTalkRefundMapper extends BaseMapper<SocialDingtalkRefundEntity> {
    /**
     * 通过退款号检查退款单号是否存在
     * @param orderId 订单号
     * @param tenantId 企业ID
     * @param appId 应用ID
     * @return count
     * @author zoe zheng
     * @date 2022/5/19 14:48
     */
    Integer selectStatusByOrderId(@Param("orderId") String orderId, @Param("tenantId") String tenantId,
            @Param("appId") String appId);

    /**
     * 更新退款处理状态
     *
     * @param tenantId 企业ID
     * @param appId 应用ID
     * @param orderId 飞书订单ID
     * @return 影响行数
     * @author zoe zheng
     * @date 2022/5/23 18:58
     */
    Integer updateStatusByTenantIdAndAppIdAndOrderId(@Param("tenantId") String tenantId,
            @Param("appId") String appId, @Param("orderId") String orderId, @Param("status") Integer status);
}
