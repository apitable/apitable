package com.vikadata.api.modular.template.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.modular.template.model.TemplatePropertyRelDto;
import com.vikadata.entity.TemplatePropertyRelEntity;

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
     * Query template id list by property id
     */
    List<String> selectTemplateIdsByPropertyId(@Param("propertyId") Long propertyId);

    /**
     * Batch delete by id list
     */
    int deleteBatchIn(@Param("propertyIds") List<Long> propertyIds);

    /**
     * Query template ids by property id list
     */
    List<TemplatePropertyRelDto> selectTemplateIdsByPropertyIds(@Param("propertyCodes") List<String> propertyCodes);
}
