package com.vikadata.api.cache.service;

import com.vikadata.api.cache.bean.OpenedSheet;

/**
 * <p>
 * 用户在空间内打开的数表信息缓存 服务类
 * </p>
 *
 * @author Chambers
 * @date 2020/3/18
 */
public interface UserSpaceOpenedSheetService {

	/**
	 * 获取用户指定空间打开状态的数表信息
	 *
	 * @param userId  用户ID
	 * @param spaceId 空间ID
	 * @return 打开状态的数表信息
	 * @author Chambers
	 * @date 2020/3/18
	 */
	OpenedSheet getOpenedSheet(Long userId, String spaceId);

	/**
	 * 刷新缓存
	 *
	 * @param userId       用户ID
	 * @param spaceId      空间ID
	 * @param openedSheet  打开的数表
	 * @author Chambers
	 * @date 2020/3/18
	 */
	void refresh(Long userId, String spaceId, OpenedSheet openedSheet);

    /**
     * 删除缓存
     *
     * @param userId  用户ID
     * @param spaceId 空间ID
     * @author Chambers
     * @date 2019/11/18
     */
    void delete(Long userId, String spaceId);
}
