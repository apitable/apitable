package com.vikadata.api.component.audit;

import com.vikadata.api.annotation.AuditAction;

/**
 * <p>
 *
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/3/30 17:38
 */
public interface AuditService {

    /**
     * 创建审计记录并保存
     *
     * @param userId    用户ID
     * @param action    审计动作
     * @param infoField 审计信息字段
     * @param spaceId   空间ID
     * @param result    返回结果
     * @author Shawn Deng
     * @date 2020/3/31 15:54
     */
    void createAndSave(Long userId, AuditAction action, AuditInfoField infoField, String spaceId, Object result);
}
