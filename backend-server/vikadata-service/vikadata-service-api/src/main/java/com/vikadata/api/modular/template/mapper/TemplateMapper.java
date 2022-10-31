package com.vikadata.api.modular.template.mapper;

import java.util.List;
import java.util.Set;

import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.model.dto.template.TemplateDto;
import com.vikadata.api.model.dto.template.TemplateInfo;
import com.vikadata.api.modular.template.model.OnlineTemplateDto;
import com.vikadata.entity.TemplateEntity;

/**
 * <p>
 * Template Mapper
 * </p>
 */
public interface TemplateMapper extends BaseMapper<TemplateEntity> {

    /**
     * Query count by type id
     */
    Integer countByTypeId(@Param("typeId") String typeId);

    /**
     * Query id by type id and name
     */
    Long selectIdByTypeIdAndName(@Param("typeId") String typeId, @Param("name") String name);

    /**
     * Query node id by template id
     */
    String selectNodeIdByTempId(@Param("templateId") String templateId);

    /**
     * Query template name
     */
    String selectNameByTemplateIdIncludeDelete(@Param("templateId") String templateId);

    /**
     * Query updater user id
     */
    Long selectUpdatersByTempId(@Param("templateId") String templateId);

    /**
     * Query type id by template id
     */
    String selectTypeIdByTempId(@Param("templateId") String templateId);

    /**
     * Update used times by template id
     */
    int updateUsedTimesByTempId(@Param("templateId") String templateId, @Param("offset") Integer offset);

    /**
     * Update delete status by template id
     */
    int updateIsDeletedByTempId(@Param("templateId") String templateId);

    /**
     * Query dto by type id
     */
    List<TemplateDto> selectDtoByTypeId(@Param("typeId") String typeId, @Param("list") List<String> templateIds);

    /**
     * Query dto by template id
     */
    @InterceptorIgnore(illegalSql = "true")
    TemplateDto selectDtoByTempId(@Param("templateId") String templateId);

    /**
     * Query template info by template id
     */
    TemplateInfo selectInfoByTempId(@Param("templateId") String templateId);

    /**
     * Query template info by table id
     */
    TemplateInfo selectInfoById(@Param("id") Long id);

    /**
     * Query template info by type id
     */
    List<TemplateInfo> selectInfoByTypeId(@Param("typeId") String typeId);

    /**
     * Query node id by template id and type
     */
    String selectNodeIdByTempIdAndType(@Param("tempId") String tempId, @Param("type") Integer type);

    /**
     * Query dto by fuzzy search
     */
    List<OnlineTemplateDto> selectByTemplateIds(@Param("list") Set<String> templateIds);
}
