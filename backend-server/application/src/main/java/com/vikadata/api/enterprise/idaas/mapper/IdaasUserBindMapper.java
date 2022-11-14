package com.vikadata.api.enterprise.idaas.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.IdaasUserBindEntity;

/**
 * <p>
 * IDaaS User binding information
 * </p>
 */
@Mapper
public interface IdaasUserBindMapper extends BaseMapper<IdaasUserBindEntity> {

    /**
     * Query binding information according to IDaaS user ID
     *
     * @param userId IDaaS user's id
     * @return bind information
     */
    IdaasUserBindEntity selectByUserId(String userId);

    /**
     * Query binding information according to IDaaS user ID, including deleted
     *
     * @param userIds IDaaS user's id
     * @return Binding information, including deleted
     */
    List<IdaasUserBindEntity> selectAllByUserIdsIgnoreDeleted(@Param("userIds") List<String> userIds);

    /**
     * Query the binding information according to the user ID of Vigor, including the deleted
     *
     * @param vikaUserIds vika user id
     * @return Binding information, including deleted
     */
    List<IdaasUserBindEntity> selectAllByVikaUserIdsIgnoreDeleted(@Param("vikaUserIds") List<Long> vikaUserIds);

}
