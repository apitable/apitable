package com.vikadata.api.modular.developer.service;

import java.util.List;

import com.vikadata.api.enums.developer.GmAction;
import com.vikadata.api.enums.space.SpaceCertification;
import com.vikadata.integration.vika.model.UserContactInfo;

/**
 * <p>
 * GM 服务接口
 * </p>
 *
 * @author Chambers
 * @date 2020/7/27
 */
public interface IGmService {

    /**
     * 校验权限
     *
     * @param userId 用户ID
     * @param action 执行动作
     * @author Chambers
     * @date 2020/7/27
     */
    void validPermission(Long userId, GmAction action);

    /**
     * 更新GM权限配置
     *
     * @param userId    用户ID
     * @param dstId     配置表ID
     * @author Chambers
     * @date 2022/6/23
     */
    void updateGmPermissionConfig(Long userId, String dstId);

    /**
     * 空间站企业认证
     *
     * @param spaceId 空间站ID
     * @param operatorUserUuid 操作用户ID
     * @param certification 认证等级
     * @author zoe zheng
     * @date 2022/4/11 11:04
     */
    void spaceCertification(String spaceId, String operatorUserUuid, SpaceCertification certification);

    /**
     * 补偿处理飞书租户
     * @param tenantId 租户
     */
    void handleFeishuEvent(String tenantId);

    /**
     * query and write back user's mobile phone and email by userId
     *
     * @param host        host
     * @param datasheetId datasheet's id
     * @param viewId      view's id
     * @param token       api token
     * @author liuzijing
     * @date 2022/9/5
     */
    void queryAndWriteBackUserContactInfo(String host, String datasheetId, String viewId, String token);

    /**
     * query user's mobile phone and email by userId
     *
     * @param userContactInfos user's contact info
     * @return UserContactInfos user's contact info
     * @author liuzijing
     * @date 2022/9/5
     */
    List<UserContactInfo> getUserPhoneAndEmailByUserId(List<UserContactInfo> userContactInfos);
}
