package com.vikadata.api.modular.eco.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.EconomicOrderEntity;
import com.vikadata.entity.EconomicOrderPaymentEntity;

/**
 * 经济模块-订单表 实现
 * @author Shawn Deng
 * @date 2021-11-01 10:23:46
 */
public interface EconomicOrderPaymentMapper extends BaseMapper<EconomicOrderPaymentEntity> {

    /**
     * 根据交易号查询
     * @param payTransactionNo 交易号
     * @return EconomicOrderPaymentEntity
     */
    EconomicOrderPaymentEntity selectByTransactionNo(@Param("payTransactionNo") String payTransactionNo);

    List<EconomicOrderPaymentEntity> selectAll();
}
