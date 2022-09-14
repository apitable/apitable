package com.vikadata.api.modular.organization.mapper;

import java.util.Collection;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.vikadata.api.model.dto.organization.MemberDto;
import com.vikadata.api.model.dto.organization.SearchMemberDto;
import com.vikadata.api.model.dto.organization.SpaceMemberDto;
import com.vikadata.api.model.dto.organization.SpaceMemberIdDto;
import com.vikadata.api.model.dto.player.PlayerBaseDto;
import com.vikadata.api.model.vo.datasheet.FieldRoleMemberVo;
import com.vikadata.api.model.vo.node.NodeRoleMemberVo;
import com.vikadata.api.model.vo.organization.MemberInfoVo;
import com.vikadata.api.model.vo.organization.SearchMemberVo;
import com.vikadata.api.model.vo.organization.UnitMemberVo;
import com.vikadata.api.model.vo.space.MainAdminInfoVo;
import com.vikadata.api.modular.mapper.ExpandBaseMapper;
import com.vikadata.api.modular.organization.model.MemberBaseInfoDTO;
import com.vikadata.api.modular.social.model.TenantMemberDto;
import com.vikadata.entity.MemberEntity;

/**
 * <p>
 * 组织架构-成员表 Mapper 接口
 * </p>
 *
 * @author Chambers
 * @since 2019-11-06
 */
public interface MemberMapper extends ExpandBaseMapper<MemberEntity> {

    /**
     * 根据邮箱查找未激活的成员
     * updated：根据邮箱查找未激活且手机号码和用户id为NULL的记录id和空间id。
     *
     * @param email 邮箱
     * @return 未激活的成员列表
     * @author Shawn Deng
     * @date 2020/1/11 11:51
     */
    List<MemberDto> selectInactiveMemberByEmail(@Param("email") String email);

    /**
     * 根据手机号查找未激活的成员
     * updated: 未被使用过。
     *
     * @param mobile 手机号
     * @return 未激活的成员列表
     * @author Chambers
     * @date 2020/8/28
     */
    List<MemberDto> selectInactiveMemberByMobile(@Param("mobile") String mobile);

    /**
     * 根据空间和邮箱地址查询总记录数
     *
     *
     * @param spaceId 空间ID
     * @param email   邮箱地址
     * @return 总数
     * @author Shawn Deng
     * @date 2019/12/18 02:03
     */
    Integer selectCountBySpaceIdAndEmail(@Param("spaceId") String spaceId, @Param("email") String email);

    /**
     * 根据名称模糊查询成员列表
     * updated：Id为spaceId的空间下根据名称模糊查询符合memberName要求的成员。
     *
     * <p>
     * 只查询非企微服务商成员，或者企微服务商已改名的成员
     * </p>
     *
     * @param spaceId    空间ID
     * @param memberName 成员名称
     * @return 搜索结果
     * @author Shawn Deng
     * @date 2019/11/8 11:48
     */
    List<SearchMemberDto> selectByName(@Param("spaceId") String spaceId, @Param("memberName") String memberName);

    /**
     * 按成员 openId 搜索成员
     *
     * <p>
     * 只查询企微服务商未改名的成员
     * </p>
     *
     * @param spaceId 空间ID
     * @param openIds 第三方用户 ID 列表
     * @return 搜索结果
     * @author 刘斌华
     * @date 2022-04-12 17:07:55
     */
    List<SearchMemberDto> selectByNameAndOpenIds(@Param("spaceId") String spaceId, @Param("openIds") List<String> openIds);

    /**
     * 根据名称模糊搜索成员ID
     * updated：Id为spaceId的空间下根据名称模糊查询符合memberName要求的成员id。
     *
     * <p>
     * 只查询非企微服务商成员，或者企微服务商已改名的成员
     * </p>
     *
     * @param spaceId  空间ID
     * @param likeName 模糊词
     * @return 成员ID结果
     * @author Shawn Deng
     * @date 2020/2/24 11:47
     */
    List<Long> selectMemberIdsLikeName(@Param("spaceId") String spaceId, @Param("likeName") String likeName);

