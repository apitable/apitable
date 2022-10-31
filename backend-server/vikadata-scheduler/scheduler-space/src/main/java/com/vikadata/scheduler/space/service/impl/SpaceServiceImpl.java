package com.vikadata.scheduler.space.service.impl;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import com.xxl.job.core.context.XxlJobHelper;

import com.vikadata.core.util.SqlTool;
import com.vikadata.scheduler.space.cache.service.RedisService;
import com.vikadata.scheduler.space.mapper.organization.MemberMapper;
import com.vikadata.scheduler.space.mapper.space.SpaceMapper;
import com.vikadata.scheduler.space.service.ISpaceService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <p>
 * Space Service Implement Class
 * </p>
 */
@Service
public class SpaceServiceImpl implements ISpaceService {

    @Resource
    private SpaceMapper spaceMapper;

    @Resource
    private MemberMapper memberMapper;

    @Resource
    private RedisService redisService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delSpace(String spaceId) {
        XxlJobHelper.log("Deleting Space. Now：{}", LocalDateTime.now(ZoneId.of("+8")));
        List<String> spaceIds;
        if (StrUtil.isNotBlank(spaceId)) {
            // Determine whether the space is in the pre-delete state
            int count = SqlTool.retCount(spaceMapper.countBySpaceId(spaceId, true));
            if (count > 0) {
                spaceIds = CollUtil.newArrayList(spaceId);
            }
            else {
                XxlJobHelper.log("The space「{}」 is not in a pre-deleted state and cannot be deleted directly", spaceId);
                return;
            }
        }
        else {
            String date = LocalDateTime.now(ZoneId.of("+8")).plusDays(-7).toString();
            spaceIds = spaceMapper.findDelSpaceIds(date);
        }
        if (CollUtil.isNotEmpty(spaceIds)) {
            spaceMapper.updateIsDeletedBySpaceIdIn(spaceIds);
            // Delete user active space cache
            List<Long> userIds = memberMapper.selectUserIdBySpaceIds(spaceIds);
            if (CollUtil.isNotEmpty(userIds)) {
                userIds.forEach(id -> redisService.delActiveSpace(id));
            }
            memberMapper.updateIsDeletedBySpaceIds(spaceIds);
            XxlJobHelper.log(spaceIds + "has been deleted.");
        }
    }
}
