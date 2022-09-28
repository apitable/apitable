package com.vikadata.api.modular.social.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.SocialOrderWecomEntity;

/**
 * <p>
 * 第三方平台集成 - 企业微信第三方服务商应用付费订单信息
 * </p>
 * @author 刘斌华
 * @date 2022-04-26 15:08:42
 */
@Mapper
public interface SocialOrderWeComMapper extends BaseMapper<SocialOrderWecomEntity> {

    /**
     * 通过企微订单号查询
     *
     * @param orderId 企微订单号
     * @return 订单信息
     * @author 刘斌华
     * @date 2022-05-06 11:44:01
     */
    SocialOrderWecomEntity selectByOrderId(@Param("orderId") String orderId);

    /**
     * 获取租户第一个支付成功的订单
     *
     * @param suiteId 应用套件 ID
     * @param paidCorpId 授权的企业 ID
     * @return 租户的第一个支付成功的订单
     * @author 刘斌华
     * @date 2022-05-05 18:27:42
     */
    SocialOrderWecomEntity selectFirstPaidOrder(@Param("suiteId") String suiteId, @Param("paidCorpId") String paidCorpId);

    /**
     * 获取租户最后一个支付成功的订单
     *
     * @param suiteId 应用套件 ID
     * @param paidCorpId 授权的企业 ID
     * @return 租户的最后一个支付成功的订单
     * @author 刘斌华
     * @date 2022-05-06 11:51:19
     */
    SocialOrderWecomEntity selectLastPaidOrder(@Param("suiteId") String suiteId, @Param("paidCorpId") String paidCorpId);

}
