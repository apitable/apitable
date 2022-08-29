package com.vikadata.api.modular.eco.service.impl;

import java.util.List;

import javax.annotation.Resource;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.modular.eco.mapper.EconomicOrderMetadataMapper;
import com.vikadata.api.modular.eco.service.IEconomicOrderMetadataService;
import com.vikadata.entity.EconomicOrderMetadataEntity;

import org.springframework.stereotype.Service;

/** 
* <p> 
* 经济系统--订单自定义k-v实现
* </p> 
* @author zoe zheng 
* @date 2022/2/25 18:34
*/
@Service
@Slf4j
@Deprecated
public class EconomicOrderMetadataServiceImpl extends ServiceImpl<EconomicOrderMetadataMapper,
        EconomicOrderMetadataEntity> implements IEconomicOrderMetadataService {

    @Override
    public List<EconomicOrderMetadataEntity> getByOrderNos(List<String> orderNos) {
        return getBaseMapper().selectByOrderNos(orderNos);
    }

}
