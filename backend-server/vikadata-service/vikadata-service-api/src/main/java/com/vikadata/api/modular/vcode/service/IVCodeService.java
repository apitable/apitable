package com.vikadata.api.modular.vcode.service;

import java.util.List;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import com.vikadata.api.model.ro.vcode.VCodeCreateRo;
import com.vikadata.api.model.ro.vcode.VCodeUpdateRo;
import com.vikadata.api.model.vo.vcode.VCodePageVo;

/**
 * <p>
 * V 码 服务接口
 * </p>
 *
 * @author Chambers
 * @date 2020/8/7
 */
public interface IVCodeService {

    /**
     * 获取用户的个人邀请码
     * @param userId 用户ID
     * @return 邀请码
     */
    String getUserInviteCode(Long userId);

    /**
     * 获取V码分页视图信息
     *
     * @param page       分页请求对象
     * @param type       类型
     * @param activityId 活动ID
     * @return VCodePageVo
     * @author Chambers
     * @date 2022/6/24
     */
    IPage<VCodePageVo> getVCodePageVo(Page<VCodePageVo> page, Integer type, Long activityId);

    /**
     * 获取官方邀请码
     *
     * @param appId   appId
     * @param unionId unionId
     * @return VCode
     * @author Chambers
     * @date 2020/8/10
     */
    String getOfficialInvitationCode(String appId, String unionId);

    /**
     * 获取活动的 VCode
     *
     * @param activityId 活动ID
     * @param appId      appId
     * @param unionId    unionId
     * @return VCode
     * @author Chambers
     * @date 2020/8/25
     */
    String getActivityCode(Long activityId, String appId, String unionId);

    /**
     * 创建 VCode
     *
     * @param userId 用户ID
     * @param ro     请求参数
     * @return codes
     * @author Chambers
     * @date 2020/8/12
     */
    List<String> create(Long userId, VCodeCreateRo ro);

    /**
     * 编辑 VCode 配置
     *
     * @param userId 用户ID
     * @param code   VCode
     * @param ro     请求参数
     * @author Chambers
     * @date 2020/8/25
     */
    void edit(Long userId, String code, VCodeUpdateRo ro);

    /**
     * 删除V码
     *
     * @param userId 用户ID
     * @param code   VCode
     * @author Chambers
     * @date 2022/6/24
     */
    void delete(Long userId, String code);

    /**
     * 校验邀请码
     *
     * @param inviteCode 邀请码
     * @author Chambers
     * @date 2020/8/26
     */
    void checkInviteCode(String inviteCode);

    /**
     * 使用邀请码
     *
     * @param useUserId     使用者用户ID
     * @param useUserName     使用者用户名称
     * @param inviteCode 邀请码
     * @author Chambers
     * @date 2020/8/26
     */
    void useInviteCode(Long useUserId, String useUserName, String inviteCode);

    /**
     * 创建个人邀请码
     *
     * @param userId 用户ID
     * @author Chambers
     * @date 2020/8/27
     */
    void createPersonalInviteCode(Long userId);

    /**
     * 校验兑换码
     *
     * @param userId         用户ID
     * @param redemptionCode 兑换码
     * @author Chambers
     * @date 2020/9/28
     */
    void checkRedemptionCode(Long userId, String redemptionCode);

    /**
     * 使用兑换码
     *
     * @param userId         用户ID
     * @param redemptionCode 兑换码
     * @return V 币数
     * @author Chambers
     * @date 2020/9/28
     */
    Integer useRedemptionCode(Long userId, String redemptionCode);
}
