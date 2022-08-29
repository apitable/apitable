package com.vikadata.api.modular.social.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.vikadata.boot.autoconfigure.social.DingTalkProperties.IsvAppProperty;
import com.vikadata.integration.grpc.CorpBizDataDto;
import com.vikadata.integration.grpc.DingTalkUserDto;
import com.vikadata.integration.grpc.TenantInfoResult;
import com.vikadata.social.dingtalk.enums.DingTalkBizType;
import com.vikadata.social.dingtalk.enums.DingTalkMediaType;
import com.vikadata.social.dingtalk.model.DingTalkAsyncSendCorpMessageResponse;
import com.vikadata.social.dingtalk.model.DingTalkCreateApaasAppRequest;
import com.vikadata.social.dingtalk.model.DingTalkCreateApaasAppResponse;
import com.vikadata.social.dingtalk.model.DingTalkInternalOrderResponse.InAppGoodsOrderVo;
import com.vikadata.social.dingtalk.model.DingTalkSsoUserInfoResponse;
import com.vikadata.social.dingtalk.model.DingTalkUserDetail;
import com.vikadata.social.dingtalk.model.DingTalkUserListResponse.UserPageResult;
import com.vikadata.social.dingtalk.model.UserInfoV2;

/**
 * <p>
 * 钉钉集成服务 接口
 * </p>
 * @author zoe zheng
 * @date 2021/5/7 5:09 下午
 */
public interface IDingTalkInternalIsvService {
    /**
     * 根据临时授权码获取用户信息
     *
     * @param suiteId 套件ID
     * @param authCorpId 授权企业的corpid
     * @param code 临时授权码
     * @return UserInfoV2
     * @author zoe zheng
     * @date 2021/5/7 6:05 下午
     */
    UserInfoV2 getUserInfoByCode(String suiteId, String authCorpId, String code);

    /**
     * 根据临时授权码获取用户详细信息
     *
     * @param suiteId 套件ID
     * @param code 通过Oauth认证给URL带上的code
     * @return DingTalkUserDetailResponse
     * @author zoe zheng
     * @date 2021/5/7 6:07 下午
     */
    DingTalkSsoUserInfoResponse getSsoUserInfoByCode(String suiteId, String code);

    /**
     * 根据临时授权码获取用户详细信息
     *
     * @param suiteId 套件ID
     * @param userId 钉钉应用的userId
     * @param authCorpId 授权企业的corpid
     * @return DingTalkUserDetailResponse
     * @author zoe zheng
     * @date 2021/5/7 6:07 下午
     */
    DingTalkUserDetail getUserDetailByCode(String suiteId, String authCorpId, String userId);

    /**
     * 根据userid获取用户详情
     *
     * @param suiteId 套件ID
     * @param authCorpId 授权企业的corpid
     * @param userId 用户的userid
     * @return DingTalkUserDetailResponse
     * @author zoe zheng
     * @date 2021/9/13 6:27 下午
     */
    DingTalkUserDetail getUserDetailByUserId(String suiteId, String authCorpId, String userId);

    /**
     * 根据userid获取用户详情
     *
     * @param suiteId 套件ID
     * @param authCorpId 授权企业的corpid
     * @param userId 用户的userid
     * @return DingTalkUserDetailResponse
     * @author zoe zheng
     * @date 2021/9/13 6:27 下午
     */
    DingTalkUserDto getIsvUserDetailByUserId(String suiteId, String authCorpId, String userId);

    /**
     * 检查授权企业状态，是否授权
     *
     * @param suiteId 套件ID
     * @param authCorpId 授权企业的corpid
     * @return 是否授权
     * @author zoe zheng
     * @date 2021/9/16 11:29 上午
     */
    Boolean getSocialTenantStatus(String suiteId, String authCorpId);

    /**
     * 钉钉ISV应用--获取部门子ID列表
     *
     * @param suiteId 应用的suiteId
     * @param authCorpId 授权企业corpid
     * @param deptId 父部门ID，根部门传1。
     * @return 子部门ID列表
     * @author zoe zheng
     * @date 2021/9/14 2:45 下午
     */
    List<Long> getDepartmentSubIdList(String suiteId, String authCorpId, Long deptId);

