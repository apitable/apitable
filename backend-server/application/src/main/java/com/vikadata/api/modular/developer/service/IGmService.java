package com.vikadata.api.modular.developer.service;

import java.util.List;

import com.vikadata.api.enums.developer.GmAction;
import com.vikadata.api.enums.space.SpaceCertification;
import com.vikadata.integration.vika.model.UserContactInfo;

public interface IGmService {

    /**
     * valid permission
     *
     * @param userId    userId
     * @param action    action
     */
    void validPermission(Long userId, GmAction action);

    /**
     * update the gm permission configuration
     *
     * @param userId    userId
     * @param dstId     config datasheet id
     */
    void updateGmPermissionConfig(Long userId, String dstId);

    /**
     * space enterprise certification
     *
     * @param spaceId spaceId
     * @param operatorUserUuid operatorUserUuid
     * @param certification certification level
     */
    void spaceCertification(String spaceId, String operatorUserUuid, SpaceCertification certification);

    /**
     * handle Feishu event
     * @param tenantId tenant
     */
    void handleFeishuEvent(String tenantId);

    /**
     * query and write back user's mobile phone and email by userId
     *
     * @param host        host
     * @param datasheetId datasheet's id
     * @param viewId      view's id
     * @param token       api token
     */
    void queryAndWriteBackUserContactInfo(String host, String datasheetId, String viewId, String token);

    /**
     * query user's mobile phone and email by userId
     *
     * @param userContactInfos user's contact info
     */
    void getUserPhoneAndEmailByUserId(List<UserContactInfo> userContactInfos);
}
