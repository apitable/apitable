package com.vikadata.api.modular.base.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

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
}
