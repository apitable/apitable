package com.vikadata.api.modular.finance.service;

/**
 * <p>
 * 恶意用户/空间限制接口
 * </p>
 *
 * @author Chambers
 * @date 2022/4/26
 */
public interface IBlackListService {

    /**
     * 恶意用户校验
     *
     * @param userId 用户ID
     * @author Chambers
     * @date 2022/5/20
     */
    void checkBlackUser(Long userId);

    /**
     * 恶意空间校验
     *
     * @param spaceId 空间ID
     * @author Chambers
     */
    void checkBlackSpace(String spaceId);
}
