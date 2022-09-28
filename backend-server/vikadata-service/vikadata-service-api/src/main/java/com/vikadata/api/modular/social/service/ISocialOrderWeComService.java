package com.vikadata.api.modular.social.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;
import me.chanjar.weixin.common.error.WxErrorException;

import com.vikadata.entity.SocialOrderWecomEntity;

/**
 * <p>
 * 第三方平台集成 - 企业微信第三方服务商应用付费订单信息
 * </p>
 * @author 刘斌华
 * @date 2022-04-26 15:09:51
 */
@Deprecated
public interface ISocialOrderWeComService extends IService<SocialOrderWecomEntity> {

    /**
     * 保存新的企微订单信息
     *
     * @param suiteId 应用套件 ID
     * @param orderId 企微订单号
     * @return 订单信息
     * @throws WxErrorException 企业微信接口异常
     * @author 刘斌华
     * @date 2022-04-26 15:30:26
     */
    SocialOrderWecomEntity createOrder(String suiteId, String orderId) throws WxErrorException;

    /**
     * 从企微获取并更新最新的订单信息
     *
     * @param suiteId 应用套件 ID
     * @param orderId 企微订单号
     * @return 更新后的订单信息
     * @throws WxErrorException 企业微信接口异常
     * @author 刘斌华
     * @date 2022-05-06 11:04:24
     */
    SocialOrderWecomEntity refreshOrder(String suiteId, String orderId) throws WxErrorException;

    /**
     * 查询所有的订单
     *
     * @param suiteId 应用套件 ID
     * @param paidCorpId 授权的企业 ID
     * @param orderStatuses 查询的订单状态。可以为空
     * @return 符合条件的所有订单
     * @author 刘斌华
     * @date 2022-08-18 17:52:27
     */
    List<SocialOrderWecomEntity> getAllOrders(String suiteId, String paidCorpId, List<Integer> orderStatuses);

    /**
     * 获取租户第一个支付成功的订单
     *
     * @param suiteId 应用套件 ID
     * @param paidCorpId 授权的企业 ID
     * @return 租户的第一个支付成功的订单
     * @author 刘斌华
     * @date 2022-05-05 18:27:42
     */
    SocialOrderWecomEntity getFirstPaidOrder(String suiteId, String paidCorpId);

    /**
     * 获取租户最后一个支付成功的订单
     *
     * @param suiteId 应用套件 ID
     * @param paidCorpId 授权的企业 ID
     * @return 租户的最后一个支付成功的订单
     * @author 刘斌华
     * @date 2022-05-06 11:51:19
     */
    SocialOrderWecomEntity getLastPaidOrder(String suiteId, String paidCorpId);

}
