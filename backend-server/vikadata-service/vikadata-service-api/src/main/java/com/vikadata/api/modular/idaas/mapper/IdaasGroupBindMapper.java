package com.vikadata.api.modular.idaas.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.IdaasGroupBindEntity;

/**
 * <p>
 * 玉符 IDaaS 用户组绑定信息
 * </p>
 * @author 刘斌华
 * @date 2022-05-30 10:08:19
 */
@Mapper
public interface IdaasGroupBindMapper extends BaseMapper<IdaasGroupBindEntity> {

    /**
     * 获取跟空间站绑定的所有用户组
     *
     * @param spaceId 要查询的空间站 ID
     * @return 空间站绑定的所有用户组
     * @author 刘斌华
     * @date 2022-05-30 11:41:43
     */
    List<IdaasGroupBindEntity> selectAllBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 获取跟空间站绑定的所有用户组，包括已删除的
     *
     * @param spaceId 要查询的空间站 ID
     * @return 空间站绑定的所有用户组
     * @author 刘斌华
     * @date 2022-05-30 11:41:43
     */
    List<IdaasGroupBindEntity> selectAllBySpaceIdIgnoreDeleted(@Param("spaceId") String spaceId);

}
