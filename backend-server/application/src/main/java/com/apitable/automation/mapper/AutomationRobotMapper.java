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

package com.apitable.automation.mapper;

import com.apitable.automation.entity.AutomationRobotEntity;
import com.apitable.automation.model.AutomationRobotDto;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import java.util.List;
import org.apache.ibatis.annotations.Param;


public interface AutomationRobotMapper extends BaseMapper<AutomationRobotEntity> {

    List<AutomationRobotDto> getRobotsByResourceId(@Param("resourceId") String resourceId);

    void updateByRobotId(@Param("robotId") String robotId, @Param("name") String name,
        @Param("description") String description, @Param("resourceId") String resourceId);

    void removeByRobotIds(@Param("robotIds") List<String> robotIds);
}
