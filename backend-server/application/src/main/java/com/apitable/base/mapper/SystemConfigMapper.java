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

package com.apitable.base.mapper;

import com.apitable.base.entity.SystemConfigEntity;
import com.apitable.base.model.SystemConfigDTO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import java.util.List;
import org.apache.ibatis.annotations.Param;

/**
 * Basics - System Configuration Table Mapper Interface.
 */
public interface SystemConfigMapper extends BaseMapper<SystemConfigEntity> {

    /**
     * Find the configuration record id to which the most popular recommendations
     * in the Template Center belong according to the language.
     *
     * @param type configuration type
     * @param lang configuration language
     * @return configuration primary key id
     */
    Long selectIdByTypeAndLang(@Param("type") Integer type, @Param("lang") String lang);

    /**
     * Find the configuration information in the system configuration table according to type.
     *
     * @param type Configuration type
     * @param lang Configuration language (optional)
     * @return configuration information
     */
    String selectConfigMapByType(@Param("type") Integer type, @Param("lang") String lang);

    /**
     * query i18n name by type.
     *
     * @param type config type
     * @return SystemConfigDTO list
     */
    List<SystemConfigDTO> selectConfigDtoByType(@Param("type") Integer type);

    /**
     * batch insert.
     *
     * @param entities System Config Entities
     * @return affected rows count
     */
    int insertBatch(@Param("entities") List<SystemConfigEntity> entities);

    /**
     * remove by table ids.
     *
     * @param ids       System Config Table ID List
     * @param updatedBy Updater User ID
     * @return affected rows count
     */
    int removeByIds(@Param("ids") List<Long> ids, @Param("updatedBy") Long updatedBy);

}
