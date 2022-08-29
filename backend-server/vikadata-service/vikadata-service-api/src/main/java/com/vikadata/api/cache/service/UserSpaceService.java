package com.vikadata.api.cache.service;

import com.vikadata.api.cache.bean.UserSpaceDto;

import java.util.List;

/**
 * <p>
 * 用户空间 服务接口
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/12 17:22
 */
public interface UserSpaceService {

    /**
     * 缓存用户相应空间的信息
     *
     * @param userId   用户ID
     * @param spaceId  空间ID
     * @param memberId 成员ID
     * @return 用户空间的内容
     * @author Shawn Deng
     * @date 2019/11/13 21:24
     */
    UserSpaceDto saveUserSpace(Long userId, String spaceId, Long memberId);

    /**
     * 根据用户对应空间的成员ID
     *
     * @param userId  用户ID
     * @param spaceId 空间ID
     * @return 成员ID
     * @author Shawn Deng
     * @date 2019/11/14 12:05
     */
    Long getMemberId(Long userId, String spaceId);

    /**
     * 删除不重新刷新
     *
     * @param userId  用户ID
     * @param spaceId 空间ID
     * @author Shawn Deng
     * @date 2019/11/15 16:07
     */
    void delete(Long userId, String spaceId);

    /**
     * 获取用户对应空间的内容
     *
     * @param userId  用户ID
     * @param spaceId 空间ID
     * @return 用户空间的内容
     * @author Chambers
     * @date 2019/11/27
     */
    UserSpaceDto getUserSpace(Long userId, String spaceId);

	/**
	 * 删除
	 *
	 * @param spaceId   空间ID
	 * @param memberIds 成员ID列表
	 * @author Chambers
	 * @date 2020/2/19
	 */
	void delete(String spaceId, List<Long> memberIds);

	/**
	 * 删除空间内所有人的缓存
	 *
	 * @param spaceId   空间ID
	 * @author Chambers
	 * @date 2020/3/19
	 */
	void delete(String spaceId);
}
