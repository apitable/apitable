package com.vikadata.api.modular.vcode.service;

import com.vikadata.api.model.dto.vcode.VCodeDTO;

/**
 * <p>
 * VCode Usage Service
 * </p>
 */
public interface IVCodeUsageService {

    /**
     * Create usage record
     */
    void createUsageRecord(Long operator, String name, Integer type, String code);

    /**
     * Get the user ID of the inviter
     */
    VCodeDTO getInvitorUserId(Long userId);
}
