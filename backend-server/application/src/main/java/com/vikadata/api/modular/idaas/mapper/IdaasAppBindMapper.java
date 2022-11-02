package com.vikadata.api.modular.idaas.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.IdaasAppBindEntity;

/**
 * <p>
 * IDaaS application is bound to the space
 * </p>
 */
@Mapper
public interface IdaasAppBindMapper extends BaseMapper<IdaasAppBindEntity> {

    /**
     * Query the binding information between the application and the space
     *
     * @param spaceId bind space's id
     * @return bind information
     */
    IdaasAppBindEntity selectBySpaceId(@Param("spaceId") String spaceId);

}
