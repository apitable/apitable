package com.vikadata.scheduler.space.cache.service;

/**
 * <p>
 * 缓存服务接口
 * </p>
 *
 * @author Chambers
 * @date 2020/1/14
 */
public interface RedisService {

    /**
     * 删除用户活跃空间缓存
     *
     * @param userId 用户ID
     * @author Shawn Deng
     * @date 2019/11/15 17:23
     */
    void delActiveSpace(Long userId);

    /**
     * 删除视图标签栏缓存
     *
     * @param userId  用户ID
     * @param spaceId 空间ID
     * @author Chambers
     * @date 2019/11/18
     */
    void delOpenedSheet(Long userId, String spaceId);

    /**
     * 删除用户对应空间的内容缓存
     *
     * @param userId  用户ID
     * @param spaceId 空间ID
     * @author Chambers
     * @date 2020/4/2
     */
    void delUserSpace(Long userId, String spaceId);

    /**
     * 获取昨天 changeset 表最大ID
     *
     * @return ID
     * @author Chambers
     * @date 2021/7/8
     */
    Long getYesterdayMaxChangeId();

    /**
     * 删除资源锁
     *
     * @return result
     * @author Chambers
     * @date 2021/11/16
     */
    String delResourceLock();

    /**
     * 刷新API用量表下个月的最小表ID缓存
     *
     * @author Chambers
     * @date 2022/5/25
     */
    void refreshApiUsageNextMonthMinId();
}
