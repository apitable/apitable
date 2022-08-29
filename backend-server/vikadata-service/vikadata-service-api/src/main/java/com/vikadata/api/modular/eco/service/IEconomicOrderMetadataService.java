package com.vikadata.api.modular.eco.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.EconomicOrderMetadataEntity;

/**
* <p>
* 经济系统--订单自定义k-v
* </p>
* @author zoe zheng
* @date 2022/2/25 18:32
*/
@Deprecated
public interface IEconomicOrderMetadataService extends IService<EconomicOrderMetadataEntity> {

    /**
     * 根据订单号批量查询元数据信息
     *
     * @param orderNos 订单号列表
     * @return 元数据信息列表
     * @author 刘斌华
     * @date 2022-06-17 10:11:05
     */
    List<EconomicOrderMetadataEntity> getByOrderNos(List<String> orderNos);

}