    /**
     * 获取部门全部成员列表
     *
     * @param suiteId 应用的suiteId
     * @param authCorpId 授权企业ID
     * @param deptId 部门ID
     * @param cursor 分页查询的游标
     * @param size 分页大小。
     * @return List<UserDetail>
     * @author zoe zheng
     * @date 2021/5/11 4:25 下午
     */
    UserPageResult getDeptUserDetailList(String suiteId, String authCorpId, Long deptId, Integer cursor, Integer size);

    /**
     * 获取授权企业的用户信息列表
     *
     * @param suiteId 套件ID
     * @param authCorpId 授权企业的corpid
     * @param authDeptIds 可见范围的部门ID
     * @param authUserIds 可见范围的钉钉用户ID
     * @return 钉钉用户详细信息列表
     * @author zoe zheng
     * @date 2021/9/14 2:09 下午
     */
    HashMap<String, DingTalkUserDto> getAuthCorpUserDetailMap(String suiteId, String authCorpId, List<String> authDeptIds,
            List<String> authUserIds);

    /**
     * 通过可见用户ID获取授权企业的用户信息
     *
     * @param suiteId 套件ID
     * @param authCorpId 授权企业的corpid
     * @param userIds 可见范围的用户ID
     * @return 钉钉用户详细信息列表
     * @author zoe zheng
     * @date 2021/9/14 2:11 下午
     */
    Map<String, DingTalkUserDto> getAuthCorpUserDetailListByUserIds(String suiteId, String authCorpId,
            List<String> userIds);

    /**
     * 使用模板发送工作通知消息
     *
     * @param suiteId 应用suiteId
     * @param authCorpId 授权企业的corpId
     * @param templateId 消息模版ID
     * @param data 消息模板动态参数赋值数据,说明 key和value均为字符串格式。
     * @param userIds 钉钉用户ID 最大长度为100
     * @return 创建的异步发送任务ID
     * @author zoe zheng
     * @date 2021/5/14 3:18 下午
     */
    List<DingTalkAsyncSendCorpMessageResponse> sendMessageToUserByTemplateId(String suiteId, String authCorpId,
            String templateId, HashMap<String, String> data, List<String> userIds);

    /**
     * 使用模板发送工作通知消息
     *
     * @param suiteId 应用suiteId
     * @param authCorpId 授权企业的corpId
     * @param templateId 消息模版ID
     * @param data 消息模板动态参数赋值数据,说明 key和value均为字符串格式。
     * @param userIds 钉钉用户ID 最大长度为100
     * @param agentId 应用的agentId
     * @return 创建的异步发送任务ID
     * @author zoe zheng
     * @date 2021/5/14 3:18 下午
     */
    List<DingTalkAsyncSendCorpMessageResponse> sendMessageToUserByTemplateId(String suiteId, String authCorpId,
            String templateId, HashMap<String, String> data, List<String> userIds, String agentId);

    /**
     * 获取第三方企业应用配置信息
     *
     * @param suiteId 应用suiteId
     * @return IsvApp
     * @author zoe zheng
     * @date 2021/9/26 17:04
     */
    IsvAppProperty getIsvAppConfig(String suiteId);

    /**
     * 获取第三方企业应用配置信息
     *
     * @param dingDingDaKey 钉钉搭的key
     * @return IsvApp
     * @author zoe zheng
     * @date 2021/9/26 17:04
     */
    IsvAppProperty getIsvAppConfigByDingDingDaKey(String dingDingDaKey);

    /**
     * 上传媒体文件
     *
     * @param suiteId 应用suiteId
     * @param authCorpId 授权企业
     * @param mediaType 类型
     * @param file 文件
     * @param fileName 文件名称
     * @return DingTalkMediaCreateResponse
     * @author zoe zheng
     * @date 2021/9/29 14:40
     */
    String uploadMedia(String suiteId, String authCorpId, DingTalkMediaType mediaType, byte[] file, String fileName);

    /**
     * 创建apaas应用
     * @param suiteId 应用suiteId
     * @param authCorpId 授权企业
     * @param request 请求参数
     * @return DingTalkCreateApaasAppResponse
     * @author zoe zheng
     * @date 2021/9/29 11:39
     */
    DingTalkCreateApaasAppResponse createMicroApaasApp(String suiteId, String authCorpId, DingTalkCreateApaasAppRequest request);

