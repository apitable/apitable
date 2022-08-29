package com.vikadata.api.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;

import com.vikadata.api.annotation.AuditAction;
import com.vikadata.api.component.TaskManager;
import com.vikadata.api.component.audit.AuditInfoField;
import com.vikadata.api.component.audit.AuditService;
import com.vikadata.api.component.audit.AuditServiceManage;
import com.vikadata.api.holder.AuditFieldHolder;
import com.vikadata.api.holder.SpaceHolder;
import com.vikadata.api.holder.UserHolder;
import com.vikadata.system.config.SystemConfig;
import com.vikadata.system.config.SystemConfigManager;
import com.vikadata.system.config.audit.AuditConfig;

import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import static com.vikadata.api.constants.AspectOrderConstants.CHAIN_ON_AUDIT_ACTION_ORDER;

/**
 * <p>
 * 审计事件埋点
 * </p>
 *
 * @author zoe zheng
 * @date 2020/3/24 12:15 下午
 */
@Aspect
@Component
@Order(CHAIN_ON_AUDIT_ACTION_ORDER)
@Slf4j
public class ChainOnAuditAspect extends BaseAspectSupport {

    /**
     * 成功执行之后的切入点
     */
    @AfterReturning(pointcut = "@annotation(auditAction)", returning = "result")
    public void doAfterReturning(AuditAction auditAction, Object result) {
        try {
            SystemConfig systemConfig = SystemConfigManager.getConfig();
            AuditConfig auditConfig = systemConfig.getAudit();
            String action = auditAction.value();
            if (auditConfig.containsKey(action)) {
                if (log.isDebugEnabled()) {
                    log.debug("审计类型：{}", action);
                }
                //截取前缀，获取审计类型
                String actionType = auditConfig.get(action).getType();
                AuditService auditService = AuditServiceManage.me().findService(actionType);
                //登出操作必须在之前拿到用户ID
                Long userId = UserHolder.get();
                if (userId == null) {
                    return;
                }
                AuditInfoField infoField = AuditFieldHolder.get();
                String spaceId = SpaceHolder.get();
                TaskManager.me().execute(() -> auditService.createAndSave(userId, auditAction, infoField, spaceId, result));
            }
        }
        catch (Exception e) {
            log.error("异步保存审计记录异常", e);
        }
    }
}
