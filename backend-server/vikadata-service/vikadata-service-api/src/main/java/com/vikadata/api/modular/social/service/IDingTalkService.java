package com.vikadata.api.modular.social.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.vikadata.api.modular.social.model.DingTalkContactDTO;
import com.vikadata.api.modular.social.model.DingTalkContactDTO.DingTalkDepartmentDTO;
import com.vikadata.api.modular.social.model.DingTalkContactDTO.DingTalkUserDTO;
import com.vikadata.social.dingtalk.DingtalkConfig;
import com.vikadata.social.dingtalk.DingtalkConfig.AgentApp;
import com.vikadata.social.dingtalk.enums.DingTalkLanguageType;
import com.vikadata.social.dingtalk.message.Message;
import com.vikadata.social.dingtalk.model.DingTalkAppVisibleScopeResponse;
import com.vikadata.social.dingtalk.model.DingTalkDepartmentDetailResponse.DingTalkDeptDetail;
import com.vikadata.social.dingtalk.model.DingTalkDepartmentSubListResponse.DingTalkDeptBaseInfo;
import com.vikadata.social.dingtalk.model.DingTalkDeptListParentByUserResponse.DingTalkUserParentDeptList;
import com.vikadata.social.dingtalk.model.DingTalkServerAuthInfoResponse;
import com.vikadata.social.dingtalk.model.DingTalkUserDetail;
import com.vikadata.social.dingtalk.model.DingTalkUserListResponse.UserPageResult;
import com.vikadata.social.dingtalk.model.UserInfo;
import com.vikadata.social.dingtalk.model.UserInfoV2;

/**
 * <p>
 * 钉钉集成服务 接口
 * </p>
 * @author zoe zheng
 * @date 2021/5/7 5:09 下午
 */
public interface IDingTalkService {
    /**
     * 根据临时授权码获取用户信息
     *
     * @param agentId 应用的agentId
     * @param code 临时授权码
     * @return
     * @author zoe zheng
     * @date 2021/5/7 6:05 下午
     */
    UserInfoV2 getUserInfoByCode(String agentId, String code);

    /**
     * 根据userId获取用户详细信息
     *
     * @param agentId 应用的agentId
     * @param userId 钉钉应用的userId
     * @return DingTalkUserDetailResponse
     * @author zoe zheng
     * @date 2021/5/7 5:11 下午
     */
    DingTalkUserDetail getUserDetailByUserId(String agentId, String userId);

    /**
     * 根据临时授权码获取用户详细信息
     *
     * @param agentId 应用的agentId
     * @param userId 钉钉应用的userId
     * @return DingTalkUserDetailResponse
     * @author zoe zheng
     * @date 2021/5/7 6:07 下午
     */
    DingTalkUserDetail getUserDetailByCode(String agentId, String userId);

    /**
     * 钉钉应用--获取子部门ID列表
     *
     * @param agentId 应用的agentId
     * @param deptId 父部门ID，根部门传1。
     * @return 子部门ID列表
     * @author zoe zheng
     * @date 2021/5/11 1:25 下午
     */
    List<Long> getDepartmentSubIdList(String agentId, Long deptId);

    /**
     * 获取部门全部成员列表
     *
     * @param agentId 应用的agentId
     * @param deptId 部门ID
     * @param cursor 分页查询的游标
     * @param size 分页大小。
     * @return List<UserDetail>
     * @author zoe zheng
     * @date 2021/5/11 4:25 下午
     */
    UserPageResult getUserDetailList(String agentId, Long deptId, Integer cursor, Integer size);

    /**
     * 获取当前应用根部门下面所有用户信息
     *
     * @param agentId 应用的agentId
     * @param cursor 分页查询的游标
     * @param size 分页大小。
     * @return UserPageResult
     * @author zoe zheng
     * @date 2021/5/11 4:33 下午
     */
    UserPageResult getRootUserDetailList(String agentId, Integer cursor, Integer size);

    /**
     * 获取部门列表
     *
     * @param agentId 应用的agentId
     * @param deptId 部门ID
     * @return List<DeptBaseResponse>
     * @author zoe zheng
     * @date 2021/5/11 5:36 下午
     */
    List<DingTalkDeptBaseInfo> getDepartmentSubList(String agentId, Long deptId);

    /**
     * 注册钉钉回调事件url
     *
     * @param agentId 应用的agentId
     * @param url 回调url
     * @param events 回调事件
     * @author zoe zheng
     * @date 2021/5/12 7:46 下午
     */
    void registerCallbackUrl(String agentId, String url, List<String> events);

