package com.vikadata.api.modular.social.service;

import com.baomidou.mybatisplus.extension.service.IService;
import me.chanjar.weixin.common.error.WxErrorException;

import com.vikadata.entity.SocialEditionChangelogWecomEntity;
import com.vikadata.social.wecom.model.WxCpIsvAuthInfo.EditionInfo;

/**
 * <p>
 * 第三方平台集成 - 企业微信第三方服务商应用版本变更信息
 * </p>
 * @author 刘斌华
 * @date 2022-04-28 10:34:01
 */
public interface ISocialEditionChangelogWeComService extends IService<SocialEditionChangelogWecomEntity> {

    /**
     * 获取并保存新的应用版本信息
     *
     * @param suiteId 应用套件 ID
     * @param paidCorpId 支付的授权企业 ID
     * @return 应用版本信息
     * @throws WxErrorException 企业微信接口异常
     * @author 刘斌华
     * @date 2022-04-28 11:55:06
     */
    SocialEditionChangelogWecomEntity createChangelog(String suiteId, String paidCorpId) throws WxErrorException;

    /**
     * 保存新的应用版本信息
     *
     * @param suiteId 应用套件 ID
     * @param paidCorpId 支付的授权企业 ID
     * @param fetchEditionInfo 是否获取变更后的企微应用版本信息
     * @return 应用版本信息
     * @throws WxErrorException 企业微信接口异常
     * @author 刘斌华
     * @date 2022-04-28 11:55:06
     */
    SocialEditionChangelogWecomEntity createChangelog(String suiteId, String paidCorpId, boolean fetchEditionInfo) throws WxErrorException;

    /**
     * 保存新的应用版本信息
     *
     * @param suiteId 应用套件 ID
     * @param paidCorpId 支付的授权企业 ID
     * @param editionInfoAgent 企微的应用版本信息
     * @return 应用版本信息
     * @author 刘斌华
     * @date 2022-05-06 18:49:29
     */
    SocialEditionChangelogWecomEntity createChangelog(String suiteId, String paidCorpId, EditionInfo.Agent editionInfoAgent);

    /**
     * 获取最近一条的企微版本信息
     *
     * @param suiteId 应用套件 ID
     * @param paidCorpId 支付的授权企业 ID
     * @return 应用版本信息
     * @author 刘斌华
     * @date 2022-05-06 18:57:33
     */
    SocialEditionChangelogWecomEntity getLastChangeLog(String suiteId, String paidCorpId);

}
