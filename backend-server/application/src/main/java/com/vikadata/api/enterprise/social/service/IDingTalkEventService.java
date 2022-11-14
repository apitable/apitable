package com.vikadata.api.enterprise.social.service;

/**
 * DingTalk Event Service Interface
 */
public interface IDingTalkEventService {
    /**
     * DingTalk User Status Change - Employee Activation
     *
     * @param agentId  DingTalk Apply enterprise identity
     * @param tenantKey Enterprise ID
     * @param userOpenId DingTalk Application user's unique identification of the application
     */
    void handleUserActiveOrg(String agentId, String tenantKey, String userOpenId);

    /**
     * DingTalk User Status Change - Employee Resignation
     *
     * @param agentId  DingTalk Apply enterprise identity
     * @param tenantKey Enterprise ID
     * @param userOpenId DingTalk Application user's unique identification of the application
     */
    void handUserLeaveOrg(String agentId, String tenantKey, String userOpenId);

    /**
     * User status change - address book user change
     *
     * @param agentId  DingTalk Application agent Id
     * @param tenantKey Enterprise ID
     * @param userOpenId DingTalk Application user's unique identification of the application
     */
    void handleUserModifyOrg(String agentId, String tenantKey, String userOpenId);

    /**
     * Processing the synchronous address book of the new department of DingTalk
     *
     * @param agentId  DingTalk Application agent Id
     * @param tenantKey Enterprise ID
     * @param openDepartmentId Applied department ID
     */
    void handleOrgDeptCreate(String agentId, String tenantKey, Long openDepartmentId);

    /**
     * Processing DingTalk modification department
     *
     * @param agentId  DingTalk Application agentId
     * @param tenantKey Enterprise ID
     * @param departmentId Applied department ID
     */
    void handleOrgDeptModify(String agentId, String tenantKey, Long departmentId);

    /**
     * Processing DingTalk to delete department
     *
     * @param agentId  DingTalk Application agentId
     * @param tenantKey Enterprise ID
     * @param departmentId Applied department ID
     */
    void handleOrgDeptRemove(String agentId, String tenantKey, Long departmentId);
}
