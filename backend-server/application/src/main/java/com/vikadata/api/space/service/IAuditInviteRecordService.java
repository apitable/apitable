package com.vikadata.api.space.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.vikadata.entity.AuditInviteRecordEntity;

/**
 * <p>
 * Audit Invite Record Service
 * </p>
 */
public interface IAuditInviteRecordService extends IService<AuditInviteRecordEntity> {

    /**
     * Save audit invite record
     *
     * @param spaceId  space id
     * @param inviter  member id of inviter
     * @param accepter member id of accepter
     * @param type     invite type
     */
    void save(String spaceId, Long inviter, Long accepter, Integer type);
}
