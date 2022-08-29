package com.vikadata.api.modular.social.service;

import java.util.List;
import java.util.Map;

import com.vikadata.api.modular.social.model.FeishuTenantInfoVO;
import com.vikadata.social.feishu.FeishuEventListenerManager;
import com.vikadata.social.feishu.card.Message;
import com.vikadata.social.feishu.config.FeishuConfigStorage;
import com.vikadata.social.feishu.event.FeishuEventParser;
import com.vikadata.social.feishu.event.v3.FeishuV3ContactEventParser;
import com.vikadata.social.feishu.model.BatchSendChatMessageResult;
import com.vikadata.social.feishu.model.FeishuAccessToken;
import com.vikadata.social.feishu.model.FeishuAdminUserList;
import com.vikadata.social.feishu.model.FeishuContactScope;
import com.vikadata.social.feishu.model.FeishuDepartmentDetail;
import com.vikadata.social.feishu.model.FeishuDepartmentInfo;
import com.vikadata.social.feishu.model.FeishuPassportAccessToken;
import com.vikadata.social.feishu.model.FeishuPassportUserInfo;
import com.vikadata.social.feishu.model.FeishuTenantInfo;
import com.vikadata.social.feishu.model.FeishuUserDetail;
import com.vikadata.social.feishu.model.v3.FeishuDeptObject;
import com.vikadata.social.feishu.model.v3.FeishuUserObject;
import com.vikadata.social.feishu.model.v3.FeishuV3DeptsPager;
import com.vikadata.social.feishu.model.v3.FeishuV3UsersPager;

/**
 * 飞书集成服务 接口
 *
 * @author Shawn Deng
 * @date 2020-12-08 16:29:43
 */
public interface IFeishuService {

    /**
     * 是否默认商店应用
     * @return true | false
     */
    boolean isDefaultIsv();

    /**
     * 获取Isv商店应用标识
     * @return AppId
     */
    String getIsvAppId();

    /**
     * 切换商店应用上下文，下面所有接口的前置条件
     */
    void switchDefaultContext();

    /**
     * 切换应用，如果不存在，则设置value
     * @param configStorage 配置存储
     */
    void switchContextIfAbsent(FeishuConfigStorage configStorage);

    /**
     * 事件内容
     * @param eventData 事件内容
     * @return Map<String, Object>
     */
    Map<String, Object> decryptData(String eventData);

    /**
     * 校验应用事件令牌
     * @param jsonData json数据结构
     */
    void checkVerificationToken(Map<String, Object> jsonData);

    /**
     * 获取事件解析器
     * @return FeishuEventParser
     */
    FeishuEventParser getEventParser();

    /**
     * 获取v3版本通讯录事件解析器
     * @return FeishuV3ContactEventParser
     */
    FeishuV3ContactEventParser getV3EventParser();

    /**
     * 获取事件监听器
     * @return FeishuEventListenerManager
     */
    FeishuEventListenerManager getEventListenerManager();

    /**
     * 构造授权回调地址
     * @param redirectUri 重定向地址
     * @param state 自定义值
     * @return 回调地址
     */
    String buildAuthUrl(String redirectUri, String state);

    /**
     * 获取用户凭证信息
     * @param code 临时授权码
     * @return FeishuAccessToken
     */
    FeishuAccessToken getUserAccessToken(String code);

    /**
     * 通用能力，获取access token
     * @param code 临时授权码
     * @param redirectUri 回调地址
     * @return FeishuPassportAccessToken
     */
    FeishuPassportAccessToken getPassportAccessToken(String code, String redirectUri);

    /**
     * 通用能力，获取用户身份信息
     * @param accessToken 访问令牌
     * @return FeishuPassportUserInfo
     */
    FeishuPassportUserInfo getPassportUserInfo(String accessToken);

    /**
     *  获取飞书租户企业信息
     * @param tenantKey 企业标识
     * @return FeishuTenantInfo
     */
    FeishuTenantInfo getFeishuTenantInfo(String tenantKey);

