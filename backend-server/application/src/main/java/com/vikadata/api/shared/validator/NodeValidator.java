package com.vikadata.api.shared.validator;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.shared.context.SessionContext;
import com.vikadata.api.shared.holder.MemberHolder;
import com.vikadata.api.workspace.service.INodeService;
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
