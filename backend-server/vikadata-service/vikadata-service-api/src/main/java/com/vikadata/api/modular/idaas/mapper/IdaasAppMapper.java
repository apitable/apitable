package com.vikadata.api.modular.idaas.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.IdaasAppEntity;

/**
 * <p>
 * IDaaS application information
 * </p>
 */
@Mapper
public interface IdaasAppMapper extends BaseMapper<IdaasAppEntity> {

    /**
     * Get application information
     *
     * @param clientId App's Client ID
     * @return application information
     */
    IdaasAppEntity selectByClientId(@Param("clientId") String clientId);

}
