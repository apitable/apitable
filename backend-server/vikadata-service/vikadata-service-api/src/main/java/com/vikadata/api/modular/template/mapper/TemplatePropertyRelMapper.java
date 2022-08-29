package com.vikadata.api.modular.template.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.modular.template.model.TemplatePropertyRelDto;
import com.vikadata.entity.TemplatePropertyRelEntity;

/**
 * <p>
 * 模板中心-模版属性关联表 Mapper 接口
 * </p>
 * @author zoe zheng
 * @date 2021/8/2 5:00 下午
 */
public interface TemplatePropertyRelMapper extends BaseMapper<TemplatePropertyRelEntity> {
    /**
     * 批量删除
     *
     * @return 删除条数
     * @author zoe zheng
     * @date 2021/8/2 5:06 下午
     */
    int deleteBatch();

    /**
     * 批量写入
     *
     * @param entities 实体数据
     * @return 影响行数
     * @author zoe zheng
     * @date 2021/8/2 7:59 下午
     */
    int insertBatch(@Param("entities") List<TemplatePropertyRelEntity> entities);

    /**
     * 根据propertyId获取对应的模版ID列表
     *
     * @param propertyId 属性ID
     * @return 模版IDs
     * @author zoe zheng
     * @date 2021/8/3 2:55 下午
     */
    List<String> selectTemplateIdsByPropertyId(@Param("propertyId") Long propertyId);

    /**
     * 根据id集批量删除
     *
     * @param propertyIds 要删除行的propertyId
     * @return 删除条数
     */
    int deleteBatchIn(@Param("propertyIds") List<Long> propertyIds);

    /**
     * 根据propertyIds获取对应的模版ID列表
     *
     * @param propertyCodes 属性propertyCodes集
     * @return propertyCode对应的模版id
     */
    List<TemplatePropertyRelDto> selectTemplateIdsByPropertyIds(@Param("propertyCodes") List<String> propertyCodes);
}
