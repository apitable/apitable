package com.vikadata.api.modular.social.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.SocialWecomPermitOrderEntity;

/**
 * <p>
 * 企微服务商接口许可下单信息
 * </p>
 * @author 刘斌华
 * @date 2022-06-23 18:36:14
 */
@Mapper
public interface SocialWecomPermitOrderMapper extends BaseMapper<SocialWecomPermitOrderEntity> {

    /**
     * 根据订单号获取详情
     *
     * @param orderId 许可订单号
     * @return 订单详情
     * @author 刘斌华
     * @date 2022-06-27 17:55:42
     */
    SocialWecomPermitOrderEntity selectByOrderId(@Param("orderId") String orderId);

    /**
     * 根据订单状态查询
     *
     * @param suiteId 应用套件 ID
     * @param authCorpId 授权的企业 ID
     * @param orderStatuses 查询的订单状态
     * @return 符合条件的订单列表
     * @author 刘斌华
     * @date 2022-07-29 18:45:00
     */
    List<SocialWecomPermitOrderEntity> selectByOrderStatuses(@Param("suiteId") String suiteId, @Param("authCorpId") String authCorpId,
            @Param("orderStatuses") List<Integer> orderStatuses);

}
