package com.vikadata.api.component.audit;

import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * <p>
 * 审计服务管理器
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/3/30 17:35
 */
@Component
public class AuditServiceManage {

    private final Map<String, AuditService> auditServices;

    public AuditServiceManage(Map<String, AuditService> auditServices) {
        this.auditServices = auditServices;
    }

    public static AuditServiceManage me() {
        return SpringContextHolder.getBean(AuditServiceManage.class);
    }

    public AuditService findService(String actionType) {
        String name = actionType.toLowerCase() + AuditService.class.getSimpleName();
        AuditService service = auditServices.get(name);
        if (service == null) {
            throw new RuntimeException("未找到审计服务：" + name);
        }
        return service;
    }
}
