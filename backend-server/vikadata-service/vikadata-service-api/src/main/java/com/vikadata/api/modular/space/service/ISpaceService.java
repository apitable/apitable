package com.vikadata.api.modular.space.service;

import java.util.List;
import java.util.function.Consumer;

import com.baomidou.mybatisplus.extension.service.IService;
import com.vikadata.api.modular.space.model.SpaceCapacityUsedInfo;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.lang.SpaceGlobalFeature;
import com.vikadata.api.model.ro.space.SpaceUpdateOpRo;
import com.vikadata.api.model.vo.space.SpaceInfoVO;
import com.vikadata.api.model.vo.space.SpaceVO;
import com.vikadata.api.model.vo.space.UserSpaceVo;
import com.vikadata.api.modular.internal.model.InternalSpaceCapacityVo;
import com.vikadata.api.modular.internal.model.InternalSpaceUsageVo;
import com.vikadata.api.modular.space.model.GetSpaceListFilterCondition;
import com.vikadata.api.modular.space.model.SpaceUpdateOperate;
import com.vikadata.entity.SpaceEntity;
import com.vikadata.entity.UserEntity;

/**
 * <p>
 * 空间表 服务类
 * </p>
 *
 * @author Chambers
 * @since 2019-10-07
 */
public interface ISpaceService extends IService<SpaceEntity> {

    /**
     * 根据空间ID查询空间信息
     *
     * @param spaceId 空间ID
     * @return SpaceEntity
     */
    SpaceEntity getBySpaceId(String spaceId);

    /**
     * 检查空间是否存在
     * @param spaceId 空间ID
     */
    void checkExist(String spaceId);

    /**
     * 根据空间ID查询空间信息，包括已删除的空间站
     *
     * @param spaceId 空间站 ID
     * @return 空间站信息
     * @author 刘斌华
     * @date 2022-06-16 16:20:59
     */
    SpaceEntity getBySpaceIdIgnoreDeleted(String spaceId);

    /**
     * 批量获取空间信息
     *
     * @param spaceIds 空间ID集合
     * @return SpaceEntity List
     */
    List<SpaceEntity> getBySpaceIds(List<String> spaceIds);

    /**
     * 用户创建空间
     *
     * @param user    用户
     * @param spaceName 空间名称
     * @return 空间ID
     * @author Shawn Deng
     * @date 2020/8/25 15:26
     */
    String createSpace(UserEntity user, String spaceName);

    /**
     * 创建一个不包含用户信息的空间站
     *
     * @param spaceName 空间站名称
     * @return {@link SpaceEntity}
     * @author 刘斌华
     * @date 2022-01-06 17:29:01
     */
    SpaceEntity createWeComIsvSpaceWithoutUser(String spaceName);

    /**
     * 编辑空间
     *
     * @param userId    用户ID
     * @param spaceId   空间id
     * @param spaceOpRo 请求参数
     */
    void updateSpace(Long userId, String spaceId, SpaceUpdateOpRo spaceOpRo);

    /**
     * 预删除
     *
     * @param userId  用户id
     * @param spaceId 空间id
     */
    void preDeleteById(Long userId, String spaceId);

    /**
     * 删除空间
     *
     * @param spaceIds  空间ID列表
     * @author Chambers
     * @date 2022/1/18
     */
    void deleteSpace(Long userId, List<String> spaceIds);

    /**
     * 撤销删除
     *
     * @param userId  用户ID
     * @param spaceId 空间id
     */
    void cancelDelByIds(Long userId, String spaceId);

    /**
     * 退出空间
     *
     * @param spaceId  空间ID
     * @param memberId 成员ID
     */
    void quit(String spaceId, Long memberId);

    /**
     * 查询用户拥有的空间列表
     *
     * @param userId    用户ID
     * @param condition 查询条件
     * @return SpaceVO List
     * @author Shawn Deng
     * @date 2020/12/22 17:44
     */
    List<SpaceVO> getSpaceListByUserId(Long userId, GetSpaceListFilterCondition condition);

    /**
     * 获取空间信息
     *
     * @param spaceId 空间ID
     * @return 空间信息
     * @author Chambers
     * @date 2019/11/29
     */
    SpaceInfoVO getSpaceInfo(String spaceId);

    /**
     * get space capacity used sizes information
     *
     * @param spaceId          space ID
     * @param capacityUsedSize space capacity used sizes
     * @return SpaceCapacityUsedInfo space capacity used information
     * @author liuzijing
     * @date 2022/8/31
     */
    SpaceCapacityUsedInfo getSpaceCapacityUsedInfo(String spaceId, Long capacityUsedSize);

    /**
     * 获取空间的用量信息
     * 内部接口
     *
     * @param spaceId 空间ID
     * @return InternalSpaceUsageVo
     * @author Chambers
     * @date 2021/9/23
     */
    InternalSpaceUsageVo getInternalSpaceUsageVo(String spaceId);

    /**
     * 获取空间的附件容量信息
     * 内部接口
     *
     * @param spaceId 空间ID
     * @return InternalSpaceCapacityVo
     * @author Chambers
     * @date 2020/9/12
     */
    InternalSpaceCapacityVo getSpaceCapacityVo(String spaceId);

    /**
     * 更换主管理员
     *
     * @param spaceId  空间ID
     * @param memberId 新主管理员的成员ID
     * @return 新管理员的用户ID
     * @author Chambers
     * @date 2020/1/21
     */
    Long changeMainAdmin(String spaceId, Long memberId);

    /**
     * 移除主管理员
     *
     * @param spaceId 空间站 ID
     * @author 刘斌华
     * @date 2022-01-12 18:48:33
     */
    void removeMainAdmin(String spaceId);