    /**
     * 删除钉钉回调事件url
     *
     * @param agentId 应用的agentId
     * @author zoe zheng
     * @date 2021/5/12 8:24 下午
     */
    void deleteCallbackUrl(String agentId);

    /**
     * 发送卡片消息给钉钉用户--工作通知形式
     *
     * @param agentId 应用的agentId
     * @param message 消息内容
     * @param tenantUserIds 钉钉用户ID
     * @return 异步任务ID
     * @author zoe zheng
     * @date 2021/5/14 3:10 下午
     */
    List<String> asyncSendCardMessageToUserPrivate(String agentId, Message message, List<String> tenantUserIds);

    /**
     * 根据appid和第三方公司ID获取agentId
     *
     * @param appId 应用唯一标识
     * @param tenantId 第三集成平台唯一标识
     * @return 应用的agentId
     * @author zoe zheng
     * @date 2021/5/14 7:04 下午
     */
    String getAgentIdByAppIdAndTenantId(String appId, String tenantId);

    /**
     * 获取部门详情
     *
     * @param agentId 应用唯一标识
     * @param deptId 钉钉部门ID
     * @return DingTalkDeptDetail
     * @author zoe zheng
     * @date 2021/5/17 11:22 上午
     */
    DingTalkDeptDetail getDeptDetail(String agentId, Long deptId);

    /**
     * 获取部门详情
     *
     * @param agentId 应用唯一标识
     * @param deptId 钉钉部门ID
     * @param languageType 返回信息语言
     * @return DingTalkDeptDetail
     * @author zoe zheng
     * @date 2021/5/17 11:22 上午
     */
    DingTalkDeptDetail getDeptDetail(String agentId, Long deptId, DingTalkLanguageType languageType);

    /**
     * 获取部门用户ID列表
     *
     * @param agentId 应用唯一标识
     * @param deptId 钉钉部门ID
     * @return 部门用户ID列表
     * @author zoe zheng
     * @date 2021/5/17 11:22 上午
     */
    List<String> getDeptUserIdList(String agentId, Long deptId);

    /**
     * 获取企业授权信息
     *
     * @param agentId 应用唯一标识
     * @return 企业授权信息
     * @author zoe zheng
     * @date 2021/5/21 3:05 下午
     */
    DingTalkServerAuthInfoResponse getServerAuthInfo(String agentId);

    /**
     * 根据应用ID获取授权企业ID
     *
     * @param agentId 应用唯一标识
     * @return 授权企业ID
     * @author zoe zheng
     * @date 2021/5/21 3:30 下午
     */
    String getTenantIdByAgentId(String agentId);

    /**
     * 获取应用可见范围
     *
     * @param agentId 授权应用agentId
     * @return 企业授权信息
     * @author zoe zheng
     * @date 2021/5/21 2:56 下午
     */
    DingTalkAppVisibleScopeResponse getAppVisibleScopes(String agentId);

    /**
     * 获取用户父部门列表
     *
     * @param agentId 授权应用agentId
     * @param userId 钉钉应用userId
     * @return DingTalkUserParentDeptList
     * @author zoe zheng
     * @date 2021/6/9 5:54 下午
     */
    DingTalkUserParentDeptList getUserParentDeptList(String agentId, String userId);

    /**
     * 获取应用可见范围人数
     *
     * @param agentId 授权应用agentId
     * @return 人数
     * @author zoe zheng
     * @date 2021/6/21 6:15 下午
     */
    Integer getAppVisibleUserCount(String agentId);

    /**
     * 获取指定部门的所有父部门列表,包括自己
     *
     * @param agentId agentId
     * @param deptId 部门ID
     * @return 该部门的所有父部门ID列表
     */
    List<Long> getDeptParentIdList(String agentId, Long deptId);

    /**
     *  第三方网站登陆：通过临时授权码Code获取用户信息
     *
     * @param tmpAuthCode 临时授权码Code;
     * @return UserInfo
     * @author zoe zheng
     * @date 2021/4/20 6:28 下午
     */
    UserInfo getUserInfoByCode(String tmpAuthCode);

    /**
     * 通过免登码获取用户信息(v2)
     *
     * @param code 免登授权码
     * @return UserInfoV2
     * @author zoe zheng
     * @date 2021/4/20 6:56 下午
     */
    UserInfoV2 getUserInfoV2ByCode(String code);

