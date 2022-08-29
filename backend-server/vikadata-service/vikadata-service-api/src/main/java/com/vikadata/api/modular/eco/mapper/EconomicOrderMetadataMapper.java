package com.vikadata.api.modular.eco.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.EconomicOrderMetadataEntity;

/** 
* <p> 
* 经济模块-订单自定义键值对参数表 实现
* </p> 
* @author zoe zheng 
* @date 2022/2/25 18:30
*/
public interface EconomicOrderMetadataMapper extends BaseMapper<EconomicOrderMetadataEntity> {

    /**
     * 根据订单号批量查询元数据信息
     *
     * @param orderNos 订单号列表
     * @return 元数据信息列表
     * @author 刘斌华
     * @date 2022-06-17 10:11:05
     */
    List<EconomicOrderMetadataEntity> selectByOrderNos(@Param("orderNos") List<String> orderNos);

}