    /**
     * 按成员 openId 搜索成员
     *
     * <p>
     * 只查询企微服务商未改名的成员
     * </p>
     *
     * @param spaceId 空间ID
     * @param openIds 第三方用户 ID 列表
     * @return 成员ID结果
     * @author 刘斌华
     * @date 2022-04-12 18:42:10
     */
    List<Long> selectMemberIdsLikeNameByOpenIds(@Param("spaceId") String spaceId, @Param("openIds") List<String> openIds);

    /**
     * 根据成员名称查询ID
     * updated：Id为spaceId的空间下根据名称查询成员名称符合list元素要求的成员id。
     *
     * @param spaceId     空间ID
     * @param memberNames 成员名称列表
     * @return ID 集合
     * @author Chambers
     * @date 2020/7/13s
     */
    List<Long> selectIdBySpaceIdAndNames(@Param("spaceId") String spaceId, @Param("list") List<String> memberNames);

    /**
     * 查询部门下的成员的用户ID
     *
     * @param teamId 部门ID
     * @return result
     * @author Chambers
     * @date 2020/7/15
     */
    List<Long> selectUserIdByTeamId(@Param("teamId") Long teamId);

    /**
     * 查询成员详情
     *
     * @param memberId 成员ID
     * @return MemberInfoVo
     * @author Shawn Deng
     * @date 2019/11/18 11:59
     */
    MemberInfoVo selectInfoById(@Param("memberId") Long memberId);

    /**
     * 查询根部门下的所有成员
     * TODO: 2022/4/1 非法SQL，SQL未使用到索引
     *
     * @param spaceId 空间ID
     * @return MemberInfoVo
     * @author Chambers
     * @date 2020/7/24
     */
    List<MemberInfoVo> selectMembersByRootTeamId(@Param("spaceId") String spaceId);

    /**
     * 查询指定部门的成员列表
     *
     * @param teamIds 部门ID
     * @return MemberInfoVo
     * @author Chambers
     * @date 2020/7/24
     */
    List<MemberInfoVo> selectMembersByTeamId(@Param("teamIds") List<Long> teamIds);

    /**
     * 获取成员名称
     * 无论是否删除都查询
     *
     * @param id 成员ID
     * @return 成员名称
     * @author Chambers
     * @date 2019/11/27
     */
    String selectMemberNameById(@Param("id") Long id);

    /**
     * 获取成员基础信息
     *
     * @param userId  用户ID
     * @param spaceId 空间ID
     * @return 基础信息
     * @author Chambers
     * @date 2021/1/22
     */
    MemberDto selectDtoByUserIdAndSpaceId(@Param("userId") Long userId, @Param("spaceId") String spaceId);

    /**
     * 获取成员基础信息
     * （成员表无is_deleted=0，避免获取不到已不在空间的创始人信息）
     *
     * @param memberId 成员ID
     * @return 基础信息
     * @author Chambers
     * @date 2019/11/29
     */
    MemberDto selectDtoByMemberId(@Param("memberId") Long memberId);

    /**
     * 获取成员基础信息 <br/>
     * 没有携带isDelete字段
     *
     * @param userId  用户ID
     * @param spaceId 空间ID
     * @return 完整的基础信息（有头像）
     * @author Pengap
     * @date 2021/7/29 18:03:48
     */
    MemberDto selectMemberDtoByUserIdAndSpaceId(@Param("userId") Long userId, @Param("spaceId") String spaceId);

    /**
     * 修改成员名称
     *
     * @param userId 用户ID
     * @param name   名称
     * @return 修改条数
     * @author Chambers
     * @date 2019/11/30
     */
    int updateMemberNameByUserId(@Param("userId") Long userId, @Param("name") String name);

