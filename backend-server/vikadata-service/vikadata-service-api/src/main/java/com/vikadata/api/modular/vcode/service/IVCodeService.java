package com.vikadata.api.modular.vcode.service;

import java.util.List;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import com.vikadata.api.model.ro.vcode.VCodeCreateRo;
import com.vikadata.api.model.ro.vcode.VCodeUpdateRo;
import com.vikadata.api.model.vo.vcode.VCodePageVo;

/**
 * <p>
 * VCode Service
 * </p>
 */
public interface IVCodeService {

    /**
     * Get the user's personal invitation code
     */
    String getUserInviteCode(Long userId);

    /**
     * Get VCode pagination view information
     */
    IPage<VCodePageVo> getVCodePageVo(Page<VCodePageVo> page, Integer type, Long activityId);

    /**
     * Get the official invitation code
     */
    String getOfficialInvitationCode(String appId, String unionId);

    /**
     * Get active VCode
     */
    String getActivityCode(Long activityId, String appId, String unionId);

    /**
     * Create VCode
     */
    List<String> create(Long userId, VCodeCreateRo ro);

    /**
     * Edit VCode
     */
    void edit(Long userId, String code, VCodeUpdateRo ro);

    /**
     * Delete VCode
     */
    void delete(Long userId, String code);

    /**
     * Check the invitation code
     */
    void checkInviteCode(String inviteCode);

    /**
     * Use an invitation code
     */
    void useInviteCode(Long useUserId, String useUserName, String inviteCode);

    /**
     * Create a personal invitation code
     */
    void createPersonalInviteCode(Long userId);

    /**
     * Verify redemption code
     */
    void checkRedemptionCode(Long userId, String redemptionCode);

    /**
     * Use redemption code
     */
    Integer useRedemptionCode(Long userId, String redemptionCode);
}