    /**
     * 批量发送消息到指定用户
     * 私聊信息
     *
     * @param tenantKey 企业标识
     * @param openIds   第三方用户标识，发送的用户
     * @param message   消息
     * @return BatchSendChatMessageResult
     * @author Shawn Deng
     * @date 2020/12/14 15:04
     */
    BatchSendChatMessageResult batchSendCardMessage(String tenantKey, List<String> openIds, Message message);

    /**
     * 发送消息到群聊组
     *
     * @param tenantKey 企业标识
     * @param chatId    群聊ID
     * @param message   消息
     * @return Message Id
     * @author Shawn Deng
     * @date 2020/12/23 20:06
     */
    String sendCardMessageToChatGroup(String tenantKey, String chatId, Message message);

    /**
     * 发送私聊消息
     *
     * @param tenantKey 企业标识
     * @param openId    用户OPEN_ID
     * @param message   消息
     * @return Message Id
     * @author Shawn Deng
     * @date 2020/12/23 20:06
     */
    String sendCardMessageToUserPrivate(String tenantKey, String openId, Message message);

    /**
     * 获取飞书用户的统一ID
     *
     * @param tenantKey 租户标识
     * @param openId    飞书用户标识
     * @return 统一ID
     * @author Shawn Deng
     * @date 2020/12/14 15:04
     */
    String getUnionIdByOpenId(String tenantKey, String openId);

    /**
     * 根据unionId获取openId
     *
     * @param tenantKey 租户标识
     * @param unionId   飞书用户统一ID
     * @return 用户openId
     * @author Shawn Deng
     * @date 2020/12/21 13:16
     */
    String getOpenIdByUnionId(String tenantKey, String unionId);

    /**
     * 获取企业的管理员列表
     *
     * @param tenantKey 租户标识
     * @return FeishuAdminUserList
     * @author Shawn Deng
     * @date 2020/12/14 15:04
     */
    FeishuAdminUserList getAdminList(String tenantKey);

    /**
     * 获取企业的管理员Open_id列表
     *
     * @param tenantKey 租户标识
     * @return 管理员标识
     * @author Shawn Deng
     * @date 2020/12/14 15:04
     */
    List<String> getAdminOpenIds(String tenantKey);

    /**
     * 新版
     * 获取单个用户信息
     * @param tenantKey 租户标识
     * @param openId    飞书用户标识
     * @return FeishuUserObject
     * @author Shawn Deng 
     * @date 2021/7/21 17:45
     */
    FeishuUserObject getTenantUserInfo(String tenantKey, String openId);

    /**
     * 获取飞书用户信息
     *
     * @param tenantKey 租户标识
     * @param openId    飞书用户标识
     * @return 飞书用户信息
     * @author Shawn Deng
     * @date 2020/12/14 15:04
     */
    FeishuUserDetail getSingleUserDetail(String tenantKey, String openId);

    /**
     * 批量获取飞书用户信息
     *
     * @param tenantKey 租户标识
     * @param openIds   飞书用户标识集合
     * @return 飞书用户信息列表
     * @author Shawn Deng
     * @date 2020/12/14 15:04
     */
    List<FeishuUserDetail> batchGetUserDetail(String tenantKey, List<String> openIds);

    /**
     * 校验飞书用户是否应用的管理员
     *
     * @param tenantKey 租户标识
     * @param openId    飞书用户标识
     * @return True ｜ False
     * @author Shawn Deng
     * @date 2020/12/14 15:04
     */
    boolean checkUserIsAdmin(String tenantKey, String openId);

    /**
     * 获取飞书企业授权应用的通讯录范围
     *
     * @param tenantKey 租户标识
     * @return FeishuContactScope
     * @author Shawn Deng
     * @date 2020/12/14 15:04
     */
    FeishuContactScope getFeishuTenantContactAuthScope(String tenantKey);

    /**
     * 获取飞书企业授权的通讯录范围的总员工数量
     *
     * @param tenantKey 租户标识
     * @param filterInactive 是否过滤未激活员工
     * @return 企业授权的通讯录范围的总员工数量
     * @author Shawn Deng
     * @date 2020/12/14 15:04
     */
    int getFeishuTenantContactScopeEmployeeCount(String tenantKey, boolean filterInactive);

