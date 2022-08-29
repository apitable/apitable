package com.vikadata.api.modular.social.service;

import java.time.LocalDateTime;
import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.SocialWecomPermitOrderAccountEntity;
import com.vikadata.social.wecom.model.WxCpIsvPermitListOrderAccount.AccountList;

/**
 * <p>
 * 企微服务商接口许可账号信息
 * </p>
 * @author 刘斌华
 * @date 2022-06-27 18:48:31
 */
public interface ISocialWecomPermitOrderAccountService extends IService<SocialWecomPermitOrderAccountEntity> {

    /**
     * 获取接口许可账号信息
     *
     * @param suiteId 应用套件 ID
     * @param authCorpId 授权的企业 ID
     * @param activeCodes 激活码列表
     * @return 激活账号信息
     * @author 刘斌华
     * @date 2022-06-30 14:01:15
     */
    List<SocialWecomPermitOrderAccountEntity> getByActiveCodes(String suiteId, String authCorpId, List<String> activeCodes);

    /**
     * 查询激活码
     *
     * @param suiteId 应用套件 ID
     * @param authCorpId 授权的企业 ID
     * @param activateStatuses 账号激活状态。为空则查询全部
     * @return 符合条件的全部激活码
     * @author 刘斌华
     * @date 2022-06-29 18:10:34
     */
    List<String> getActiveCodes(String suiteId, String authCorpId, List<Integer> activateStatuses);

    /**
     * 查询激活码
     *
     * @param suiteId 应用套件 ID
     * @param authCorpId 授权的企业 ID
     * @param orderId 接口许可订单号
     * @param activateStatuses 账号激活状态。为空则查询全部
     * @return 符合条件的全部激活码
     * @author 刘斌华
     * @date 2022-06-29 18:10:34
     */
    List<String> getActiveCodesByOrderId(String suiteId, String authCorpId, String orderId, List<Integer> activateStatuses);

    /**
     * 批量保存激活码信息
     *
     * @param suiteId 应用套件 ID
     * @param authCorpId 授权的企业 ID
     * @param orderId 接口许可订单号
     * @param allAccountList 激活码列表
     * @author 刘斌华
     * @date 2022-06-29 18:08:41
     */
    void batchSaveActiveCode(String suiteId, String authCorpId, String orderId, List<AccountList> allAccountList);

    /**
     * 查询企微用户 ID
     *
     * @param suiteId 应用套件 ID
     * @param authCorpId 授权的企业 ID
     * @param activateStatuses 账号激活状态。为空则查询全部
     * @return 已激活的企微用户 ID 列表
     * @author 刘斌华
     * @date 2022-07-01 18:31:27
     */
    List<String> getCpUserIdsByStatus(String suiteId, String authCorpId, List<Integer> activateStatuses);

    /**
     * 获取所有需要激活的企微用户 ID
     *
     * <p>
     * 空间站中已激活或者已过期的不需要激活
     * </p>
     *
     * @param suiteId 应用套件 ID
     * @param authCorpId 授权的企业 ID
     * @param spaceId 成员所在的空间站 ID
     * @return 待激活的企微用户 ID 列表
     * @author 刘斌华
     * @date 2022-07-02 12:19:01
     */
    List<String> getNeedActivateCpUserIds(String suiteId, String authCorpId, String spaceId);

    /**
     * 获取所有需要续期的账号
     *
     * <p>
     * 空间站中已激活或者已过期的可能需要续期
     * </p>
     *
     * @param suiteId 应用套件 ID
     * @param authCorpId 授权的企业 ID
     * @param spaceId 成员所在的空间站 ID
     * @param expireTime 指定的时间
     * @return 需要续期的账号
     * @author 刘斌华
     * @date 2022-07-28 14:56:33
     */
    List<SocialWecomPermitOrderAccountEntity> getNeedRenewAccounts(String suiteId, String authCorpId, String spaceId, LocalDateTime expireTime);

    /**
     * 批量变更激活状态
     *
     * @param suiteId 应用套件 ID
     * @param authCorpId 授权的企业 ID
     * @param activeCodes 激活码列表
     * @param activeStatus 变更后的状态
     * @return 更改的数量
     * @author 刘斌华
     * @date 2022-06-30 11:20:59
     */
    int updateActiveStatusByActiveCodes(String suiteId, String authCorpId, List<String> activeCodes, Integer activeStatus);

}
