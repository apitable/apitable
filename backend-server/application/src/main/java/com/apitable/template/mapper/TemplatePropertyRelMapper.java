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

package com.apitable.template.mapper;

import java.util.List;

import com.apitable.template.entity.TemplatePropertyRelEntity;
import com.apitable.template.model.TemplatePropertyRelDto;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

/**
 * <p>
 * Template Property Rel Mapper
 * </p>
 */
public interface TemplatePropertyRelMapper extends BaseMapper<TemplatePropertyRelEntity> {

    /**
     * Batch delete
     */
    int deleteBatch();

    /**
     * Batch insert
     */
    int insertBatch(@Param("entities") List<TemplatePropertyRelEntity> entities);

    /**
     * Query template id list by property code
     */
    List<String> selectTemplateIdsByPropertyCode(@Param("propertyCode") String propertyCode);

    /**
     * Query template ids by property id list
     */
    List<TemplatePropertyRelDto> selectTemplateIdsByPropertyIds(@Param("propertyCodes") List<String> propertyCodes);
}