    /**
     * 修改成员'SocialNameModified'字段状态
     *
     * @param userId 用户ID
     * @return 影响条数
     * @author Pengap
     * @date 2022/3/10 23:06:53
     */
    int updateSocialNameModifiedByUserId(@Param("userId") Long userId);

    /**
     * 修改用户对应的所有成员的手机号
     *
     * @param userId 用户ID
     * @param mobile 手机号
     * @return 更改个数
     * @author Chambers
     * @date 2020/2/4
     */
    int updateMobileByUserId(@Param("userId") Long userId, @Param("mobile") String mobile);

    /**
     * 清空用户对应的所有成员的手机号码
     *
     * @param userId 用户ID
     * @return 修改数
     * @author Chambers
     * @date 2020/3/26
     */
    int resetMobileByUserId(@Param("userId") Long userId);

    /**
     * 修改用户对应的所有成员的邮箱
     *
     * @param userId 用户ID
     * @param email 邮箱
     * @return 更改个数
     * @author Chambers
     * @date 2020/2/4
     */
    int updateEmailByUserId(@Param("userId") Long userId, @Param("email") String email);

    /**
     * 清空用户对应的所有成员的邮箱
     *
     * @param userId 用户ID
     * @return 修改数
     * @author Chambers
     * @date 2020/3/26
     */
    int resetEmailByUserId(@Param("userId") Long userId);

    /**
     * 更改用户的停留空间活跃状态为否
     *
     * @param userId 用户ID
     * @return 更改个数
     * @author Chambers
     * @date 2019/12/6
     */
    int updateInactiveStatusByUserId(@Param("userId") Long userId);

    /**
     * 将指定的空间更改为活跃状态
     *
     * @param userId  用户ID
     * @param spaceId 空间ID
     * @return 更改个数
     * @author Chambers
     * @date 2019/12/6
     */
    int updateActiveStatusByUserIdAndSpaceId(@Param("userId") Long userId, @Param("spaceId") String spaceId);

    /**
     * 获取用户活跃的空间ID
     *
     * @param userId 用户ID
     * @return 空间ID
     * @author Chambers
     * @date 2019/12/6
     */
    String selectActiveSpaceByUserId(@Param("userId") Long userId);

    /**
     * 查询用户在空间对应的成员ID
     *
     * @param userId  用户ID
     * @param spaceId 空间ID
     * @return 成员ID
     * @author Chambers
     * @date 2019/12/9
     */
    Long selectIdByUserIdAndSpaceId(@Param("userId") Long userId, @Param("spaceId") String spaceId);

    /**
     * 查询用户在空间对应的成员ID
     * 删除也能查到，审计需要
     *
     * @param userId  用户ID
     * @param spaceId 空间ID
     * @return 成员ID
     * @author Chambers
     * @date 2019/12/9
     */
    Long selectMemberIdByUserIdAndSpaceIdExcludeDelete(@Param("userId") Long userId, @Param("spaceId") String spaceId);

    /**
     * 根据邮件查询空间是否存在邮箱
     * updated：根据邮件查询空间中对应的成员信息。
     *
     * @param spaceId 空间ID
     * @param email   邮件
     * @return MemberEntity
     * @author Shawn Deng
     * @date 2019/12/13 17:38
     */
    MemberEntity selectBySpaceIdAndEmail(@Param("spaceId") String spaceId, @Param("email") String email);

    /**
     * 获取空间站的主管理员
     *
     * @param spaceId 空间站 ID
     * @return 成员信息
     * @author 刘斌华
     * @date 2022-01-19 11:52:00
     */
    MemberEntity selectAdminBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 获取空间站的主管理员列表。该方法用于修复之前设置管理员的 BUG，正常只有一个主管理员
     *
     * @param spaceId 空间站 ID
     * @return 成员信息
     * @author 刘斌华
     * @date 2022-01-19 11:52:00
     */
    List<MemberEntity> selectAdminListBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 获取空间列表第一个作为新的激活空间
     * updated：根据userid获取该用户其中一个非活跃空间。
     *
     * @param userId 用户ID
     * @return 空间ID
     * @author Chambers
     * @date 2019/12/14
     */
    String getFirstSpaceIdByUserId(@Param("userId") Long userId);

