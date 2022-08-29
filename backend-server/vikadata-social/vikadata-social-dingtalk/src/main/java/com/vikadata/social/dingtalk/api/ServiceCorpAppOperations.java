package com.vikadata.social.dingtalk.api;

import java.util.List;

import com.vikadata.social.dingtalk.enums.DingTalkLanguageType;
import com.vikadata.social.dingtalk.enums.DingTalkOrderField;
import com.vikadata.social.dingtalk.message.Message;
import com.vikadata.social.dingtalk.model.DingTalkAppVisibleScopeResponse;
import com.vikadata.social.dingtalk.model.DingTalkDepartmentDetailResponse.DingTalkDeptDetail;
import com.vikadata.social.dingtalk.model.DingTalkDepartmentSubListResponse.DingTalkDeptBaseInfo;
import com.vikadata.social.dingtalk.model.DingTalkDeptListParentByUserResponse.DingTalkUserParentDeptList;
import com.vikadata.social.dingtalk.model.DingTalkServerAuthInfoResponse;
import com.vikadata.social.dingtalk.model.DingTalkUserAdminListResponse.DingTalkAdminList;
import com.vikadata.social.dingtalk.model.DingTalkUserDetail;
import com.vikadata.social.dingtalk.model.DingTalkUserListResponse.UserPageResult;
import com.vikadata.social.dingtalk.model.UserInfoV2;

/**
 * <p>
 * 企业内部应用接口--授权给第三方企业
 * </p>
 *
 * @author zoe zheng
 * @date 2021/4/19 3:31 下午
 */
public interface ServiceCorpAppOperations {
    /**
     * 获取授权企业应用的access_token
     *
     * @param forceRefresh 强制刷新
     * @return String
     * @author zoe zheng
     * @date 2021/4/20 6:37 下午
     */
    String getAccessToken(String agentId, boolean forceRefresh);

    /**
     * 通过免登码获取用户信息(v2)
     *
     * @param agentId 应用agentId
     * @param code 免登授权码
     * @return UserInfoV2
     * @author zoe zheng
     * @date 2021/5/7 12:10 下午
     */
    UserInfoV2 getUserInfoV2ByCode(String agentId, String code);

    /**
     * 根据userid获取用户详情
     *
     * @param agentId 应用agentId
     * @param userId 用户的userid
     * @return DingTalkUserDetailResponse
     * @author zoe zheng
     * @date 2021/5/7 4:18 下午
     */
    DingTalkUserDetail getUserDetailByUserId(String agentId, String userId);

    /**
     * 获取企业员工数量
     *
     * @param agentId 应用agentId
     * @param onlyActive 是否包含未激活钉钉人数
     * @return 企业员工数量
     * @author zoe zheng
     * @date 2021/5/10 7:33 下午
     */
    Integer getUserCount(String agentId, Boolean onlyActive);

    /**
     * 获取子部门ID列表
     *
     * @param agentId 应用agentId
     * @param dptId 父部门ID，根部门传1
     * @return 子部门ID列表
     * @author zoe zheng
     * @date 2021/5/11 1:15 下午
     */
    List<Long> getDepartmentSubIdList(String agentId, Long dptId);

    /**
     * 获取部门列表
     * 只支持查询下一级子部门，不支持查询多级子部门
     *
     * @param agentId 应用agentId
     * @param dptId 父部门ID，根部门传1
     * @param language 通讯录语言 zh_CN（默认）/ en_US
     * @return 子部门列表
     * @author zoe zheng
     * @date 2021/5/11 1:15 下午
     */
    List<DingTalkDeptBaseInfo> getDepartmentSubList(String agentId, Long dptId, DingTalkLanguageType language);

    /**
     * 获取部门用户详情
     * @param agentId 应用agentId
     * @param deptId 部门ID
     * @param cursor 分页查询的游标，最开始传0，后续传返回参数中的next_cursor值。
     * @param size 分页大小
     * @param orderField 部门成员的排序规则
     * @param containAccessLimit 是否返回访问受限的员工
     * @param languageType 通讯录语言
     * @return UserPageResult
     * @author zoe zheng
     * @date 2021/5/11 4:18 下午
     */
    UserPageResult getUserList(String agentId, Long deptId, Integer cursor, Integer size, DingTalkOrderField orderField,
            Boolean containAccessLimit, DingTalkLanguageType languageType);

    /**
     * 注册钉钉应用回调事件
     *
     * @param agentId 应用agentId
     * @param url 回调url
     * @param callbackTag 注册的事件类型
     * @author zoe zheng
     * @date 2021/5/12 7:18 下午
     */
    void registerCallbackUrl(String agentId, String url, List<String> callbackTag);

    /**
     * 删除回调事件接口
     *
     * @param agentId 应用agentId
     * @author zoe zheng
     * @date 2021/5/12 7:43 下午
     */
    void deleteCallbackUrl(String agentId);

    /**
     * 异步发送工作通知消息给用户
     *
     * @param agentId 应用agentId
     * @param message 消息内容
     * @param userIds 钉钉用户ID 最大长度为100
     * @return 创建的异步发送任务ID
     * @author zoe zheng
     * @date 2021/5/14 3:18 下午
     */
    String asyncSendMessageToUser(String agentId, Message message, List<String> userIds);

    /**
     * 获取部门详情
     *
     * @param agentId 应用agentId
     * @param deptId 部门ID
     * @param language 返回语言
     * @return 钉钉部门详情
     * @author zoe zheng
     * @date 2021/5/17 11:17 上午
     */
    DingTalkDeptDetail getDeptDetail(String agentId, Long deptId, DingTalkLanguageType language);

    /**
     * 获取部门用户ID列表
     *
     * @param agentId 应用agentId
     * @param deptId 部门ID
     * @return 钉钉部门用户ID列表
     * @author zoe zheng
     * @date 2021/5/20 2:46 下午
     */
    List<String> getDeptUserIdList(String agentId, Long deptId);

    /**
     * 获取企业授权信息
     *
     * @param agentId 授权应用agentId
     * @return 企业授权信息
     * @author zoe zheng
     * @date 2021/5/21 2:56 下午
     */
    DingTalkServerAuthInfoResponse getServerAuthInfo(String agentId);

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
     * 获取指定用户的所有父部门列表
     *
     * @param agentId 授权应用agentId
     * @param userId 钉钉应用userId
     * @return DeptListParentByUserResponse
     * @author zoe zheng
     * @date 2021/6/9 5:46 下午
     */
    DingTalkUserParentDeptList getParentDeptIdByUser(String agentId, String userId);

    /**
     * 获取钉钉企业的管理员列表
     *
     * @param agentId agentId
     * @return DingTalkAdminList
     * @author zoe zheng
     * @date 2021/6/9 5:46 下午
     */
    List<DingTalkAdminList> getAdminList(String agentId);

    /**
     * 获取指定部门的所有父部门列表
     *
     * @param agentId agentId
     * @param deptId 部门ID
     * @return 该部门的所有父部门ID列表
     */
    List<Long> getDeptParentIdList(String agentId, Long deptId);
}
