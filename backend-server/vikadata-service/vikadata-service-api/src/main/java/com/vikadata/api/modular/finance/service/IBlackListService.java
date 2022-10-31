package com.vikadata.api.modular.finance.service;

/**
 * <p>
 * Black List Service
 * </p>
 */
public interface IBlackListService {

    /**
     * Check black user
     */
    void checkBlackUser(Long userId);

    /**
     * Check black space
     */
    void checkBlackSpace(String spaceId);
}