    /**
     * 查询用户ID
     *
     * @param spaceIds 空间ID集合
     * @return 用户ID列表
     * @author Chambers
     * @date 2020/1/11
     */
    List<Long> selectUserIdBySpaceIds(@Param("spaceIds") List<String> spaceIds);

    /**
     * 将空间内的成员删除并打上标志（删除空间专用）
     *
     * @param spaceIds      空间ID集合
     * @param filterUserId  指定过滤的用户ID（非必须）
     * @return 更改个数
     * @author Chambers
     * @date 2019/12/23
     */
    int delBySpaceIds(@Param("spaceIds") List<String> spaceIds, @Param("filterUserId") Long filterUserId);

    /**
     * 将空间内预删除状态的成员恢复
     *
     * @param spaceId 空间ID
     * @return 更改个数
     * @author Chambers
     * @date 2019/12/23
     */
    int cancelPreDelBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 冷静期账号逻辑删除Member信息，set status = 2 and set is_deleted = 1
     * @param memberIds 成员ID集合
     * @return 执行影响行数
     */
    int preDelByMemberIds(@Param("memberIds") List<Long> memberIds);

    /**
     * 允许冷静期账号撤销注销
     * @param userId 用户ID
     * @return 执行影响行数
     */
    int cancelPreDelByUserId(@Param("userId") Long userId);

    /**
     * 激活受导入的成员
     *
     * @param userId 用户ID
     * @param mobile 手机号
     * @return 更改个数
     * @author Chambers
     * @date 2019/12/24
     */
    int updateUserIdByMobile(@Param("userId") Long userId, @Param("mobile") String mobile);

    /**
     * 查询用户ID
     *
     * @param memberId 成员ID
     * @return 用户ID
     * @author Chambers
     * @date 2020/8/20
     */
    Long selectUserIdByMemberId(@Param("memberId") Long memberId);

    /**
     * 通过成员ID获取用户ID
     *
     * @param memberIds 成员ID列表
     * @return 用户ID列表
     * @author Chambers
     * @date 2020/1/6
     */
    List<Long> selectUserIdsByMemberIds(@Param("memberIds") List<Long> memberIds);

    /**
     * 消除空间列表上的红点
     *
     * @param memberId 成员ID
     * @author Chambers
     * @date 2020/2/11
     */
    int updateIsPointById(@Param("memberId") Long memberId);

    /**
     * 查询成员在空间的数量
     * updated：根据空间id和memberId查找成员
     *
     * @param spaceId  空间ID
     * @param memberId 成员ID
     * @return 总数
     * @author Shawn Deng
     * @date 2020/2/13 22:10
     */
    MemberEntity selectMemberIdAndSpaceId(@Param("spaceId") String spaceId, @Param("memberId") Long memberId);

    /**
     * 按成员名称搜索成员
     * updated：根据关键词在某个空间中模糊查找成员。
     *
     * <p>
     * 只查询非企微服务商成员，或者企微服务商已改名的成员
     * </p>
     *
     * @param spaceId 空间ID
     * @param keyword 关键词
     * @param filter  是否过滤未加入成员
     * @return SearchMemberVo 集合
     * @author Shawn Deng
     * @date 2019/11/18 11:59
     */
    List<SearchMemberVo> selectLikeMemberName(@Param("spaceId") String spaceId, @Param("keyword") String keyword, @Param("filter") Boolean filter);

    /**
     * 按成员 openId 搜索成员
     *
     * <p>
     * 只查询企微服务商未改名的成员
     * </p>
     *
     * @param spaceId 空间ID
     * @param openIds 第三方用户 ID 列表
     * @param filter  是否过滤未加入成员
     * @return SearchMemberVo 集合
     * @author 刘斌华
     * @date 2022-04-12 14:58:48
     */
    List<SearchMemberVo> selectLikeMemberNameByOpenIds(@Param("spaceId") String spaceId, @Param("openIds") List<String> openIds, @Param("filter") Boolean filter);