    /**
     * 检查授权企
     *
     * @param suiteId 套件ID
     * @param authCorpId 授权企业的corpid
     * @return TenantInfoResult
     * @author zoe zheng
     * @date 2021/10/13 13:13
     */
    TenantInfoResult getSocialTenantInfo(String authCorpId, String suiteId);

    /**
     * 获取内购商品SKU页面地址
     * @param suiteId 应用suiteId
     * @param authCorpId 授权企业
     * @param callbackPage 回调页面(进行URLEncode处理)，微应用为页面URL，E应用为页面路径地址。
     * @param extendParam 参数
     * @return DingTalkSkuPageResponse
     * @author zoe zheng
     * @date 2021/10/25 17:30
     */
    String getInternalSkuPage(String suiteId, String authCorpId, String callbackPage,
            String extendParam);

    /**
     * 内购商品订单处理完成
     * 调用本接口完成内购商品订单处理。
     * @param suiteId 应用suiteId
     * @param authCorpId 授权企业
     * @param orderId 内购订单号。
     * @return Boolean
     * @author zoe zheng
     * @date 2021/10/25 18:25
     */
    Boolean internalOrderFinish(String suiteId, String authCorpId, String orderId);

    /**
     * 获取内购订单信息
     *
     * @param suiteId 应用suiteId
     * @param authCorpId 授权企业
     * @param orderId 内购订单号。
     * @return DingTalkInternalOrderResponse
     * @author zoe zheng
     * @date 2021/10/27 20:49
     */
    InAppGoodsOrderVo getInternalOrder(String suiteId, String authCorpId, String orderId);

    /**
     * js api dd.config签名生成
     *
     * @param suiteId 套件ID
     * @param authCorpId 授权企业的corpid
     * @param nonceStr 随机字符串
     * @param timestamp 时间戳
     * @param url 当前也面链接
     * @return String
     * @author zoe zheng
     * @date 2021/10/30 15:10
     */
    String ddConfigSign(String suiteId, String authCorpId, String nonceStr, String timestamp, String url);

    /**
     * 获取第三方企业应用的agentId
     *
     * @param suiteId 套件ID
     * @param authCorpId 授权企业的corpid
     * @return agentId
     * @author zoe zheng
     * @date 2021/10/30 15:31
     */
    String getIsvDingTalkAgentId(String suiteId, String authCorpId);

    /**
     * 获取员工人数
     *
     * @param suiteId 应用suiteId
     * @param authCorpId 授权企业
     * @param onlyActive 是否包含未激活钉钉人数：false：包含未激活钉钉的人员数量。true：只包含激活钉钉的人员数量。
     * @return 员工人数
     * @author zoe zheng
     * @date 2021/11/8 11:57
     */
    Integer getUserCount(String suiteId, String authCorpId, Boolean onlyActive);

    /**
     * 获取员工人数
     *
     * @param suiteId 应用suiteId
     * @param authCorpId 授权企业
     * @param deptIds 部门ID
     * @return 员工人数
     * @author zoe zheng
     * @date 2021/11/8 11:57
     */
    Integer getUserCountByDeptIds(String suiteId, String authCorpId, List<String> deptIds);

    /**
     * 获取员工人数
     *
     * @param suiteId 应用suiteId
     * @param authCorpId 授权企业
     * @param deptIds 部门ID
     * @param userIds 用户ID
     * @return DingTalkDepartmentUserIdListResponse
     * @author zoe zheng
     * @date 2021/11/8 14:15
     */
    Integer getUserCountByDeptIdsAndUserIds(String suiteId, String authCorpId, List<String> deptIds,
            List<String> userIds);

    /**
     * 递归给入的部门，查询所有用户信息
     *
     * @param suiteId 应用suiteId
     * @param authCorpId 授权企业
     * @param subDeptIds 部门ID列表
     * @author zoe zheng
     * @date 2021/11/24 6:24 下午
     */
    Map<String, DingTalkUserDto> getUserTreeList(String suiteId, String authCorpId, List<String> subDeptIds);

    /**
     * 获取企业的事件信息
     * @param suiteId 应用suiteId
     * @param authCorpId 授权企业
     * @param bizTypes 事件类型
     * @return List<CorpBizDataDto>
     * @author zoe zheng
     * @date 2022/6/1 15:00
     */
    List<CorpBizDataDto> getCorpBizDataByBizTypes(String suiteId, String authCorpId, List<DingTalkBizType> bizTypes);
}
