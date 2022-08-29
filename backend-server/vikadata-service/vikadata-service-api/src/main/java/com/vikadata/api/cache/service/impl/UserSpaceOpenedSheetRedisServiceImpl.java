package com.vikadata.api.cache.service.impl;

import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.vikadata.api.cache.bean.OpenedSheet;
import com.vikadata.api.cache.service.UserSpaceOpenedSheetService;
import com.vikadata.define.constants.RedisConstants;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.concurrent.TimeUnit;

/**
 * <p>
 * 用户在空间内打开的数表信息缓存 服务实现类
 * </p>
 *
 * @author Chambers
 * @date 2020/3/18
 */
@Slf4j
@Service
public class UserSpaceOpenedSheetRedisServiceImpl implements UserSpaceOpenedSheetService {

    @Resource
    private RedisTemplate<String, String> redisTemplate;

    /**
     * 存储时间，单位：天
     */
    private static final int TIMEOUT = 30;

    @Override
    public OpenedSheet getOpenedSheet(Long userId, String spaceId) {
        log.info("获取用户在指定空间内打开的数表信息");
        BoundValueOperations<String, String> opts = redisTemplate.boundValueOps(RedisConstants.getUserSpaceOpenedSheetKey(userId, spaceId));
        String str = opts.get();
        if (str != null) {
            return JSONUtil.toBean(str, OpenedSheet.class);
        }
        return null;
    }

    @Override
    public void refresh(Long userId, String spaceId, OpenedSheet openedSheet) {
        log.info("刷新打开的数表缓存,顺延30天保存");
        String key = RedisConstants.getUserSpaceOpenedSheetKey(userId, spaceId);
        if (ObjectUtil.isNotNull(openedSheet) && StrUtil.isNotBlank(openedSheet.getNodeId())) {
            BoundValueOperations<String, String> opts = redisTemplate.boundValueOps(key);
            opts.set(JSONUtil.toJsonStr(openedSheet), TIMEOUT, TimeUnit.DAYS);
        } else {
            redisTemplate.delete(key);
        }
    }

    @Override
    public void delete(Long userId, String spaceId) {
        redisTemplate.delete(RedisConstants.getUserSpaceOpenedSheetKey(userId, spaceId));
    }
}
