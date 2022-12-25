/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.shared.validator;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import lombok.extern.slf4j.Slf4j;

import com.apitable.shared.context.SessionContext;
import com.apitable.shared.holder.MemberHolder;
import com.apitable.workspace.service.INodeService;
import com.apitable.core.util.SpringContextHolder;

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