    /**
     * 获取主管理员的信息
     *
     * @param spaceId 空间ID
     * @return vo
     * @author Chambers
     * @date 2020/2/17
     */
    MainAdminInfoVo selectAdminInfoBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 查询成员组织单元视图
     *
     * @param memberId 成员ID
     * @return UnitMemberVo 集合
     * @author Shawn Deng
     * @date 2020/2/22 23:32
     */
    UnitMemberVo selectUnitMemberByMemberId(@Param("memberId") Long memberId);

    /**
     * 批量查询成员组织单元视图
     *
     * @param memberIds 成员ID集合
     * @return UnitMemberVo 集合
     * @author Shawn Deng
     * @date 2020/2/22 23:32
     */
    List<UnitMemberVo> selectUnitMemberByMemberIds(@Param("memberIds") List<Long> memberIds);

    /**
     * 查询空间的所有用户的ID
     *
     * @param spaceId 空间ID
     * @return userIds
     * @author Chambers
     * @date 2020/3/19
     */
    List<Long> selectUserIdBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 查询空间的所有成员的ID
     *
     * @param spaceId      空间ID
     * @return 所有成员ID
     * @author Shawn Deng
     * @date 2020/4/8 22:24
     */
    List<Long> selectMemberIdsBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 查询空间内绑定第三方账户的成员
     *
     * @param spaceId      空间ID
     * @return MemberEntity List
     * @author Shawn Deng
     * @date 2020/12/28 12:25
     */
    List<MemberEntity> selectBindSocialListBySpaceIdWithOffset(@Param("spaceId") String spaceId,
            @Param("offset") long offset, @Param("limit") int limit);

    /**
     * 获取成员所属空间
     *
     * @param memberId 成员ID
     * @return 空间ID
     * @author Shawn Deng
     * @date 2020/5/12 11:03
     */
    String selectSpaceIdByMemberId(@Param("memberId") Long memberId);

    /**
     * 根据spaceId查询管理员userId
     *
     * @param spaceId 空间ID
     * @return 用户ID列表
     * @author zoe zheng
     * @date 2020/5/25 6:15 下午
     */
    List<Long> selectAdminUserIdBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 查询空间的所有激活的成员邮箱
     *
     * @param spaceId 空间ID
     * @return 邮件地址列表
     * @author Shawn Deng
     * @date 2019/12/12 11:45
     */
    List<String> selectActiveEmailBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 批量查询成员邮箱
     *
     * @param memberIds 成员ID集合
     * @return 邮件地址列表
     * @author Shawn Deng
     * @date 2020/5/28 20:10
     */
    List<String> selectEmailByBatchMemberId(@Param("memberIds") List<Long> memberIds);

    /**
     * 根据邮箱和spaceId查找ID
     *
     * @param emails  邮箱
     * @param spaceId 空间ID
     * @return 成员ID
     * @author zoe zheng
     * @date 2020/6/4 2:55 下午
     */
    List<Long> selectIdsByEmailsAndSpaceId(@Param("emails") List<String> emails, @Param("spaceId") String spaceId);

    /**
     * 根据空间ID和成员ID查询userId
     *
     * @param spaceId 空间ID
     * @param ids     成员ID集合
     * @return userId 列表
     * @author zoe zheng
     * @date 2020/6/8 12:36 下午
     */
    List<Long> selectUserIdBySpaceIdAndIds(@Param("spaceId") String spaceId, @Param("ids") List<Long> ids);

    /**
     * 根据成员ID统计总数
     *
     * @param ids 成员ID集合
     * @return 统计数
     * @author Shawn Deng
     * @date 2020/6/15 19:09
     */
    Integer selectCountByMemberIds(@Param("ids") List<Long> ids);

