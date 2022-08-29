package com.vikadata.api.modular.audit.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.vikadata.entity.AuditInviteRecordEntity;

/**
 * <p>
 * 审计-邀请记录 服务类
 * </p>
 *
 * @author Chambers
 * @since 2020-03-25
 */
public interface IAuditInviteRecordService extends IService<AuditInviteRecordEntity> {

    /**
     * 新增记录
     *
     * @param spaceId  空间ID
     * @param inviter  邀请者成员ID
     * @param accepter 受邀者成员ID
     * @param type     受邀类型
     * @author Chambers
     * @date 2020/3/25
     */
    void save(String spaceId, Long inviter, Long accepter, Integer type);
}
