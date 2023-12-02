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

import cn.hutool.core.collection.CollUtil;
import com.apitable.space.entity.SpaceMenuEntity;
import com.apitable.space.mapper.SpaceMenuMapper;
import com.apitable.space.service.ISpaceMenuService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * space menu service implementation.
 */
@Service
@Slf4j
public class SpaceMenuServiceImpl extends ServiceImpl<SpaceMenuMapper, SpaceMenuEntity>
    implements ISpaceMenuService {

    @Override
    public SpaceMenuEntity findByMenuCode(String menuCode) {
        log.info("find the space menu by menu code");
        List<SpaceMenuEntity> allSpaceMenuList = baseMapper.selectList(null);
        return CollUtil.findOne(allSpaceMenuList,
            menuEntity -> menuEntity.getMenuCode().equals(menuCode));
    }
}
