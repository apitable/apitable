package com.vikadata.api.modular.idaas.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.IdaasUserBindEntity;

/**
 * <p>
 * 玉符 IDaaS 用户绑定信息
 * </p>
 * @author 刘斌华
 * @date 2022-05-31 11:03:52
 */
@Mapper
public interface IdaasUserBindMapper extends BaseMapper<IdaasUserBindEntity> {

    /**
     * 根据 IDaaS 用户 ID 查询绑定信息
     *
     * @param userId 玉符 IDaaS 用户 ID
     * @return 绑定信息
     * @author 刘斌华
     * @date 2022-06-05 13:35:12
     */
    IdaasUserBindEntity selectByUserId(String userId);

    /**
     * 根据 IDaaS 用户 ID 查询绑定信息，包括已删除的
     *
     * @param userIds 玉符 IDaaS 用户 ID 雷彪
     * @return 绑定信息，包括已删除的
     * @author 刘斌华
     * @date 2022-06-04 16:05:36
     */
    List<IdaasUserBindEntity> selectAllByUserIdsIgnoreDeleted(@Param("userIds") List<String> userIds);

    /**
     * 根据维格用户 ID 查询绑定信息，包括已删除的
     *
     * @param vikaUserIds 维格用户 ID 雷彪
     * @return 绑定信息，包括已删除的
     * @author 刘斌华
     * @date 2022-06-04 16:05:36
     */
    List<IdaasUserBindEntity> selectAllByVikaUserIdsIgnoreDeleted(@Param("vikaUserIds") List<Long> vikaUserIds);

}
