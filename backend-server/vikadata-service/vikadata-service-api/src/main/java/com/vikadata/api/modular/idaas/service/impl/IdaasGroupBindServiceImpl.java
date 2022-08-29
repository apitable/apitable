package com.vikadata.api.modular.idaas.service.impl;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import com.vikadata.api.modular.idaas.mapper.IdaasGroupBindMapper;
import com.vikadata.api.modular.idaas.service.IIdaasGroupBindService;
import com.vikadata.entity.IdaasGroupBindEntity;

import org.springframework.stereotype.Service;

/**
 * <p>
 * 玉符 IDaaS 用户组绑定信息
 * </p>
 * @author 刘斌华
 * @date 2022-05-30 10:10:11
 */
@Service
public class IdaasGroupBindServiceImpl extends ServiceImpl<IdaasGroupBindMapper, IdaasGroupBindEntity> implements IIdaasGroupBindService {

    @Override
    public List<IdaasGroupBindEntity> getAllBySpaceId(String spaceId) {
        return getBaseMapper().selectAllBySpaceId(spaceId);
    }

    @Override
    public List<IdaasGroupBindEntity> getAllBySpaceIdIgnoreDeleted(String spaceId) {
        return getBaseMapper().selectAllBySpaceIdIgnoreDeleted(spaceId);
    }

}
