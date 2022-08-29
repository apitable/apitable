package com.vikadata.api.modular.idaas.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.IdaasAppBindEntity;

/**
 * <p>
 * 玉符 IDaaS 应用与空间站绑定
 * </p>
 * @author 刘斌华
 * @date 2022-05-17 18:02:05
 */
@Mapper
public interface IdaasAppBindMapper extends BaseMapper<IdaasAppBindEntity> {

    /**
     * 查询应用和空间站的绑定信息
     *
     * @param spaceId 绑定的空间站 ID
     * @return 绑定信息
     * @author 刘斌华
     * @date 2022-05-19 11:42:56
     */
    IdaasAppBindEntity selectBySpaceId(@Param("spaceId") String spaceId);

}
