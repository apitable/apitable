package com.vikadata.api.shared.cache.service;

import com.vikadata.api.shared.cache.bean.OpenedSheet;

/**
 * <p>
 * opened datasheet by the user in the space
 * </p>
 *
 * @author Chambers
 */
public interface UserSpaceOpenedSheetService {

	/**
	 * get opened datasheet by user in the space
	 *
	 * @param userId  user id
	 * @param spaceId space id
	 * @return OpenedSheet
	 */
	OpenedSheet getOpenedSheet(Long userId, String spaceId);

	/**
	 * refresh cache
	 *
	 * @param userId       user id
	 * @param spaceId      space id
	 * @param openedSheet opened datasheet
	 */
	void refresh(Long userId, String spaceId, OpenedSheet openedSheet);

    /**
     * delete cache
     *
     * @param userId  user id
     * @param spaceId space id
     */
    void delete(Long userId, String spaceId);
}
