package com.vikadata.api.enterprise.idaas.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.IdaasTenantEntity;

/**
 * <p>
 * IDaaS tenant information
 * </p>
 */
@Mapper
public interface IdaasTenantMapper extends BaseMapper<IdaasTenantEntity> {

    /**
     * Find tenant information by tenant name
     *
     * @param tenantName tenant name
     * @return tenant information
     */
    IdaasTenantEntity selectByTenantName(@Param("tenantName") String tenantName);

}
