package com.vikadata.api.component.audit;

/**
 * <p>
 *
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/3/30 20:13
 */
public interface IAuditFieldFactory {

    /**
     * 根据用户ID获取用户名称
     *
     * @param userId 用户ID
     * @return 用户名称
     * @author Shawn Deng
     * @date 2020/3/30 20:23
     */
    String getUserNameByUserId(Long userId);

    /**
     * 根据空间ID获取空间名称
     *
     * @param spaceId 空间ID
     * @return 空间名称
     * @author Shawn Deng
     * @date 2020/3/30 20:17
     */
    String getSpaceNameBySpaceId(String spaceId);

    /**
     * 根据成员ID获取成员名称
     *
     * @param memberId 成员ID
     * @return 成员名称
     * @author Shawn Deng
     * @date 2020/3/30 20:13
     */
    String getMemberNameByMemberId(Long memberId);

    /**
     * 根据节点ID获取节点名称
     *
     * @param nodeId 节点ID
     * @return 节点名称
     * @author Shawn Deng
     * @date 2020/3/31 11:17
     */
    String getNodeNameByNodeId(String nodeId);

    /**
     * 根据模板ID 获取模板名称
     *
     * @param templateId 模板ID
     * @return 模板名称
     * @author Chambers
     * @date 2021/7/22
     */
    String getTemplateNameByTemplateId(String templateId);
}
