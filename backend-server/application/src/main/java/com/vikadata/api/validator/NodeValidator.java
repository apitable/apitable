package com.vikadata.api.validator;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.context.SessionContext;
import com.vikadata.api.holder.MemberHolder;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.core.util.SpringContextHolder;

/**
 * node id validator
 * @author Shawn Deng
 */
@Slf4j
public class NodeValidator implements ConstraintValidator<NodeMatch, String> {

    @Override
    public boolean isValid(String nodeId, ConstraintValidatorContext context) {
        Long userId = SessionContext.getUserId();
        Long memberId = SpringContextHolder.getBean(INodeService.class).getMemberIdByUserIdAndNodeId(userId, nodeId);
        if (memberId == null) {
            return false;
        }
        MemberHolder.set(memberId);
        return true;
    }
}
