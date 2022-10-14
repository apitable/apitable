package com.vikadata.api.modular.base.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.modular.base.model.SystemConfigDTO;
import com.vikadata.entity.SystemConfigEntity;

/**
 * <p>
 *     基础 - 系统配置表Mapper 接口
 * </p>
 *
 * @author tao
 */
public interface SystemConfigMapper extends BaseMapper<SystemConfigEntity> {

    /**
     * 根据语言找到模板中心热门推荐所属的配置记录id
     * @param type 配置类型
     * @param lang 配置所属语言
     * @return 配置信息记录id
     */
    Long selectIdByTypeAndLang(@Param("type") Integer type, @Param("lang") String lang);

    /**
     * 根据type查找系统配置表中的配置信息
     * @param type 配置类型
     * @param lang 配置语言（非必须）
     * @return 配置信息
     */
    String selectConfigMapByType(@Param("type") Integer type, @Param("lang") String lang);

    /**
     * query i18n name by type
     *
     * @param type  config type
     * @return SystemConfigDTO list
     * @author Chambers
     * @date 2022/9/23
     */
    List<SystemConfigDTO> selectConfigDtoByType(@Param("type") Integer type);

    /**
     * batch insert
     *
     * @param entities System Config Entities
     * @return affected rows count
     * @author Chambers
     * @date 2022/9/26
     */
    int insertBatch(@Param("entities") List<SystemConfigEntity> entities);

    /**
     * remove by table ids
     *
     * @param ids       System Config Table ID List
     * @param updatedBy Updater User ID
     * @return affected rows count
     * @author Chambers
     * @date 2022/9/26
     */
    int removeByIds(@Param("ids") List<Long> ids, @Param("updatedBy") Long updatedBy);

}
