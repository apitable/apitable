package com.vikadata.api.component.audit;

import javax.annotation.Resource;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.modular.audit.mapper.AuditSpaceMapper;
import com.vikadata.entity.AuditSpaceEntity;

import org.springframework.stereotype.Component;

/**
 * <p>
 * 空间审计记录
 * 隔离
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/3/30 17:37
 */
@Component
@Slf4j
public class SpaceAuditService extends AbstractAuditFactory {

    @Resource
    private AuditSpaceMapper auditSpaceMapper;

    @Override
    protected void create(String action) {
        AuditSpaceEntity entity = new AuditSpaceEntity();
        entity.setUserId(userId);
        entity.setSpaceId(spaceId);
        entity.setMemberId(memberId);
        entity.setAction(action);
        AbstractAuditField auditField = new SpaceAuditField();
        String info = AuditHelper.fieldFill(this, action, auditField);
        entity.setInfo(info);
        entity.setIpAddress(ip);
        auditSpaceMapper.insert(entity);
    }
}
