package com.vikadata.scheduler.space.mapper.template;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.TemplatePropertyEntity;

/** 
* <p> 
* 模板中心-模版属性 Mapper 接口
* </p> 
* @author zoe zheng 
* @date 2021/8/2 5:00 下午
*/
public interface TemplatePropertyMapper extends BaseMapper<TemplatePropertyEntity> {
    /**
     * 批量写入
     *
     * @param entities 实体数据
     * @return 影响行数
     * @author zoe zheng
     * @date 2021/8/2 7:59 下午
     */
    int insertBatch(@Param("entities") List<TemplatePropertyEntity> entities);
}