    /**
     * 根据空间ID和成员ID查询成员详细信息
     *
     * @param memberIds 成员ID列表
     * @return List<PlayerBaseDto> 列表
     * @author zoe zheng
     * @date 2020/6/15 11:13 上午
     */
    List<PlayerBaseDto> selectMemberInfoByMemberIdsIncludeDelete(@Param("memberIds") List<Long> memberIds);

    /**
     * 批量查询用户对应最后加入的成员记录
     * 注意：此查询不查is_deleted字段
     *
     * @param spaceId 空间ID
     * @param userIds 用户ID列表
     * @return dto
     * @author Shawn Deng
     * @date 2020/6/15 17:45
     */
    List<MemberDto> selectDtoBySpaceIdAndUserIds(@Param("spaceId") String spaceId, @Param("userIds") List<Long> userIds);

    /**
     * 查询用户在空间的成员ID
     * 注意：此查询不查is_deleted字段，可能是历史成员，可能本来就在空间内
     *
     * @param userId  用户ID
     * @param spaceId 空间ID
     * @return MemberEntity
     * @author Shawn Deng
     * @date 2020/6/19 18:40
     */
    MemberEntity selectByUserIdAndSpaceIdIgnoreDelete(@Param("userId") Long userId, @Param("spaceId") String spaceId);

    /**
     * 批量查询成员
     *
     * @param memberIds 成员ID列表
     * @return MemberEntities
     * @author Chambers
     * @date 2022/6/6
     */
    List<MemberEntity> selectByMemberIdsIgnoreDelete(@Param("memberIds") Collection<Long> memberIds);

    /**
     * 批量删除成员（逻辑删除）
     *
     * @param memberIds 成员ID列表
     * @return 执行结果
     * @author Shawn Deng
     * @date 2020/6/19 21:40
     */
    int deleteBatchByIds(@Param("memberIds") List<Long> memberIds);

    /**
     * 全属性修改，为了恢复逻辑删除状态
     *
     * @param entity 成员实体
     * @return 执行结果
     * @author Shawn Deng
     * @date 2020/6/20 12:40
     */
    int restoreMember(@Param("entity") MemberEntity entity);

    /**
     * 查询节点的成员视图
     *
     * @param memberIds 成员ID列表
     * @return NodeRoleMemberVo
     * @author Shawn Deng
     * @date 2020/7/16 16:37
     */
    List<NodeRoleMemberVo> selectNodeRoleMemberByIds(@Param("memberIds") Collection<Long> memberIds);

    /**
     * 查询数表字段角色的成员视图
     *
     * @param memberIds 成员ID列表
     * @return NodeRoleMemberVo
     * @author Shawn Deng
     * @date 2020/7/16 16:37
     */
    List<FieldRoleMemberVo> selectFieldRoleMemberByIds(@Param("memberIds") Collection<Long> memberIds);

    /**
     * 查询空间内已绑定的第三方用户ID
     *
     * @param spaceIds 空间ID集合
     * @return 开放中
     * @author Shawn Deng
     * @date 2020/12/16 16:33
     */
    List<String> selectOpenIdBySpaceId(@Param("spaceIds") List<String> spaceIds);

    /**
     * 查询成员对应的第三方用户标识
     *
     * @param memberId 成员ID
     * @return openId
     * @author Shawn Deng
     * @date 2020/12/16 19:15
     */
    String selectOpenIdByMemberId(@Param("memberId") Long memberId);

    /**
     * 批量查询成员对应的第三方用户标识
     *
     * @param memberIds 成员ID集合
     * @return openIds列表
     * @author Shawn Deng
     * @date 2020/12/16 19:14
     */
    List<String> selectOpenIdByMemberIds(@Param("memberIds") List<Long> memberIds);

    /**
     * 查询成员ID
     *
     * @param spaceId 空间ID
     * @param openId  第三方平台用户所在租户的openId
     * @return 成员ID
     * @author Shawn Deng
     * @date 2020/12/21 17:04
     */
    Long selectMemberIdBySpaceIdAndOpenId(@Param("spaceId") String spaceId, @Param("openId") String openId);