    /**
     * 获取飞书企业信息
     * 自定义结果视图
     *
     * @param tenantKey 租户标识
     * @return FeishuTenantInfoVO 企业信息
     * @author Shawn Deng
     * @date 2020/12/14 15:04
     */
    FeishuTenantInfoVO getTenantInfo(String tenantKey);

    /**
     * 获取部门详情
     *
     * @param tenantKey        企业标识
     * @param departmentId     企业部门的自定义ID
     * @param openDepartmentId 企业部门openID
     * @return FeishuDepartmentDetail
     * @author Shawn Deng
     * @date 2020/12/18 01:05
     */
    FeishuDepartmentDetail getDepartmentDetail(String tenantKey, String departmentId, String openDepartmentId);

    /**
     * 批量获取部门详情
     *
     * @param tenantKey     企业标识
     * @param departmentIds 企业部门的自定义ID列表
     * @return FeishuDepartmentDetail 部门信息
     * @author Shawn Deng
     * @date 2020/12/14 15:05
     */
    List<FeishuDepartmentDetail> batchGetDepartmentDetail(String tenantKey, List<String> departmentIds);

    /**
     * 获取部门下的所有子部门列表
     *
     * @param tenantKey     企业标识
     * @param departmentIds 企业部门的自定义ID列表
     * @return 所有子部门信息列表
     * @author Shawn Deng
     * @date 2020/12/14 15:05
     */
    List<FeishuDepartmentInfo> getAllSubDepartments(String tenantKey, List<String> departmentIds);

    /**
     * 获取部门的子部门列表
     * 此接口可以知道子部门的顺序
     *
     * @param tenantKey    企业标识
     * @param departmentId 部门ID
     * @param fetchChild   是否递归查询
     * @return FeishuDepartmentInfo 部门信息
     * @author Shawn Deng
     * @date 2020/12/14 15:05
     */
    List<FeishuDepartmentInfo> getDeptListByParentDept(String tenantKey, String departmentId, int pageSize, boolean fetchChild);

    /**
     * 获取部门下用户信息
     *
     * @param tenantKey    企业标识
     * @param departmentId 部门ID
     * @param pageSize  分页大小
     * @param fetchChild   是否递归查询所有员工
     * @return FeishuUserDetail 部门用户信息
     * @author Shawn Deng
     * @date 2020/12/14 15:05
     */
    List<FeishuUserDetail> getUserListByDept(String tenantKey, String departmentId, int pageSize, boolean fetchChild);

    /**
     * 查询单个部门信息
     * @param tenantKey 租户
     * @param departmentId 部门ID
     * @param openDepartmentId 部门openId
     * @return FeishuDeptObject
     */
    FeishuDeptObject getDept(String tenantKey, String departmentId, String openDepartmentId);

    /**
     * 分页查询子部门列表
     * @param tenantKey 租户
     * @param parentDepartmentId 父级部门ID
     * @return FeishuV3DeptsPager
     */
    FeishuV3DeptsPager getDeptPager(String tenantKey, String parentDepartmentId);

    /**
     * 分页查询子部门列表
     * @param tenantKey 租户
     * @param parentOpenDepartmentId 父级部门openId
     * @return FeishuV3DeptsPager
     */
    FeishuV3DeptsPager getDeptPagerByOpenDepartmentId(String tenantKey, String parentOpenDepartmentId);

    /**
     * 查询单个用户信息
     * @param tenantKey 租户
     * @param openId 用户openId
     * @return FeishuUserObject
     */
    FeishuUserObject getUser(String tenantKey, String openId);

    /**
     * 分页查询部门用户列表
     * @param tenantKey 租户
     * @param departmentId 部门ID
     * @return FeishuV3UsersPager
     */
    FeishuV3UsersPager getUserPager(String tenantKey, String departmentId);

    /**
     * 分页查询部门用户列表
     * @param tenantKey 租户
     * @param openDepartmentId 部门OpenID
     * @return FeishuV3UsersPager
     */
    FeishuV3UsersPager getUserPagerByOpenDeptId(String tenantKey, String openDepartmentId);
}
