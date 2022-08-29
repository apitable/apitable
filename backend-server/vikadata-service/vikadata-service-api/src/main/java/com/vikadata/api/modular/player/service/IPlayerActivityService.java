package com.vikadata.api.modular.player.service;

/**
 * <p>
 * Player - Activity 服务接口
 * </p>
 *
 * @author Chambers
 * @date 2020/6/8
 */
public interface IPlayerActivityService {

    /**
     * 修改状态值
     *
     * @param userId   用户ID
     * @param wizardId 引导ID
     * @author Chambers
     * @date 2020/6/9
     */
    void changeStatus(Long userId, Integer wizardId);

    /**
     * 创建用户活动记录
     *
     * @param userId 用户ID
     * @author Chambers
     * @date 2020/9/21
     */
    void createUserActivityRecord(Long userId);
}
