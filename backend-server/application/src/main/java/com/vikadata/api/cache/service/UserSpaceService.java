package com.vikadata.api.cache.service;

import java.util.List;

import com.vikadata.api.cache.bean.UserSpaceDto;

/**
 * <p>
 * space stayed by user service
 * </p>
 *
 * @author Shawn Deng
 */
public interface UserSpaceService {

    /**
     * cache space stayed by users
     *
     * @param userId   user id
     * @param spaceId  space id
     * @param memberId member id
     * @return user stayed space object
     */
    UserSpaceDto saveUserSpace(Long userId, String spaceId, Long memberId);

    /**
     * get member id in space stayed by user
     *
     * @param userId  user id
     * @param spaceId space id
     * @return member id
     */
    Long getMemberId(Long userId, String spaceId);

    /**
     * delete special cache space stayed by user
     *
     * @param userId  user id
     * @param spaceId space id
     */
    void delete(Long userId, String spaceId);

    /**
     * get cache space stayed by users
     *
     * @param userId  user id
     * @param spaceId space id
     * @return user stayed space object
     */
    UserSpaceDto getUserSpace(Long userId, String spaceId);

    /**
     * delete cache
     *
     * @param spaceId   space id
     * @param memberIds member id list
     */
    void delete(String spaceId, List<Long> memberIds);

    /**
     * delete space cache
     *
     * @param spaceId   space id
     */
    void delete(String spaceId);
}
