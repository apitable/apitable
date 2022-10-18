package com.vikadata.api.modular.finance.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.SocialWecomOrderEntity;

/**
 * <p>
 * 订阅计费系统-企微商店渠道订单
 * </p>
 * @author 刘斌华
 * @date 2022-08-18 18:44:00
 */
@Mapper
public interface SocialWecomOrderMapper extends BaseMapper<SocialWecomOrderEntity> {

    /**
     * 查询所有的订单
     *
     * @param suiteId 应用套件 ID
     * @param paidCorpId 授权的企业 ID
     * @param orderStatuses 查询的订单状态。可以为空
     * @return 符合条件的所有订单
     * @author 刘斌华
     * @date 2022-08-22 16:03:12
     */
    List<SocialWecomOrderEntity> selectAllOrders(@Param("suiteId") String suiteId, @Param("paidCorpId") String paidCorpId,
            @Param("orderStatuses") List<Integer> orderStatuses);

    /**
     * 查询订单信息
     *
     * @param orderId 企微订单号
     * @return 订单信息
     * @author 刘斌华
     * @date 2022-08-24 11:40:29
     */
    SocialWecomOrderEntity selectByOrderId(@Param("orderId") String orderId);

    /**
     * Get first paid order
     *
     * @param suiteId Wecom isv suite ID
     * @param paidCorpId Paid corporation ID
     * @return Tenant's first paid order
     * @author Codeman
     * @date 2022-08-25 17:01:44
     */
    SocialWecomOrderEntity selectFirstPaidOrder(@Param("suiteId") String suiteId, @Param("paidCorpId") String paidCorpId);

    /**
     * 获取租户最后一个支付成功的订单
     *
     * @param suiteId 应用套件 ID
     * @param paidCorpId 授权的企业 ID
     * @return 租户的最后一个支付成功的订单
     * @author 刘斌华
     * @date 2022-08-25 17:01:44
     */
    SocialWecomOrderEntity selectLastPaidOrder(@Param("suiteId") String suiteId, @Param("paidCorpId") String paidCorpId);

}
