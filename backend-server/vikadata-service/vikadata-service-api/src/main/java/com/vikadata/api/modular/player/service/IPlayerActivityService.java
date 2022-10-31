package com.vikadata.api.modular.player.service;

/**
 * <p>
 * Player Activity Service
 * </p>
 */
public interface IPlayerActivityService {

    /**
     * Change status
     */
    void changeStatus(Long userId, Integer wizardId);

    /**
     * Create user activity record
     */
    void createUserActivityRecord(Long userId);
}