    /**
     * 根据userid获取用户详情
     *
     * @param userId 员工唯一标识userid。
     * @return DingTalkUserDetailResponse
     * @author zoe zheng
     * @date 2021/4/20 7:11 下午
     */
    DingTalkUserDetail getUserInfoByUserId(String userId);

    /**
     * 根据agentId获取agentApp的配置信息
     *
     * @param agentId agentId
     * @return AgentApp
     * @author zoe zheng
     * @date 2021/7/20 11:46 上午
     */
    AgentApp getAgentAppById(String agentId);

    /**
     * 获取维格表的钉钉显示配置的ID
     *
     * @return string
     * @author zoe zheng
     * @date 2021/7/20 11:46 上午
     */
    String getVikaDingAppId();

    /**
     *  获取钉钉配置
     *
     * @return DingtalkConfig
     * @author zoe zheng
     * @date 2021/7/20 7:44 下午
     */
    DingtalkConfig getDingTalkConfig();

    /**
     * 获取钉钉事件回调地址
     *
     * @param agentId agentId
     * @return 回调地址
     * @author zoe zheng
     * @date 2021/7/21 10:50 上午
     */
    String getDingTalkEventCallbackUrl(String agentId);

    /**
     * 获取部门全部成员列表
     *
     * @param agentId 应用的agentId
     * @param deptId 部门ID
     * @return List<UserDetail>
     * @author zoe zheng
     * @date 2021/5/11 4:25 下午
     */
    List<DingTalkUserDetail> getDeptAllUserDetailList(String agentId, Long deptId);

    /**
     * 获取部门全部成员map
     *
     * @param agentId 应用的agentId
     * @param deptId 部门Id
     * @return Map<String, DingTalkUserDetail>
     * @author zoe zheng
     * @author zoe zheng
     * @date 2022/4/18 15:45
     */
    Map<String, DingTalkUserDTO> getUserDetailMap(String agentId, Long deptId);

    /**
     * 获取给定部门下所有自部门和所有的用户map
     *
     * @param agentId 应用的agentId
     * @param deptId 部门ID
     * @param userDeptMap 用户部门map
     * @return Map<String, DingTalkUserDetail>
     * @author zoe zheng
     * @author zoe zheng
     * @date 2022/4/18 15:45
     */
    LinkedHashMap<Long, DingTalkContactDTO> getUserDetailSubTreeMapByDeptId(String agentId, Long deptId, LinkedHashMap<Long, DingTalkContactDTO> userDeptMap);

    /**
     * 获取给定部门下所有自部门和所有的用户map
     *
     * @param agentId 应用的agentId
     * @param deptIds 部门ID列表
     * @return Map<Long, Map < String, DingTalkUserDetailDTO>>
     * @author zoe zheng
     * @date 2022/4/18 17:36
     */
    LinkedHashMap<Long, DingTalkContactDTO> getContactSubTreeMapByDeptIds(String agentId, List<Long> deptIds);

    /**
     * 根据部门ID获取通讯录列表
     *
     * @param agentId 应用的agentId
     * @param deptIds 部门ID列表
     * @return Map<Long, Map < String, DingTalkUserDetailDTO>>
     * @author zoe zheng
     * @date 2022/4/18 17:36
     */
    LinkedHashMap<Long, DingTalkContactDTO> getContactTreeMapByDeptIds(String agentId, List<Long> deptIds);

    /**
     * 根据部门ID获取通讯录列表
     *
     * @param agentId 应用的agentId
     * @param openIds 用户的openID列表
     * @return Map<Long, Map < String, DingTalkUserDetailDTO>>
     * @author zoe zheng
     * @date 2022/4/18 17:36
     */
    LinkedHashMap<Long, DingTalkContactDTO> getContactTreeMapByOpenIds(String agentId, List<String> openIds, LinkedHashMap<Long, DingTalkContactDTO> contactMap);

    /**
     * 根据部门ID获取通讯录列表
     *
     * @param agentId 应用的agentId
     * @return LinkedHashMap<Long, DingTalkContactDTO> 钉钉部门成员信息
     * @author zoe zheng
     * @date 2022/4/18 17:36
     */
    LinkedHashMap<Long, DingTalkContactDTO> getContactTreeMap(String agentId);

    /**
     * 构建部门基本数据
     *
     * @param baseInfo 部门基础信息
     * @return DingTalkDepartmentDTO
     * @author zoe zheng
     * @date 2022/4/19 16:08
     */
    DingTalkDepartmentDTO formatDingTalkDepartmentDto(DingTalkDeptBaseInfo baseInfo);
}
