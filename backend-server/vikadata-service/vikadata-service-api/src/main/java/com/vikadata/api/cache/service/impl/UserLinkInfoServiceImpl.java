package com.vikadata.api.cache.service.impl;

import cn.hutool.json.JSONUtil;
import com.vikadata.api.cache.bean.AccountLinkDto;
import com.vikadata.api.cache.bean.UserLinkInfo;
import com.vikadata.api.cache.service.UserLinkInfoService;
import com.vikadata.api.enums.vcode.VCodeType;
import com.vikadata.api.modular.developer.mapper.DeveloperMapper;
import com.vikadata.api.modular.player.mapper.PlayerActivityMapper;
import com.vikadata.api.modular.user.mapper.UserLinkMapper;
import com.vikadata.api.modular.vcode.mapper.VCodeMapper;
import com.vikadata.define.constants.RedisConstants;
import com.vikadata.entity.DeveloperEntity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * <p>
 * 用户关联信息缓存 服务实现类
 * </p>
 *
 * @author Chambers
 * @date 2020/8/26
 */
@Slf4j
@Service
public class UserLinkInfoServiceImpl implements UserLinkInfoService {

    @Resource
    private RedisTemplate<String, String> redisTemplate;

    @Resource
    private UserLinkMapper userLinkMapper;

    @Resource
    private DeveloperMapper developerMapper;

    @Resource
    private PlayerActivityMapper playerActivityMapper;

    @Resource
    private VCodeMapper vCodeMapper;

    /**
     * 存储时间，单位：分钟
     */
    private static final int TIMEOUT = 30;

    @Override
    public UserLinkInfo getUserLinkInfo(Long userId) {
        String str = redisTemplate.opsForValue().get(RedisConstants.getUserLinkInfoKey(userId));
        if (str != null) {
            return JSONUtil.toBean(str, UserLinkInfo.class);
        }
        UserLinkInfo info = new UserLinkInfo();
        // 缓存开发者信息
        DeveloperEntity developerEntity = developerMapper.selectByUserId(userId);
        if (developerEntity != null) {
            info.setApiKey(developerEntity.getApiKey());
        }
        // 获取帐号关联第三方信息
        List<AccountLinkDto> accountLinkList = userLinkMapper.selectVoByUserId(userId);
        info.setAccountLinkList(accountLinkList);
        // 获取引导相关数据
        String actions = playerActivityMapper.selectActionsByUserId(userId);
        info.setWizards(actions);
        // 获取用户的个人邀请码
        String inviteCode = vCodeMapper.selectCodeByTypeAndRefId(VCodeType.PERSONAL_INVITATION_CODE.getType(), userId);
        info.setInviteCode(inviteCode);
        // 保存缓存
        redisTemplate.opsForValue().set(RedisConstants.getUserLinkInfoKey(userId), JSONUtil.toJsonStr(info), TIMEOUT, TimeUnit.MINUTES);
        return info;
    }

    @Override
    public void delete(Long userId) {
        redisTemplate.delete(RedisConstants.getUserLinkInfoKey(userId));
    }
}
