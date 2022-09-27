package com.vikadata.api.modular.organization.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.model.dto.asset.UploadDataDto;
import com.vikadata.api.model.dto.organization.MemberDto;
import com.vikadata.api.model.ro.organization.TeamAddMemberRo;
import com.vikadata.api.model.ro.organization.UpdateMemberOpRo;
import com.vikadata.api.model.ro.organization.UpdateMemberRo;
import com.vikadata.api.model.vo.organization.MemberBriefInfoVo;
import com.vikadata.api.model.vo.organization.MemberInfoVo;
import com.vikadata.api.model.vo.organization.SearchMemberResultVo;
import com.vikadata.api.model.vo.organization.SearchMemberVo;
import com.vikadata.api.model.vo.organization.UploadParseResultVO;
import com.vikadata.api.modular.social.model.TenantMemberDto;
import com.vikadata.entity.MemberEntity;

import org.springframework.web.multipart.MultipartFile;

/**
 * <p>
 * 组织架构-成员表 服务类
 * </p>
 *
 * @author Chambers
 * @since 2019-11-06
 */
public interface IMemberService extends IService<MemberEntity> {

    /**
     * get member name by id
     * @param memberId member id
     * @return member name
     */
    String getMemberNameById(Long memberId);

    /**
     * 获取成员ID
     *
     * @param userId 用户ID
     * @param spaceId 空间ID
     * @return MemberId
     */
    Long getMemberIdByUserIdAndSpaceId(Long userId, String spaceId);

    /**
     * 获取成员信息
     *
     * @param userId 用户ID
     * @param spaceId 空间ID
     * @return MemberId
     */
    MemberEntity getByUserIdAndSpaceId(Long userId, String spaceId);

    /**
     * 获取成员信息
     *
     * @param userIds 用户ID
     * @param spaceId 空间ID
     * @return MemberId
     */
    List<MemberEntity> getByUserIdsAndSpaceId(List<Long> userIds, String spaceId);

    /**
     * 检查用户是否在空间内
     *
     * @param userId 用户ID
     * @param spaceId 空间ID
     */
    void checkUserIfInSpace(Long userId, String spaceId);

    /**
     * 设置主管理员
     *
     * @param memberId 成员ID
     */
    void setMemberMainAdmin(Long memberId);

    /**
     * 取消主管理员
     *
     * @param memberId 成员ID
     */
    void cancelMemberMainAdmin(Long memberId);

    /**
     * 获取成员所在的空间站ID
     *
     * @param memberId 成员ID
     * @return 空间ID
     */
    String getSpaceIdByMemberId(Long memberId);

    /**
     * 获取成员归属的所有组织单元ID
     *
     * @param memberId 成员ID
     * @return Unit id List
     */
    List<Long> getUnitsByMember(Long memberId);

    /**
     * 获取空间绑定第三方用户的成员
     *
     * @param spaceId 空间ID
     * @return MemberEntity List
     */
    List<MemberEntity> getSocialMemberBySpaceId(String spaceId, long offset, int limit);

    /**
     * 获取空间的成员ID
     *
     * @param spaceId 空间ID
     * @return 成员ID
     */
    List<Long> getMemberIdsBySpaceId(String spaceId);

    /**
     * 获取空间的所有成员
     *
     * @param spaceId 空间ID
     * @param ignoreDeleted 是否忽略删除
     * @return MemberEntity List
     */
    List<MemberEntity> getMembersBySpaceId(String spaceId, boolean ignoreDeleted);

    /**
     * 获取成员ID
     *
     * @param spaceId 空间ID
     * @param openId 第三方平台用户OPEN_ID
     * @return 成员ID
     */
    Long getMemberIdBySpaceIdAndOpenId(String spaceId, String openId);

    /**
     * 获取空间内的成员
     *
     * @param spaceId 空间ID
     * @param openId 第三方平台用户OPEN_ID
     * @return MemberEntity
     */
    MemberEntity getBySpaceIdAndOpenId(String spaceId, String openId);

    /**
     * 获取空间内的成员
     *
     * @param spaceId 空间ID
     * @param openIds 第三方平台用户OPEN_ID
     * @return MemberEntity
     */
    List<MemberEntity> getBySpaceIdAndOpenIds(String spaceId, List<String> openIds);