    /**
     * 查询成员ID
     *
     * @param spaceId 空间ID
     * @param openId  第三方平台用户所在租户的openId
     * @return 成员ID
     * @author Shawn Deng
     * @date 2020/12/21 17:04
     */
    Long selectByOpenIdIgnoreDelete(@Param("spaceId") String spaceId, @Param("openId") String openId);

    /**
     * 根据成员ID查询
     * 忽略逻辑删除, 慎用
     *
     * @param memberId 成员ID
     * @return MemberEntity
     * @author Shawn Deng
     * @date 2020/12/22 22:58
     */
    MemberEntity selectByIdIgnoreDelete(@Param("memberId") Long memberId);

    /**
     * 查询成员的OPEN_ID
     *
     * @param memberId 成员ID
     * @return OPEN_ID
     * @author Shawn Deng
     * @date 2020/12/25 12:21
     */
    String selectOpenIdById(@Param("memberId") Long memberId);

    /**
     * 查询成员基础信息
     *
     * @param memberIds 成员ID
     * @return MemberBaseInfoDTO List
     * @author Shawn Deng
     * @date 2021/1/6 19:17
     */
    List<MemberBaseInfoDTO> selectBaseInfoDTOByIds(@Param("memberIds") Collection<Long> memberIds);

    /**
     * 查询空间内的成员
     * @param spaceId 空间ID
     * @param ignoreDeleted 查询是否忽略逻辑删除的数据
     * @return MemberEntity List
     * @author Shawn Deng
     * @date 2021/6/2 14:54
     */
    List<MemberEntity> selectBySpaceId(@Param("spaceId") String spaceId, @Param("ignoreDeleted") boolean ignoreDeleted);

    /**
     * 根据空间ID和第三方用户ID查询成员信息
     *
     * @param spaceId 空间站ID
     * @param openId 第三方用户ID
     * @return 成员信息
     * @author zoe zheng
     * @date 2021/5/27 5:45 下午
     */
    MemberEntity selectBySpaceIdAndOpenId(@Param("spaceId") String spaceId, @Param("openId") String openId);

    /**
     * 根据空间ID和第三方用户ID查询成员信息
     *
     * @param spaceId 空间站ID
     * @param openIds 第三方用户ID
     * @return 成员信息
     * @author zoe zheng
     * @date 2021/5/27 5:45 下午
     */
    List<MemberEntity> selectBySpaceIdAndOpenIds(@Param("spaceId") String spaceId, @Param("openIds") List<String> openIds);

    /**
     * 查询用户在空间的成员信息
     *
     * @param userId 用户ID
     * @param spaceId 空间ID
     * @return MemberEntity
     * @author Shawn Deng
     * @date 2021/5/21 21:05
     */
    MemberEntity selectByUserIdAndSpaceId(@Param("userId") Long userId, @Param("spaceId") String spaceId);

    /**
     * 查询用户在空间的成员信息
     *
     * @param userIds 用户ID
     * @param spaceId 空间ID
     * @return MemberEntity
     * @author Shawn Deng
     * @date 2021/5/21 21:05
     */
    List<MemberEntity> selectByUserIdsAndSpaceId(@Param("userIds") List<Long> userIds, @Param("spaceId") String spaceId);

    /**
     * 获取openId和ID的map
     *
     * 查询空间站成员数
     * @param spaceId 空间ID
     * @return 总数
     * @author Shawn Deng
     * @date 2021/6/2 14:56
     */
    Integer selectCountBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 获取openId和ID的map
     *
     * 查询空间站已激活成员数
     * @param spaceId 空间站ID
     * @return 总数
     * @author 胡海平(Humphrey Hu)
     * @date 2021/12/29 11:16
     * */
    Integer selectActiveMemberCountBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 获取成员的openId
     *
     * @param spaceId 空间站ID
     * @return List<TenantMemberDto>
     * @author zoe zheng
     * @date 2021/6/11 3:43 下午
     */
    List<TenantMemberDto> selectMemberOpenIdBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 更新
     *
     * @param entity 成员
     * @return 执行条数
     */
    int updateMemberById(@Param("entity") MemberEntity entity);

