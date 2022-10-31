package com.vikadata.api.modular.social.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.SocialWecomPermitOrderAccountBindEntity;

/**
 * <p>
 * WeCom service provider interface license account binding information
 * </p>
 */
@Mapper
public interface  SocialWecomPermitOrderAccountBindMapper extends BaseMapper<SocialWecomPermitOrderAccountBindEntity> {

    /**
     * Query activation code
     *
     * @param orderId Interface license order number
     * @return Activation code list
     */
    List<String> selectActiveCodesByOrderId(@Param("orderId") String orderId);

    /**
     * Obtain the number of accounts in the interface license order
     *
     * @param orderId Interface license order number
     * @return Number of accounts
     */
    int selectCountByOrderId(@Param("orderId") String orderId);

}
