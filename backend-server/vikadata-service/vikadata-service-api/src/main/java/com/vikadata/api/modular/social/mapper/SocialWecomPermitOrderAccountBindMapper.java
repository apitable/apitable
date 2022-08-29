package com.vikadata.api.modular.social.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.SocialWecomPermitOrderAccountBindEntity;

/**
 * <p>
 * 企微服务商接口许可账号绑定信息
 * </p>
 * @author 刘斌华
 * @date 2022-07-01 10:41:12
 */
@Mapper
public interface  SocialWecomPermitOrderAccountBindMapper extends BaseMapper<SocialWecomPermitOrderAccountBindEntity> {

    /**
     * 查询激活码
     *
     * @param orderId 接口许可订单号
     * @return 激活码列表
     * @author 刘斌华
     * @date 2022-07-01 15:08:07
     */
    List<String> selectActiveCodesByOrderId(@Param("orderId") String orderId);

    /**
     * 获取接口许可订单中的账号数量
     *
     * @param orderId 接口许可订单号
     * @return 账号数量
     * @author 刘斌华
     * @date 2022-06-28 10:30:00
     */
    int selectCountByOrderId(@Param("orderId") String orderId);

}