    /**
     * 排除并查询随机成员
     * @param spaceId 空间ID
     * @param memberId 成员ID
     * @return memberId
     * @author Shawn Deng
     * @date 2021/8/19 15:29
     */
    Long selectRandomMemberExclude(@Param("spaceId") String spaceId, @Param("memberId") Long memberId);

    /**
     * 查询用户所有空间的成员ID
     * @param userId 用户ID
     * @return 成员ID集合
     */
    List<MemberEntity> selectByUserId(@Param("userId") Long userId);

    /**
     * 查询该空间站下的所有成员信息
     *
     * @param spaceIds 空间站ID列表
     * @return 空间站成员信息 List
     * @author 胡海平(Humphrey Hu)
     * @date 2021/12/27 16:25
     * */
    List<SpaceMemberDto> selectMembersBySpaceIds(@Param("spaceIds") List<String> spaceIds);

    /**
     * 清理用户成员表信息
     *
     * @param userId 用户ID
     * @return 受影响记录数
     * @author 胡海平
     * @date 2022/01/12 11:49:43
     * */
    int clearMemberInfoByUserId(@Param("userId") Long userId);

    /**
     * 清空openId
     * @param id 成员ID
     * @return 执行行数
     */
    int clearOpenIdById(@Param("id") Long id);

    /**
     * 根据userId获取openId
     * @param userIds 用户的userId
     * @return openId
     * @author zoe zheng
     * @date 2022/3/16 17:30
     */
    List<String> selectOpenIdByUserIds(@Param("userIds") List<Long> userIds);

    /**
     * 通过空间站ID和用户ID查询成员名称
     *
     * @param spaceId 空间站ID
     * @param userId 用户的ID
     * @return 成员名称
     * @author zoe zheng
     * @date 2022/3/29 16:39
     */
    String selectMemberNameByUserIdAndSpaceId(@Param("userId") Long userId, @Param("spaceId") String spaceId);

    /**
     * 统计用户拥有的空间
     * @param userId 用户ID
     * @return 总数
     */
    Integer selectCountByUserId(@Param("userId") Long userId);

    /**
     * 查询用户所有空间已经修改过的成员昵称
     * 用来作用于用户是否新用户，并且未改过任何昵称
     * @param userId 用户ID
     * @return 总数
     */
    Integer selectNameModifiedCountByUserId(@Param("userId") Long userId);

    /**
     * 批量更新成员的名称，openId和删除字段
     * @param updateEntities 批量更新成员数据
     * @return boolean
     * @author zoe zheng
     * @date 2022/4/20 17:52
     */
    Integer batchUpdateNameAndIsDeletedByIds(@Param("updateEntities") List<MemberEntity> updateEntities);

    /**
     * batch update is deleted and user id fields to default values
     * @param ids member table primary key
     * @return Integer
     * @author zoe zheng
     * @date 2022/4/24 15:00
     */
    Integer updateIsDeletedAndUserIdToDefaultByIds(@Param("ids") List<Long> ids);

    /**
     * 根据成员ID查询所属部门ID
     *
     * @param memberId 成员ID
     * @return 部门ID表
     */
    List<Long> selectTeamIdsByMemberId(@Param("memberId") Long memberId);

    /**
     * 根据根据id和空间id查询成员id
     *
     * @param userId 用户id
     * @param spaceIds 空间站id
     * @return SpaceMemberIdDto
     */
    List<SpaceMemberIdDto> selectMemberIdsByUserIdAndSpaceIds(@Param("userId")Long userId, @Param("spaceIds") List<String> spaceIds);
}