    /**
     * 获取空间内存在此邮箱的成员
     *
     * @param spaceId 空间ID
     * @param email 邮箱
     * @return MemberEntity
     */
    MemberEntity getBySpaceIdAndEmail(String spaceId, String email);

    /**
     * get by space id and email with ignore email
     * @param spaceId space id
     * @param email email
     * @return entity
     */
    MemberEntity getBySpaceIdAndEmailIgnoreDeleted(String spaceId, String email);

    /**
     * get by space id and email list with ignore email
     * @param spaceId space id
     * @param emails email list
     * @return entity
     */
    List<MemberEntity> getBySpaceIdAndEmailsIgnoreDeleted(String spaceId, List<String> emails);

    /**
     * 获取空间站的主管理员
     *
     * @param spaceId 空间站 ID
     * @return 成员信息
     */
    MemberEntity getAdminBySpaceId(String spaceId);

    /**
     * 获取空间站的主管理员列表。该方法用于修复之前设置管理员的 BUG，正常只有一个主管理员
     *
     * @param spaceId 空间站 ID
     * @return 成员信息
     */
    List<MemberEntity> getAdminListBySpaceId(String spaceId);

    /**
     * 获取成员对应的OPEN_ID
     *
     * @param memberId 成员ID
     * @return openId
     */
    String getOpenIdByMemberId(Long memberId);

    /**
     * 获取成员ID
     * 逻辑删除也要获取到
     *
     * @param spaceId 空间ID
     * @param openId 第三方平台用户OPEN_ID
     * @return 成员ID
     */
    Long getMemberIdByOpenIdIgnoreDelete(String spaceId, String openId);

    /**
     * 查询成员
     * 忽略逻辑删除标记，慎用
     *
     * @param memberId 成员ID
     * @return MemberEntity
     */
    MemberEntity getByIdIgnoreDelete(Long memberId);

    /**
     * 获取用户所有空间的成员信息
     *
     * @param userId 用户ID
     * @return MemberEntity List
     */
    List<MemberEntity> getByUserId(Long userId);

    /**
     * 获取用户所有空间的ID
     *
     * @param userId 用户ID
     * @return 空间ID
     */
    List<String> getSpaceIdByUserId(Long userId);

    /**
     * 获取用户所在空间里未修改过站内昵称的空间ID
     *
     * @param userId 用户ID
     * @return 空间ID列表
     */
    List<String> getSpaceIdWithoutNameModifiedByUserId(Long userId);

    /**
     * 获取邮箱未激活的成员
     *
     * @param email 邮箱地址
     * @return MemberDto List
     */
    List<MemberDto> getInactiveMemberByEmails(String email);

    /**
     * 更改用户所有空间站的昵称
     *
     * @param userId 用户ID
     * @param memberName 成员昵称
     */
    void updateMemberNameByUserId(Long userId, String memberName);

    /**
     * 更新用户所在空间的手机号
     *
     * @param userId 用户ID
     * @param mobile 手机号码
     */
    void updateMobileByUserId(Long userId, String mobile);

    /**
     * 重置用户所在空间的手机号
     *
     * @param userId 用户ID
     */
    void resetMobileByUserId(Long userId);

    /**
     * 更新用户所在空间的邮箱地址
     *
     * @param userId 用户ID
     * @param email 邮箱地址
     */
    void updateEmailByUserId(Long userId, String email);

    /**
     * 重置用户所在空间的邮箱地址
     *
     * @param userId 用户ID
     */
    void resetEmailByUserId(Long userId);

    /**
     * 获取成员列表的基本信息
     *
     * @param memberIds 成员 ID 列表
     * @return 成员的基本信息
     */
    List<MemberBriefInfoVo> getMemberBriefInfo(List<Long> memberIds);

    /**
     * 批量创建成员
     * 每个成员的主键ID必须指定
     * 已绑定根部门
     *
     * @param spaceId 空间ID
     * @param entities 实体类集合
     */
    void batchCreate(String spaceId, List<MemberEntity> entities);

    /**
     * 邮箱邀请成员
     *
     * @param spaceId 空间ID
     * @param teamId 部门ID
     * @param emails 邀请邮箱列表
     */
    @Deprecated
    void userInvitation(String spaceId, Long teamId, List<String> emails);

    /**
     * 恢复成员
     *
     * @param member 实体
     */
    void restoreMember(MemberEntity member);

