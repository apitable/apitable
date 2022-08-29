package com.vikadata.api.modular.social.service;

/**
 * 钉钉事件服务接口
 *
 * @author Shawn Deng
 * @date 2020-12-18 00:47:41
 */
public interface IDingTalkEventService {
    /**
     * 钉钉用户状态变更 - 员工的激活
     *
     * @param agentId  钉钉应用企业标识
     * @param tenantKey 企业标识
     * @param userOpenId 钉钉应用用户对应用的唯一标识
     * @author zoe zheng
     * @date 2021/5/13 5:42 下午
     */
    void handleUserActiveOrg(String agentId, String tenantKey, String userOpenId);

    /**
     * 钉钉用户状态变更 - 员工离职
     *
     * @param agentId  钉钉应用企业标识
     * @param tenantKey 企业标识
     * @param userOpenId 钉钉应用用户对应用的唯一标识
     * @return
     * @author zoe zheng
     * @date 2021/5/17 10:37 上午
     */
    void handUserLeaveOrg(String agentId, String tenantKey, String userOpenId);

    /**
     * 用户状态变更 - 通讯录用户更改
     *
     * @param agentId  钉钉应用agentId
     * @param tenantKey 企业标识
     * @param userOpenId 钉钉应用用户对应用的唯一标识
     * @author zoe zheng
     * @date 2021/5/13 5:42 下午
     */
    void handleUserModifyOrg(String agentId, String tenantKey, String userOpenId);

    /**
     * 处理钉钉新增部门同步通讯录
     *
     * @param agentId  钉钉应用agentId
     * @param tenantKey 企业标识
     * @param openDepartmentId 应用的部门ID
     * @author zoe zheng
     * @date 2020/12/18 13:27
     */
    void handleOrgDeptCreate(String agentId, String tenantKey, Long openDepartmentId);

    /**
     * 处理钉钉修改部门
     *
     * @param agentId  钉钉应用agentId
     * @param tenantKey 企业标识
     * @param departmentId 应用的部门ID
     * @author zoe zheng
     * @date 2021/5/17 11:53 上午
     */
    void handleOrgDeptModify(String agentId, String tenantKey, Long departmentId);

    /**
     * 处理钉钉删除部门
     *
     * @param agentId  钉钉应用agentId
     * @param tenantKey 企业标识
     * @param departmentId 应用的部门ID
     * @author zoe zheng
     * @date 2021/5/17 11:53 上午
     */
    void handleOrgDeptRemove(String agentId, String tenantKey, Long departmentId);
}
