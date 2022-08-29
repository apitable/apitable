package com.vikadata.api.modular.idaas.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.IdaasTenantEntity;

/**
 * <p>
 * 玉符 IDaaS 租户信息
 * </p>
 * @author 刘斌华
 * @date 2022-05-17 18:02:05
 */
@Mapper
public interface IdaasTenantMapper extends BaseMapper<IdaasTenantEntity> {

    /**
     * 根据租户名来查找租户信息
     *
     * @param tenantName 租户名
     * @return 租户信息
     * @author 刘斌华
     * @date 2022-05-25 15:44:56
     */
    IdaasTenantEntity selectByTenantName(@Param("tenantName") String tenantName);

}
