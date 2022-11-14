package com.vikadata.api.enterprise.social.service;

import com.vikadata.api.enterprise.social.model.DingTalkDaCreateTemplateDTO;
import com.vikadata.api.enterprise.social.model.DingTalkDaDTO;
import com.vikadata.api.enterprise.social.model.DingTalkDaTemplateUpdateRo;
import com.vikadata.api.template.dto.TemplateInfo;
import com.vikadata.social.dingtalk.model.DingTalkCreateApaasAppResponse;

/**
 * <p>
 * DingTalk Integration service interface
 * </p>
 */
public interface IDingTalkDaService {
    /**
     * Verify the callback signature of DingTalk
     *
     * @param dingTalkDaKey DingTalk key
     * @param corpId Enterprise ID
     * @param timestamp Time stamp
     * @param signature Signature passed
     */
    void validateSignature(String dingTalkDaKey, String corpId, String timestamp, String signature);

    /**
     * Get DingTalk signature
     *
     * @param dingTalkDaKey DingTalk key
     * @param corpId Enterprise ID
     * @param timestamp Time stamp
     * @return String|null
     */
    String getSignature(String dingTalkDaKey, String corpId, String timestamp);

    /**
     * DingTalk Use Template
     *
     * @param dingDingDaKey DingTalk key
     * @param authCorpId Authorized Enterprise ID
     * @param templateKey Template ID
     * @param opUserId Operator DingTalk User ID
     * @param appName DingTalk Application Name
     * @return mediaId
     */
    DingTalkDaCreateTemplateDTO dingTalkDaTemplateCreate(String dingDingDaKey, String authCorpId, String templateKey,
            String opUserId, String appName);

    /**
     *  Get the logo of the template
     *
     * @param suiteId Third party application suite ID
     * @param authCorpId Authorized Enterprise ID
     * @param template Template information
     * @param templateIconId Template application icon ID
     * @param bizAppId App ID
     * @param opUserId Operator DingTalk User ID
     * @return mediaId
     */
    DingTalkCreateApaasAppResponse createApssApp(String suiteId, String authCorpId,
            String bizAppId, TemplateInfo template, String templateIconId, String opUserId);

    /**
     *  Get the logo of the template
     *
     * @param suiteId Third party application suite ID
     * @param authCorpId Authorized Enterprise ID
     * @param templateId Template ID
     * @return mediaId
     */
    String dingTalkDaTemplateIconMediaId(String suiteId, String authCorpId, String templateId);

    /**
     * Reference template to user bound space
     *
     * @param templateInfo Template information
     * @param spaceId Space ID
     * @param opMemberId Action member ID
     * @param opUserId The vika user ID of the operator
     * @param nodeName Name of DingTalk application
     * @return Generated directory ID
     */
    String quoteTemplate(TemplateInfo templateInfo, String spaceId, Long opMemberId, Long opUserId, String nodeName);

    /**
     * Get DingTalk application information according to the biz App Id
     *
     * @param bizAppId DingTalk Application
     * @return DingTalkDaDTO
     */
    DingTalkDaDTO getDingTalkDaInfoByBizAppId(String bizAppId);

    /**
     * DingTalk Apply Updates
     *
     * @param dingTalkDaKey DingTalk key
     * @param updateRo Update parameters
     */
    void dingTalkDaTemplateUpdate(String dingTalkDaKey, DingTalkDaTemplateUpdateRo updateRo);

    /**
     * DingTalk Template application deletion
     *
     * @param bizAppId DingTalk appId corresponds to the nodeId created after our template reference
     * @param status DingTalk Application status 0 means deactivated, 1 means enabled, 2 means deleted, and 3 means unpublished
     */
    void dingTalkDaTemplateStatusUpdate(String bizAppId, Integer status);

    /**
     *  Get the logo of the template
     *
     * @param spaceId Space ID
     * @param nodeId File ID created after template reference
     * @param templateId Template ID
     * @param memberId Operation user member ID
     * @return mediaId
     */
    void handleTemplateQuoted(String spaceId, String nodeId, String templateId, Long memberId);
}
