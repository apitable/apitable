package com.vikadata.api.space.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.base.enums.DatabaseException;
import com.vikadata.api.space.mapper.AuditInviteRecordMapper;
import com.vikadata.api.space.service.IAuditInviteRecordService;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.AuditInviteRecordEntity;

import org.springframework.stereotype.Service;

/**
 * <p>
 * Audit Invite Record Service Implement Class
 * </p>
 */
@Slf4j
@Service
public class AuditInviteRecordServiceImpl extends ServiceImpl<AuditInviteRecordMapper, AuditInviteRecordEntity> implements IAuditInviteRecordService {

    @Override
    public void save(String spaceId, Long inviter, Long accepter, Integer type) {
        AuditInviteRecordEntity entity = AuditInviteRecordEntity.builder()
            .spaceId(spaceId)
            .inviter(inviter)
            .accepter(accepter)
            .type(type)
            .build();
        boolean flag = this.save(entity);
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
    }
}
