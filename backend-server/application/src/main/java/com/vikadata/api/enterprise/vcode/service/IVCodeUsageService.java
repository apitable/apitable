package com.vikadata.api.enterprise.vcode.service;

import com.vikadata.api.enterprise.vcode.dto.VCodeDTO;

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
