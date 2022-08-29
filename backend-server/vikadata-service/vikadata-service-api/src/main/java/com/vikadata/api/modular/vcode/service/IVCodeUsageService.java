package com.vikadata.api.modular.vcode.service;

import com.vikadata.api.model.dto.vcode.VCodeDTO;

/**
 * <p>
 * V 码记录 服务接口
 * </p>
 *
 * @author Chambers
 * @date 2020/9/28
 */
public interface IVCodeUsageService {

    /**
     * 创建 V 码记录
     *
     * @param operator 操作者
     * @param name     操作者名称
     * @param type     操作类型（领取/使用）
     * @param code     V 码
     * @author Chambers
     * @date 2020/9/28
     */
    void createUsageRecord(Long operator, String name, Integer type, String code);

    /**
     * 获取邀请者的用户ID
     *
     * @param userId 受邀者用户ID
     * @return VCodeDTO
     * @author Chambers
     * @date 2021/6/30
     */
    VCodeDTO getInvitorUserId(Long userId);
}
