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

package com.apitable.workspace.service.impl;

import com.apitable.workspace.entity.NodeRoleResourceRelEntity;
import com.apitable.workspace.mapper.NodeRoleResourceRelMapper;
import com.apitable.workspace.service.INodeRoleResourceRelService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * role resource rel service impl.
 */
@Service
public class RoleResourceRelServiceImpl
    extends ServiceImpl<NodeRoleResourceRelMapper, NodeRoleResourceRelEntity>
    implements INodeRoleResourceRelService {


}
