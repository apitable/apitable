package com.vikadata.api.validator;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.context.SessionContext;
import com.vikadata.api.holder.MemberHolder;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;

/**
 * 节点校验入口
 * @author Shawn Deng
 * @date 2021-04-07 11:49:43
 */
@Slf4j
public class NodeValidator implements ConstraintValidator<NodeMatch, String> {

    @Override
    public boolean isValid(String nodeId, ConstraintValidatorContext context) {
        Long userId = SessionContext.getUserId();
        log.info("校验当前用户「{}」是否拥有节点「{}」", userId, nodeId);
        Long memberId = SpringContextHolder.getBean(INodeService.class).getMemberIdByUserIdAndNodeId(userId, nodeId);
        if (memberId == null) {
            return false;
        }
        MemberHolder.set(memberId);
        return true;
    }
}
