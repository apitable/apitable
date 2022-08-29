package com.vikadata.scheduler.space.service;

/**
 * <p>
 * 空间表 服务类
 * </p>
 *
 * @author Chambers
 * @date 2019/11/21
 */
public interface ISpaceService {

    /**
     * 删除空间（满足预删除七天或直接删除）
     *
     * @param spaceId 空间ID
     */
    void delSpace(String spaceId);
}
