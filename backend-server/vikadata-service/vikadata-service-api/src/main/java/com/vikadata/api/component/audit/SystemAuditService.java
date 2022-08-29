package com.vikadata.api.component.audit;

import javax.annotation.Resource;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.modular.audit.mapper.AuditSystemMapper;
import com.vikadata.entity.AuditSystemEntity;

import org.springframework.stereotype.Component;

/**
 * <p>
 *
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/3/30 17:37
 */
@Component
@Slf4j
public class SystemAuditService extends AbstractAuditFactory {

    @Resource
    private AuditSystemMapper auditSystemMapper;

    @Override
    protected void create(String action) {
        AuditSystemEntity entity = new AuditSystemEntity();
        entity.setUserId(userId);
        entity.setAction(action);
        AbstractAuditField auditField = new SystemAuditField();
        String info = AuditHelper.fieldFill(this, action, auditField);
        entity.setInfo(info);
        entity.setIpAddress(ip);
        auditSystemMapper.insert(entity);
    }
}
