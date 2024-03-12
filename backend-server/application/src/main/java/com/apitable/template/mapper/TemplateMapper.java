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

import com.apitable.template.dto.TemplateDto;
import com.apitable.template.dto.TemplateInfo;
import com.apitable.template.entity.TemplateEntity;
import com.apitable.template.model.OnlineTemplateDto;
import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import java.util.List;
import java.util.Set;
import org.apache.ibatis.annotations.Param;

/**
 * <p>
 * Template Mapper.
 * </p>
 */
public interface TemplateMapper extends BaseMapper<TemplateEntity> {

    /**
     * Query count by type id.
     */
    Integer countByTypeId(@Param("typeId") String typeId);

    /**
     * Query id by type id and name.
     */
    Long selectIdByTypeIdAndName(@Param("typeId") String typeId, @Param("name") String name);

    /**
     * Query node id by template id.
     */
    String selectNodeIdByTempId(@Param("templateId") String templateId);

    /**
     * Query template name.
     */
    String selectNameByTemplateIdIncludeDelete(@Param("templateId") String templateId);

    /**
     * Query updater user id.
     */
    Long selectUpdatersByTempId(@Param("templateId") String templateId);

    /**
     * Query type id by template id.
     */
    String selectTypeIdByTempId(@Param("templateId") String templateId);

    /**
     * Update used times by template id.
     */
    int updateUsedTimesByTempId(@Param("templateId") String templateId,
                                @Param("offset") Integer offset);

    /**
     * Update delete status by template id.
     */
    int updateIsDeletedByTempId(@Param("templateId") String templateId);

    /**
     * Query template information.
     *
     * @param typeId        type id
     * @param templateIds   template ids
     * @return List of TemplateInfo
     * @author Chambers
     */
    List<TemplateInfo> selectInfoByTypeIdAndTemplateIds(@Param("typeId") String typeId,
                                                        @Param("templateIds") List<String> templateIds);

    /**
     * Query dto by type id.
     */
    List<TemplateDto> selectDtoByTypeId(@Param("typeId") String typeId,
                                        @Param("list") List<String> templateIds);

    /**
     * Query dto by template id.
     */
    @InterceptorIgnore(illegalSql = "true")
    TemplateDto selectDtoByTempId(@Param("templateId") String templateId);

    /**
     * Query template info by template id.
     */
    TemplateInfo selectInfoByTempId(@Param("templateId") String templateId);

    /**
     * Query template info by table id.
     */
    TemplateInfo selectInfoById(@Param("id") Long id);

    /**
     * Query template info by type id.
     */
    List<TemplateInfo> selectInfoByTypeId(@Param("typeId") String typeId);

    /**
     * Query node id by template id and type.
     */
    String selectNodeIdByTempIdAndType(@Param("tempId") String tempId, @Param("type") Integer type);

    /**
     * Query dto by fuzzy search.
     */
    List<OnlineTemplateDto> selectByTemplateIds(@Param("list") Set<String> templateIds);
}
