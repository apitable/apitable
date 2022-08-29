package com.vikadata.api.component.audit;

import javax.servlet.http.HttpServletRequest;

import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.annotation.AuditAction;
import com.vikadata.api.config.task.AsyncTaskContextHolder;
import com.vikadata.api.modular.organization.mapper.MemberMapper;
import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;
import com.vikadata.core.util.HttpContextUtil;

import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.WebUtils;

/**
 * <p>
 * 抽象审计工厂
 * 拿到一些必要的字段，赋予子类获取能力
 * 保存记录由子类实现
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/3/30 17:30
 */
@Slf4j
public abstract class AbstractAuditFactory implements AuditService {

    protected String url;

    protected String ip;

    protected Long userId;

    protected String spaceId;

    protected Long memberId;

    protected String nodeId;

    protected String templateId;

    protected String parentId;

    protected String preNodeId;

    protected String props;

    protected Object oldValue;

    protected Object newValue;

    protected Object sourceNodeId;

    protected Object sourceNodeName;

    @Override
    public void createAndSave(Long userId, AuditAction action, AuditInfoField infoField, String spaceId, Object result) {
        //预备获取审计必要参数
        HttpServletRequest request = AsyncTaskContextHolder.getServletRequest();
        ContentCachingRequestWrapper requestWrapper = WebUtils.getNativeRequest(request, ContentCachingRequestWrapper.class);
        if (requestWrapper == null) {
            log.error("Request Wrapper is null");
            return;
        }
        String actionVal = action.value();
        String actionType = StrUtil.subBefore(actionVal, '_', false);
        this.url = requestWrapper.getServletPath();
        this.ip = HttpContextUtil.getRemoteAddr(requestWrapper);
        this.userId = userId;
        AuditActionType type = AuditActionType.toEnum(actionType);
        if (type == AuditActionType.SPACE_AUDIT) {
            if (spaceId != null) {
                this.spaceId = spaceId;
            }
            else {
                ParamLocation spaceParamLocation = action.spaceIdLoc();
                if (spaceParamLocation != ParamLocation.NONE) {
                    Object res = AuditHelper.resolveSpaceId(spaceParamLocation, requestWrapper, result);
                    this.spaceId = res != null ? res.toString() : null;
                }
            }
            if (StrUtil.isNotBlank(spaceId)) {
                // 获取成员ID
                this.memberId = SpringContextHolder.getBean(MemberMapper.class).selectMemberIdByUserIdAndSpaceIdExcludeDelete(userId, this.spaceId);
            }
            ParamLocation nodeParamLocation = action.nodeIdLoc();
            if (nodeParamLocation != ParamLocation.NONE) {
                Object res = AuditHelper.resolveNodeId(nodeParamLocation, requestWrapper, result);
                this.nodeId = res != null ? res.toString() : null;
            }
            ParamLocation parentNodeParamLocation = action.parentNodeIdLoc();
            if (parentNodeParamLocation != ParamLocation.NONE) {
                Object parentRes = AuditHelper.resolvePositionNodeId(parentNodeParamLocation, requestWrapper, result, "parentId");
                this.parentId = parentRes != null ? parentRes.toString() : null;
                Object preRes = AuditHelper.resolvePositionNodeId(parentNodeParamLocation, requestWrapper, result, "preNodeId");
                this.preNodeId = preRes != null ? preRes.toString() : null;
            }

            if (infoField != null) {
                //获取空间ID，取旧值和修改的新值
                this.oldValue = infoField.getOldValue();
                this.newValue = infoField.getNewValue();
                this.sourceNodeId = infoField.getSourceNodeId();
                this.sourceNodeName = infoField.getSourceNodeName();
                this.templateId = infoField.getTemplateId();
                this.props = infoField.getProps();
                if (infoField.getCoverActionVal() != null) {
                    actionVal = infoField.getCoverActionVal();
                }
            }
        }
        //插入审计记录
        this.create(actionVal);
    }

    /**
     * 创建审计记录
     *
     * @param action 动作KEY
     * @author Shawn Deng
     * @date 2020/3/30 18:03
     */
    protected abstract void create(String action);
}
