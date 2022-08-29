package com.vikadata.api.modular.audit.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.vikadata.api.enums.exception.DatabaseException;
import com.vikadata.api.modular.audit.mapper.AuditInviteRecordMapper;
import com.vikadata.api.modular.audit.service.IAuditInviteRecordService;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.AuditInviteRecordEntity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 审计-邀请记录 服务实现类
 * </p>
 *
 * @author Chambers
 * @since 2020-03-25
 */
@Slf4j
@Service
public class AuditInviteRecordServiceImpl extends ServiceImpl<AuditInviteRecordMapper, AuditInviteRecordEntity> implements IAuditInviteRecordService {

    @Override
    public void save(String spaceId, Long inviter, Long accepter, Integer type) {
        log.info("新增记录");
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
