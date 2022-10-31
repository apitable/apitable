package com.vikadata.api.modular.social.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enums.exception.DatabaseException;
import com.vikadata.api.modular.social.mapper.SocialUserBindMapper;
import com.vikadata.api.modular.social.service.ISocialUserBindService;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.SocialUserBindEntity;
import com.vikadata.entity.UserEntity;

import org.springframework.stereotype.Service;

/**
 * Third party platform integration - user binding service interface implementation
 */
@Service
@Slf4j
public class SocialUserBindServiceImpl extends ServiceImpl<SocialUserBindMapper, SocialUserBindEntity> implements ISocialUserBindService {

    @Resource
    private SocialUserBindMapper socialUserBindMapper;

    @Resource
    private IUserService iUserService;

    @Override
    public void create(Long userId, String unionId) {
        SocialUserBindEntity userBind = new SocialUserBindEntity();
        userBind.setUserId(userId);
        userBind.setUnionId(unionId);
        boolean saveFlag = save(userBind);
        ExceptionUtil.isTrue(saveFlag, DatabaseException.INSERT_ERROR);
    }

    @Override
    public List<String> getUnionIdsByUserId(Long userId) {
        return socialUserBindMapper.selectUnionIdByUserId(userId);
    }

    @Override
    public Long getUserIdByUnionId(String unionId) {
        return socialUserBindMapper.selectUserIdByUnionId(unionId);
    }

    @Override
    public String getOpenIdByTenantIdAndUserId(String appId, String tenantId, Long userId) {
        return socialUserBindMapper.selectOpenIdByTenantIdAndUserId(appId, tenantId, userId);
    }

    @Override
    public List<SocialUserBindEntity> getEntitiesByUnionId(List<String> unionIds) {
        if (CollUtil.isEmpty(unionIds)) {
            return new ArrayList<>();
        }
        return socialUserBindMapper.selectByUnionIds(unionIds);
    }

    @Override
    public void deleteBatchByUnionId(List<String> unionIds) {
        if (CollUtil.isEmpty(unionIds)) {
            return;
        }
        socialUserBindMapper.deleteByUnionIds(unionIds);
    }

    @Override
    public void deleteByUserId(Long userId) {
        socialUserBindMapper.deleteByUserId(userId);
    }


    @Override
    public Boolean isUnionIdBind(Long userId, String unionId) {
        List<String> unionIds = socialUserBindMapper.selectUnionIdByUserId(userId);
        for (String id : unionIds) {
            if (StrUtil.equals(id, unionId)) {
                return true;
            }
        }
        return false;
    }

    @Override
    public HashMap<String, String> getUserNameByUnionIds(List<String> unionIds) {
        HashMap<String, String> nickNameMap = MapUtil.newHashMap();
        List<SocialUserBindEntity> entities = baseMapper.selectByUnionIds(unionIds);
        if (entities.isEmpty()) {
            return nickNameMap;
        }
        Map<Long, SocialUserBindEntity> bindMap =
                entities.stream().collect(Collectors.toMap(SocialUserBindEntity::getUserId, a -> a, (k1, k2) -> k1));
        Set<Long> userIds = bindMap.keySet();
        List<UserEntity> users = iUserService.listByIds(userIds);
        for (UserEntity user : users) {
            if (bindMap.containsKey(user.getId())) {
                nickNameMap.put(bindMap.get(user.getId()).getUnionId(), user.getNickName());
            }
        }
        return nickNameMap;
    }
}
