package com.vikadata.api.enterprise.idaas.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.IdaasGroupBindEntity;

/**
 * <p>
 * IDaaS user group binding information
 * </p>
 */
@Mapper
public interface IdaasGroupBindMapper extends BaseMapper<IdaasGroupBindEntity> {

    /**
     * Get all user groups bound to the space
     *
     * @param spaceId space's id
     * @return all user groups bound to the space
     */
    List<IdaasGroupBindEntity> selectAllBySpaceId(@Param("spaceId") String spaceId);

    /**
     * Get all user groups bound to the space, include is deleted
     *
     * @param spaceId space's id
     * @return all user groups bound to the space
     */
    List<IdaasGroupBindEntity> selectAllBySpaceIdIgnoreDeleted(@Param("spaceId") String spaceId);

}
