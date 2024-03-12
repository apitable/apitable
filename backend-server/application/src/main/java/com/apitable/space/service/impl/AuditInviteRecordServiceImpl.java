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

package com.apitable.space.service.impl;

import com.apitable.base.enums.DatabaseException;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.space.entity.AuditInviteRecordEntity;
import com.apitable.space.mapper.AuditInviteRecordMapper;
import com.apitable.space.service.IAuditInviteRecordService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;


/**
 * <p>
 * Audit Invite Record Service Implement Class.
 * </p>
 */
@Slf4j
@Service
public class AuditInviteRecordServiceImpl
    extends ServiceImpl<AuditInviteRecordMapper, AuditInviteRecordEntity>
    implements IAuditInviteRecordService {

    @Override
    public void save(String spaceId, Long inviter, Long accepter, Integer type) {
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