    /**
     * 获取空间主管理员的成员ID
     *
     * @param spaceId 空间ID
     * @return 用户ID
     * @author Shawn Deng
     * @date 2020/12/14 17:44
     */
    Long getSpaceMainAdminMemberId(String spaceId);

    /**
     * 获取空间主管理员的用户ID
     *
     * @param spaceId 空间ID
     * @return 用户ID
     * @author Shawn Deng
     * @date 2020/12/14 17:44
     */
    Long getSpaceMainAdminUserId(String spaceId);

    /**
     * 检查成员不是空间的主管理员
     * 如果是则报错
     *
     * @param spaceId  空间ID
     * @param memberId 成员ID
     * @author Shawn Deng
     * @date 2020/2/13 22:21
     */
    void checkMemberIsMainAdmin(String spaceId, Long memberId);

    /**
     * 批量检查成员不是空间的主管理员
     * 如果是则报错
     *
     * @param spaceId   空间ID
     * @param memberIds 成员ID列表
     * @author Shawn Deng
     * @date 2020/2/13 22:21
     */
    void checkMembersIsMainAdmin(String spaceId, List<Long> memberIds);

    /**
     * 查询成员是否在空间内
     *
     * @param spaceId  空间ID
     * @param memberId 成员ID
     * @author Shawn Deng
     * @date 2020/2/13 22:21
     */
    void checkMemberInSpace(String spaceId, Long memberId);

    /**
     * 批量查询成员是否在空间内
     *
     * @param spaceId   空间ID
     * @param memberIds 成员ID列表
     * @author Shawn Deng
     * @date 2020/2/13 22:21
     */
    void checkMembersInSpace(String spaceId, List<Long> memberIds);

    /**
     * 获取空间权限资源
     *
     * @param userId  用户ID
     * @param spaceId 空间ID
     * @return UserSpaceVo
     * @author Shawn Deng
     * @date 2020/2/15 19:14
     */
    UserSpaceVo getUserSpaceResource(Long userId, String spaceId);

    /**
     * 获取空间全局属性
     *
     * @param spaceId 空间ID
     * @return SpaceGlobalFeature
     * @author Chambers
     * @date 2021/4/8
     */
    SpaceGlobalFeature getSpaceGlobalFeature(@Param("spaceId") String spaceId);

    /**
     * 更改空间属性状态
     *
     * @param userId    用户ID
     * @param spaceId   空间ID
     * @param feature   修改的属性
     * @author Chambers
     * @date 2021/4/8
     */
    void switchSpacePros(Long userId, String spaceId, SpaceGlobalFeature feature);

    /**
     * 校验是否允许操作空间资源
     *
     * @param spaceId 空间ID
     * @author Shawn Deng
     * @date 2020/12/17 18:52
     */
    void checkCanOperateSpaceUpdate(String spaceId);

    /**
     * 校验是否允许操作空间数据，member,team
     *
     * @param spaceId 空间ID
     * @param spaceUpdateOperates 操作
     * @author zoe zheng
     * @date 2021/9/24 15:32
     */
    void checkCanOperateSpaceUpdate(String spaceId, SpaceUpdateOperate spaceUpdateOperates);

    /**
     * 校验是否允许操作空间资源
     *
     * @param spaceId                空间ID
     * @param opMemberId             操作成员Id
     * @param acceptMemberId         接受操作成员Id（被安排）
     * @param spaceUpdateOperates    操作集合
     * @author Pengap
     * @date 2021/9/7 17:33:58
     */
    void checkCanOperateSpaceUpdate(String spaceId, Long opMemberId, Long acceptMemberId, SpaceUpdateOperate[] spaceUpdateOperates);

    /**
     * 获取关联信息的空间ID
     *
     * @param linkId 关联ID（分享ID 或模板ID）
     * @return spaceId
     * @author Chambers
     * @date 2021/1/25
     */
    String getSpaceIdByLinkId(String linkId);

    /**
     * 是否正在同步通讯录
     * @param spaceId 空间站ID
     * @return Boolean
     * @author zoe zheng
     * @date 2021/11/29 7:04 下午
     */
    Boolean isContactSyncing(String spaceId);

    /**
     * 标记空间正在同步通讯录
     *
     * @param spaceId 空间站ID
     * @author zoe zheng
     * @date 2021/11/29 7:06 下午
     */
    void setContactSyncing(String spaceId, String value);

    /**
     * 标记空间同步通讯录完成
     *
     * @param spaceId 空间站ID
     * @author zoe zheng
     * @date 2021/11/29 7:06 下午
     */
    void contactFinished(String spaceId);

    /**
     * 获取空间名称
     * @param spaceId 空间ID
     * @return 空间名称
     * @author zoe zheng
     * @date 2022/2/23 15:39
     */
    String getNameBySpaceId(String spaceId);

    /**
     * 获取空间主管理员的userId
     * @param spaceId 空间ID
     * @return 主管理员的userId
     * @author zoe zheng
     * @date 2022/3/1 14:49
     */
    Long getSpaceOwnerUserId(String spaceId);

    /**
     * 验证空间是否已经认证过了
     *
     * @param spaceId 空间ID
     * @return boolean
     * @author zoe zheng
     * @date 2022/4/7 14:23
     */
    boolean isCertified(String spaceId);

    /**
     * 切换空间站
     *
     * @param userId    用户ID
     * @param spaceId   切换到的空间站ID
     * @author Pengap
     * @date 2022/4/21 14:19:12
     */
    void switchSpace(Long userId, String spaceId);

    /**
     *  Check whether the user is in space
     * @param userId    user id
     * @param spaceId   space id
     * @param consumer  callback
     */
    void checkUserInSpace(Long userId, String spaceId, Consumer<Boolean> consumer);

}
