package com.vikadata.api.modular.social.service;

import java.time.LocalDateTime;
import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.SocialWecomPermitOrderAccountEntity;
import com.vikadata.social.wecom.model.WxCpIsvPermitListOrderAccount.AccountList;

/**
 * <p>
 * WeCom service provider interface license account information
 * </p>
 */
public interface ISocialWecomPermitOrderAccountService extends IService<SocialWecomPermitOrderAccountEntity> {

    /**
     * Obtain interface license account information
     *
     * @param suiteId Application Suit ID
     * @param authCorpId Authorized enterprise ID
     * @param activeCodes Activation code list
     * @return Activate account information
     */
    List<SocialWecomPermitOrderAccountEntity> getByActiveCodes(String suiteId, String authCorpId, List<String> activeCodes);

    /**
     * Query activation code
     *
     * @param suiteId Application Suit ID
     * @param authCorpId Authorized enterprise ID
     * @param activateStatuses Account activation status. If it is blank, query all
     * @return All eligible activation codes
     */
    List<String> getActiveCodes(String suiteId, String authCorpId, List<Integer> activateStatuses);

    /**
     * Query activation code
     *
     * @param suiteId Application Suit ID
     * @param authCorpId Authorized enterprise ID
     * @param orderId Interface license order number
     * @param activateStatuses Account activation status. If it is blank, query all
     * @return All eligible activation codes
     */
    List<String> getActiveCodesByOrderId(String suiteId, String authCorpId, String orderId, List<Integer> activateStatuses);

    /**
     * Batch save activation code information
     *
     * @param suiteId Application Suit ID
     * @param authCorpId Authorized enterprise ID
     * @param orderId Interface license order number
     * @param allAccountList Activation code list
     */
    void batchSaveActiveCode(String suiteId, String authCorpId, String orderId, List<AccountList> allAccountList);

    /**
     * Query WeCom user ID
     *
     * @param suiteId Application Suit ID
     * @param authCorpId Authorized enterprise ID
     * @param activateStatuses Account activation status. If it is blank, query all
     * @return List of activated enterprise user IDs
     */
    List<String> getCpUserIdsByStatus(String suiteId, String authCorpId, List<Integer> activateStatuses);

    /**
     * Get all WeCom user IDs that need to be activated
     *
     * <p>
     * The activated or expired space station does not need to be activated
     * </p>
     *
     * @param suiteId Application Suit ID
     * @param authCorpId Authorized enterprise ID
     * @param spaceId Space ID of the member
     * @return List of WeCom user IDs to be activated
     */
    List<String> getNeedActivateCpUserIds(String suiteId, String authCorpId, String spaceId);

    /**
     * Obtain all accounts that need to be renewed
     *
     * <p>
     * The activated or expired space may need to be renewed
     * </p>
     *
     * @param suiteId Application Suit ID
     * @param authCorpId Authorized enterprise ID
     * @param spaceId Space ID of the member
     * @param expireTime Specified time
     * @return Account to be renewed
     */
    List<SocialWecomPermitOrderAccountEntity> getNeedRenewAccounts(String suiteId, String authCorpId, String spaceId, LocalDateTime expireTime);

    /**
     * Batch change activation status
     *
     * @param suiteId Application Suit ID
     * @param authCorpId Authorized enterprise ID
     * @param activeCodes Activation code list
     * @param activeStatus Status after change
     * @return Number of changes
     */
    int updateActiveStatusByActiveCodes(String suiteId, String authCorpId, List<String> activeCodes, Integer activeStatus);

}
