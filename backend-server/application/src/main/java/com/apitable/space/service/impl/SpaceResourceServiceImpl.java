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

import static com.apitable.space.enums.SpacePermissionException.NO_RESOURCE_ASSIGNABLE;

import com.apitable.core.util.ExceptionUtil;
import com.apitable.core.util.SqlTool;
import com.apitable.space.entity.SpaceResourceEntity;
import com.apitable.space.mapper.SpaceResourceMapper;
import com.apitable.space.service.ISpaceResourceService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * space resource service implementation.
 */
@Service
@Slf4j
public class SpaceResourceServiceImpl extends ServiceImpl<SpaceResourceMapper, SpaceResourceEntity>
    implements ISpaceResourceService {

    @Override
    public void checkResourceAssignable(List<String> resourceCodes) {
        log.info("check whether resource assignable");
        int count = SqlTool.retCount(baseMapper.selectAssignableCountInResourceCode(resourceCodes));
        ExceptionUtil.isTrue(resourceCodes.size() == count, NO_RESOURCE_ASSIGNABLE);
    }
}
