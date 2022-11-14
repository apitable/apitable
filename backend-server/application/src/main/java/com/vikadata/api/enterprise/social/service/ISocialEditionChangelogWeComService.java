package com.vikadata.api.enterprise.social.service;

import com.baomidou.mybatisplus.extension.service.IService;
import me.chanjar.weixin.common.error.WxErrorException;

import com.vikadata.entity.SocialEditionChangelogWecomEntity;
import com.vikadata.social.wecom.model.WxCpIsvAuthInfo.EditionInfo;

/**
 * <p>
 * Third party platform integration - WeCom third-party service provider application version change information
 * </p>
 */
public interface ISocialEditionChangelogWeComService extends IService<SocialEditionChangelogWecomEntity> {

    /**
     * Get and save new application version information
     *
     * @param suiteId App Suite ID
     * @param paidCorpId Authorized enterprise ID paid
     * @return Application version information
     * @throws WxErrorException WeCom interface exception
     */
    SocialEditionChangelogWecomEntity createChangelog(String suiteId, String paidCorpId) throws WxErrorException;

    /**
     * Save the new Application version information
     *
     * @param suiteId App Suite ID
     * @param paidCorpId Authorized enterprise ID paid
     * @param fetchEditionInfo Get the changed enterprise application version information
     * @return Application version information
     * @throws WxErrorException WeCom interface exception
     */
    SocialEditionChangelogWecomEntity createChangelog(String suiteId, String paidCorpId, boolean fetchEditionInfo) throws WxErrorException;

    /**
     * Save the new Application version information
     *
     * @param suiteId App Suite ID
     * @param paidCorpId Authorized enterprise ID paid
     * @param editionInfoAgent WeCom Application version information
     * @return Application version information
     */
    SocialEditionChangelogWecomEntity createChangelog(String suiteId, String paidCorpId, EditionInfo.Agent editionInfoAgent);

    /**
     * Get the latest WeCom version information
     *
     * @param suiteId App Suite ID
     * @param paidCorpId Authorized enterprise ID paid
     * @return Application version information
     */
    SocialEditionChangelogWecomEntity getLastChangeLog(String suiteId, String paidCorpId);

}