    /**
     *
     * @param inviteUserId invite user id
     * @param spaceId space id
     * @param emails email list
     */
    void emailInvitation(Long inviteUserId, String spaceId, List<String> emails);

    /**
     * 发送单个邀请邮件到邮箱地址
     *
     * @param spaceId 空间ID
     * @param fromMemberId 邀请成员ID
     * @param email 邮件
     */
    void sendInviteEmail(String lang, String spaceId, Long fromMemberId, String email);

    /**
     * 发送邀请空间通知邮件
     *
     * @param spaceId 空间ID
     * @param fromMemberId 来自成员ID
     * @param email 邮箱地址
     */
    void sendUserInvitationNotifyEmail(String lang, String spaceId, Long fromMemberId, String email);

    /**
     * send user invitation email
     *
     * @param spaceId space id
     * @param inviter inviter is member id
     * @param inviteUrl invite link
     * @param emailAddress to email address
     */
    void sendUserInvitationEmail(String lang, String spaceId, Long inviter, String inviteUrl, String emailAddress);

    /**
     * 部门关联成员
     *
     * @param spaceId 空间ID
     * @param data 请求参数
     */
    void addTeamMember(String spaceId, TeamAddMemberRo data);

    /**
     * 编辑成员信息
     *
     * @param memberId 成员ID
     * @param opRo 请求参数
     */
    void updateMember(Long memberId, UpdateMemberOpRo opRo);

    /**
     * 编辑成员信息
     *
     * @param data 请求参数
     */
    void updateMember(UpdateMemberRo data);

    /**
     * 批量更新成员所属部门
     *
     * @param spaceId 空间ID
     * @param memberIds 成员ID集合
     * @param teamIds 追加的部门
     */
    void updateMemberByTeamId(String spaceId, List<Long> memberIds, List<Long> teamIds);

    /**
     * 从指定部门批量删除指定成员
     *
     * @param spaceId 空间ID
     * @param memberIds 成员ID集合
     * @param teamId 部门ID
     */
    void batchDeleteMemberFromTeam(String spaceId, List<Long> memberIds, Long teamId);

    /**
     * 根据成员ID逻辑删除
     *
     * @param memberIds 成员ID列表
     */
    void removeByMemberIds(List<Long> memberIds);

    /**
     * 删除空间站内的所有成员
     *
     * @param spaceId 空间站 ID
     */
    void removeAllMembersBySpaceId(String spaceId);

    /**
     * 从空间里彻底删除指定成员
     *
     * @param spaceId 空间ID
     * @param memberIds 成员ID集合
     * @param mailNotify 是否发送邮件通知
     */
    void batchDeleteMemberFromSpace(String spaceId, List<Long> memberIds, boolean mailNotify);

    /**
     * 将指定的空间更改为活跃状态
     *
     * @param spaceId 空间ID
     * @param userId 用户ID
     */
    void updateActiveStatus(String spaceId, Long userId);

    /**
     * 将空间内除了主管理员外的成员删除（保留部门成员关联）
     *
     * @param spaceId 空间ID
     * @param userId 主管理员对应的用户ID
     */
    void preDelBySpaceId(String spaceId, Long userId);

    /**
     * 处理解析文件
     *
     * @param spaceId 空间ID
     * @param multipartFile 待解析文件
     * @return UploadParseResultVo
     */
    UploadParseResultVO parseExcelFile(String spaceId, MultipartFile multipartFile);

    /**
     * 保存上传数据
     *
     * @param spaceId 空间ID
     * @param uploadData 上传数据
     * @param inviteEmails 邀请列表，回传
     * @param notifyEmails 通知列表，回传
     * @param teamCreatable 操作是否可以创建部门
     * @return 修改数
     */
    Long saveUploadData(String spaceId, UploadDataDto uploadData, List<String> inviteEmails, List<String> notifyEmails, boolean teamCreatable);

    /**
     * 发送邮箱邀请的用户通知
     *
     * @param fromUserId 邀请人
     * @param invitedMemberIds 邀请的用户
     * @param spaceId 空间
     * @param isToFromUser 是否发送给邀请人
     */
    void sendInviteNotification(Long fromUserId, List<Long> invitedMemberIds, String spaceId, Boolean isToFromUser);

    /**
     * 创建成员
     *
     * @param userId 用户ID
     * @param spaceId 空间ID
     * @param teamId 关联部门ID（非必须）
     * @return Member Id
     */
    Long createMember(Long userId, String spaceId, Long teamId);

