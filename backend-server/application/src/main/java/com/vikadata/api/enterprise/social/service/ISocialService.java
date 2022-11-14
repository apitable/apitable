package com.vikadata.api.enterprise.social.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Set;

import com.vikadata.api.enterprise.social.model.DingTalkContactDTO;
import com.vikadata.api.enterprise.social.model.FeishuTenantDetailVO;
import com.vikadata.api.enterprise.social.model.TenantDetailVO;
import com.vikadata.api.enterprise.social.model.TenantDetailVO.Space;

/**
 * Third party integration service interface
 */
public interface ISocialService {

    /**
     * Users activate space members
     * 
     * @param userId User ID
     * @param spaceId Space ID
     * @param openId openId
     * @param mobile mobile
     */
    Long activeSpaceByMobile(Long userId, String spaceId, String openId, String mobile);

    /**
     * Verify whether the user is the tenant's administrator
     * 
     * @param userId User ID
     * @param tenantKey Tenant ID
     */
    void checkUserIfInTenant(Long userId, String appId, String tenantKey);

    /**
     * Obtain the spatial information of the enterprise
     *
     * @param appId Application ID
     * @param tenantKey Lark Enterprise ID
     * @return FeishuTenantInfoVO
     */
    FeishuTenantDetailVO getFeishuTenantInfo(String appId, String tenantKey);

    /**
     * Obtain the spatial information of the enterprise
     *
     * @param tenantKey Enterprise ID
     * @param appId Application ID
     * @return TenantDetailVO
     */
    TenantDetailVO getTenantInfo(String tenantKey, String appId);

    /**
     * Obtain the spatial information of the enterprise
     *
     * @param tenantKey Enterprise ID
     * @param appId Application ID
     * @return List<Space>
     */
    List<Space> getTenantBindSpaceInfo(String tenantKey, String appId);

    /**
     * Replace the master administrator
     *
     * @param spaceId Space ID
     * @param memberId Member ID
     */
    void changeMainAdmin(String spaceId, Long memberId);

    /**
     * Get forbidden resources for space binding integration
     *
     * @param spaceId Space ID
     * @return Space permission resource prohibition list
     */
    List<String> getSocialDisableRoleGroupCode(String spaceId);

    /**
     * DingTalk binding space and synchronous address book
     *
     * @param agentId Enterprise application unique ID
     * @param spaceId    Space ID
     * @param operatorOpenId The open ID of the operation user
     * @param contact Application visible range
     * @return DingTalk User ID of successful binding
     */
    Set<String> connectDingTalkAgentAppContact(String spaceId, String agentId, String operatorOpenId,
            LinkedHashMap<Long, DingTalkContactDTO> contact);
}
