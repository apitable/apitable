package com.vikadata.api.modular.social.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.SocialWecomPermitOrderEntity;

/**
 * <p>
 * WeCom Service Provider Interface License Ordering Information
 * </p>
 */
@Mapper
public interface SocialWecomPermitOrderMapper extends BaseMapper<SocialWecomPermitOrderEntity> {

    /**
     * Get details according to the order number
     *
     * @param orderId License Order Number
     * @return Order details
     */
    SocialWecomPermitOrderEntity selectByOrderId(@Param("orderId") String orderId);

    /**
     * Query according to order status
     *
     * @param suiteId App Suite ID
     * @param authCorpId Authorized enterprise ID
     * @param orderStatuses Order status queried
     * @return List of qualified orders
     */
    List<SocialWecomPermitOrderEntity> selectByOrderStatuses(@Param("suiteId") String suiteId, @Param("authCorpId") String authCorpId,
            @Param("orderStatuses") List<Integer> orderStatuses);

}
