package com.vikadata.api.modular.idaas.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.IdaasAppEntity;

/**
 * <p>
 * 玉符 IDaaS 应用信息
 * </p>
 * @author 刘斌华
 * @date 2022-05-25 11:38:02
 */
@Mapper
public interface IdaasAppMapper extends BaseMapper<IdaasAppEntity> {

    /**
     * 获取应用信息
     *
     * @param clientId 应用的 Client ID
     * @return 应用信息
     * @author 刘斌华
     * @date 2022-05-25 11:51:23
     */
    IdaasAppEntity selectByClientId(@Param("clientId") String clientId);

}
