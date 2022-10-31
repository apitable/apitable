package com.vikadata.api.modular.idaas.service.impl;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import com.vikadata.api.modular.idaas.mapper.IdaasUserBindMapper;
import com.vikadata.api.modular.idaas.service.IIdaasUserBindService;
import com.vikadata.entity.IdaasUserBindEntity;

import org.springframework.stereotype.Service;

/**
 * <p>
 * IDaaS User bound information
 * </p>
 */
@Service
public class IdaasUserBindServiceImpl extends ServiceImpl<IdaasUserBindMapper, IdaasUserBindEntity> implements IIdaasUserBindService {

    @Override
    public IdaasUserBindEntity getByUserId(String userId) {
        return getBaseMapper().selectByUserId(userId);
    }

    @Override
    public List<IdaasUserBindEntity> getAllByUserIdsIgnoreDeleted(List<String> userIds) {
        return getBaseMapper().selectAllByUserIdsIgnoreDeleted(userIds);
    }

    @Override
    public List<IdaasUserBindEntity> getAllByVikaUserIdsIgnoreDeleted(List<Long> vikaUserIds) {
        return getBaseMapper().selectAllByVikaUserIdsIgnoreDeleted(vikaUserIds);
    }

}
