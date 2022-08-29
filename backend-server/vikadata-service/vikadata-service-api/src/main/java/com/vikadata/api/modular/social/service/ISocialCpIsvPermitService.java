package com.vikadata.api.modular.social.service;

import java.time.LocalDateTime;
import java.util.List;

import com.vikadata.entity.SocialWecomPermitOrderEntity;

/**
 * <p>
 * 企微服务商接口许可
 * </p>
 * @author 刘斌华
 * @date 2022-06-23 17:29:18
 */
public interface ISocialCpIsvPermitService {

    /**
     * 为企业创建新的订单
     *
     * @param spaceId 要购买接口许可的空间站 ID
     * @param durationMonths 购买的月数，每个月按照31天计算。最多购买36个月。(若企业为服务商测试企业，最多购买1个月)
     * @return 订单信息
     * @author 刘斌华
     * @date 2022-06-23 17:57:58
     */
    SocialWecomPermitOrderEntity createNewOrder(String spaceId, Integer durationMonths);

    /**
     * 激活接口许可订单中的账号
     *
     * @param orderId 接口许可订单号
     * @author 刘斌华
     * @date 2022-06-27 17:51:11
     */
    void activateOrder(String orderId);

    /**
     * 为指定的企微用户续期
     *
     * @param spaceId 空间站 ID
     * @param cpUserIds 要续期的企微用户 ID 列表
     * @param durationMonths 续期的月数，每个月按照31天计算。最多购买36个月。(若企业为服务商测试企业，每次续期只能续期1个月)
     * @return 订单信息
     * @author 刘斌华
     * @date 2022-07-04 15:28:07
     */
    SocialWecomPermitOrderEntity renewalCpUser(String spaceId, List<String> cpUserIds, Integer durationMonths);

    /**
     * 确认订单及其企业下所有账号的最新信息
     *
     * @param orderId 接口许可订单号
     * @author 刘斌华
     * @date 2022-07-07 18:34:35
     */
    void ensureOrderAndAllActiveCodes(String orderId);

    /**
     * 计算需要新购账号的数量
     *
     * @param suiteId 应用套件 ID
     * @param authCorpId 授权的企业 ID
     * @param spaceId 空间站 ID
     * @return 需要新购账号的数量
     * @author 刘斌华
     * @date 2022-07-13 18:54:40
     */
    int calcNewAccountCount(String suiteId, String authCorpId, String spaceId);

    /**
     * 确认接口许可订单的最新信息，如果需要则更新
     *
     * @param orderId 接口许可订单号
     * @return 最新的接口许可订单信息
     * @author 刘斌华
     * @date 2022-07-20 14:52:45
     */
    SocialWecomPermitOrderEntity ensureOrder(String orderId);

    /**
     * 确认企业下所有账号的最新信息
     *
     * @param suiteId 应用套件 ID
     * @param authCorpId 授权的企业 ID
     * @author 刘斌华
     * @date 2022-07-20 14:52:45
     */
    void ensureAllActiveCodes(String suiteId, String authCorpId);

    /**
     * 自动处理接口许可下单
     *
     * <p>
     * 新购、续期、或者忽略
     * </p>
     *
     * @param suiteId 应用套件 ID
     * @param authCorpId 授权的企业 ID
     * @param spaceId 空间站 ID
     * @author 刘斌华
     * @date 2022-07-13 17:25:55
     */
    void autoProcessPermitOrder(String suiteId, String authCorpId, String spaceId);

    /**
     * 创建需要新购或者续期的订单
     *
     * @param suiteId 应用套件 ID
     * @param authCorpId 授权的企业 ID
     * @param spaceId 空间站 ID
     * @param expireTime 付费订阅的过期时间
     * @return 是否需要新购或者续期
     * @author 刘斌华
     * @date 2022-07-29 17:41:22
     */
    boolean createPermitOrder(String suiteId, String authCorpId, String spaceId, LocalDateTime expireTime);

    /**
     * 发送新购订单信息到群机器人
     *
     * @param suiteId 应用套件 ID
     * @param authCorpId 授权的企业 ID
     * @param spaceId 空间站 ID。已下单则不需要
     * @param orderId 订单编号。不为空发送已下单消息，为空则发送手动下单消息
     * @param durationMonths 购买的月数。已下单则不需要
     * @return 是否发送成功
     * @author 刘斌华
     * @date 2022-07-22 14:25:50
     */
    boolean sendNewWebhook(String suiteId, String authCorpId, String spaceId, String orderId, Integer durationMonths);

    /**
     * 发送续期订单信息到群机器人
     *
     * @param suiteId 应用套件 ID
     * @param authCorpId 授权的企业 ID
     * @param spaceId 空间站 ID。已下单则不需要
     * @param orderId 订单编号。不为空发送已下单消息，为空则发送手动下单消息
     * @return 是否发送成功
     * @author 刘斌华
     * @date 2022-07-22 14:25:50
     */
    boolean sendRenewWebhook(String suiteId, String authCorpId, String spaceId, String orderId);

    /**
     * 发送退款信息到群机器人
     *
     * @param suiteId 应用套件 ID
     * @param authCorpId 授权的企业 ID
     * @return 是否发送成功
     * @author 刘斌华
     * @date 2022-07-22 14:25:50
     */
    boolean sendRefundWebhook(String suiteId, String authCorpId);

}