    /**
     * 批量更新
     * 不管是否逻辑删除
     *
     * @param entities 实体集合
     */
    void updatePartPropertyBatchByMemberId(String spaceId, List<MemberEntity> entities);

    /**
     * 根据spaceId获取Member List
     *
     * @param spaceId 空间Id
     * @return Member List
     */
    List<TenantMemberDto> getMemberOpenIdListBySpaceId(String spaceId);

    /**
     * 获取随机的成员
     *
     * @param spaceId 空间ID
     * @param excludeMemberId 排除的成员ID
     * @return 成员ID
     */
    Long getRandomMemberId(String spaceId, Long excludeMemberId);

    /**
     * 获取空间的成员总数
     *
     * @param spaceId 空间ID
     * @return 总数
     */
    int getTotalMemberCountBySpaceId(String spaceId);

    /**
     * 预删除成员信息，逻辑删除，支持注销冷静期内账号撤销注销
     *
     * @param memberIds 成员ID列表
     */
    void preDelByMemberIds(List<Long> memberIds);

    /**
     * 取消成员信息删除
     *
     * @param userId 用户ID
     */
    void cancelPreDelByUserId(Long userId);

    /**
     * 清理openId
     *
     * @param memberId 成员ID
     */
    void clearOpenIdById(Long memberId);

    /**
     * 根据userId获取openId
     *
     * @param userIds 用户的userId
     * @return openId
     */
    List<String> getOpenIdByUserIds(List<Long> userIds);

    /**
     * 根据Id获取openId
     *
     * @param memberIds 成员ID
     * @return openId
     */
    List<String> getOpenIdByIds(List<Long> memberIds);

    /**
     * 通过空间站ID和用户ID查询成员名称
     *
     * @param spaceId 空间站ID
     * @param userId 用户的ID
     * @return 成员名称
     */
    String getMemberNameByUserIdAndSpaceId(Long userId, String spaceId);

    /**
     * 根据手机号获取未激活的空间
     *
     * @param mobile 手机号
     * @return MemberDto List
     */
    List<MemberDto> getInactiveMemberDtoByMobile(String mobile);

    /**
     * 根据邮箱获取未激活的空间
     *
     * @param email 邮箱地址
     * @return MemberDto List
     */
    List<MemberDto> getInactiveMemberDtoByEmail(String email);

    /**
     * 获取用户所在空间数量
     *
     * @param userId 用户ID
     * @return 总数
     */
    int getSpaceCountByUserId(Long userId);

    /**
     * 检查用户是否已经在其中一个空间修改过昵称
     *
     * @param userId 用户ID
     * @return true | false
     */
    boolean checkUserHasModifyNameInSpace(Long userId);

    /**
     * 批量更新成员的名称，openId和删除字段
     *
     * @param updateEntities 批量更新成员数据
     */
    void batchUpdateNameAndOpenIdAndIsDeletedByIds(List<MemberEntity> updateEntities);

    /**
     * batch reset isDeleted and userId
     *
     * @param ids primary key of members
     */
    void batchResetIsDeletedAndUserIdByIds(List<Long> ids);

    /**
     * 从空间恢复成员
     *
     * @param spaceId 空间站ID
     * @param memberIds 成员ID
     */
    void batchRecoveryMemberFromSpace(String spaceId, List<Long> memberIds);

    /**
     * 根据名称模糊查询成员列表
     *
     * @param spaceId 空间ID
     * @param keyword 关键词
     * @param highlightClassName 高亮的样式名称
     * @return 搜索结果
     */
    List<SearchMemberResultVo> getByName(String spaceId, String keyword, String highlightClassName);

    /**
     * 按成员名称模糊搜索成员
     *
     * @param spaceId 空间ID
     * @param keyword 关键词
     * @param filter 是否过滤未加入成员
     * @param highlightClassName 高亮的样式名称
     * @return SearchMemberVo 集合
     */
    List<SearchMemberVo> getLikeMemberName(String spaceId, String keyword, Boolean filter, String highlightClassName);

    /**
     * handle memberInfo's team path name
     *
     * @param memberInfoVo member info view
     * @param spaceId space's id
     */
    void handleMemberTeamInfo(MemberInfoVo memberInfoVo, String spaceId);
}
