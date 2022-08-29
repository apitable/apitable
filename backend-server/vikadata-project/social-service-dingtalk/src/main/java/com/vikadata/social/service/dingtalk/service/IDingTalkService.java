package com.vikadata.social.service.dingtalk.service;

import java.io.File;
import java.util.HashMap;
import java.util.List;

import com.vikadata.integration.grpc.DingTalkUserDto;
import com.vikadata.social.dingtalk.DingtalkConfig.IsvApp;
import com.vikadata.social.dingtalk.enums.DingTalkMediaType;
import com.vikadata.social.dingtalk.model.BaseResponse;
import com.vikadata.social.dingtalk.model.DingTalkAsyncSendCorpMessageResponse;
import com.vikadata.social.dingtalk.model.DingTalkCreateApaasAppRequest;
import com.vikadata.social.dingtalk.model.DingTalkCreateApaasAppResponse;
import com.vikadata.social.dingtalk.model.DingTalkDepartmentSubIdListResponse;
import com.vikadata.social.dingtalk.model.DingTalkDepartmentUserIdListResponse;
import com.vikadata.social.dingtalk.model.DingTalkInternalOrderResponse;
import com.vikadata.social.dingtalk.model.DingTalkMediaUploadResponse;
import com.vikadata.social.dingtalk.model.DingTalkServerAuthInfoResponse;
import com.vikadata.social.dingtalk.model.DingTalkSkuPageResponse;
import com.vikadata.social.dingtalk.model.DingTalkSsoUserInfoResponse;
import com.vikadata.social.dingtalk.model.DingTalkUserDetailResponse;
import com.vikadata.social.dingtalk.model.DingTalkUserInfoV2Response;
import com.vikadata.social.dingtalk.model.DingTalkUserListResponse;

/**
 * 钉钉api接口
 *
 * @author Zoe Zheng
 * @date 2021-09-01 18:27:47
 */
public interface IDingTalkService {
    /**
     *
     * @param suiteId 套件ID
     * @return IsvApp
     * @author zoe zheng
     * @date 2021/9/9 7:18 下午
     *
     */
    IsvApp getIsvAppConfig(String suiteId);

    /**
     * 强制刷新token
     *
     * @param suiteId 应用的suiteId
     * @param authCorpId 授权企业ID
     * @author zoe zheng
     * @date 2021/10/14 18:55
     */
    void refreshAccessToken(String suiteId, String authCorpId);

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
    DingTalkUserListResponse getUserDetailList(String suiteId, String authCorpId, Long deptId, Integer cursor, Integer size);

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
    DingTalkDepartmentSubIdListResponse getDepartmentSubIdList(String suiteId, String authCorpId, Long deptId);

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
    DingTalkUserDetailResponse getUserDetailByUserId(String suiteId, String authCorpId, String userId);

    /**
     * 激活应用
     * 在收到HTTP回调推送的企业授权开通应用事件后，调用本接口激活企业授权的应用。
     *
     * @param suiteId 套件ID
     * @param authCorpId 授权企业的corpid
     * @param permanentCode 授权企业的永久授权码
     * @return 第三方应用授权企业的access_token
     * @author zoe zheng
     * @date 2021/9/13 5:59 下午
     */
    Boolean activeSuite(String suiteId, String authCorpId, String permanentCode);

    /**
     * 获取企业授权信息
     * 第三方企业应用和定制服务商为企业开发企业内部应用时调用本接口获取企业授权信息。
     *
     * @param suiteId 套件ID
     * @param authCorpId 授权企业的corpid
     * @return 企业授权信息
     * @author zoe zheng
     * @date 2021/9/16 10:26 上午
     */
    DingTalkServerAuthInfoResponse getAuthCorpInfo(String suiteId, String authCorpId);

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
    DingTalkUserInfoV2Response getUserInfoByCode(String suiteId, String authCorpId, String code);

    /**
     * 根据临时授权码获取后台管理员身份信息用户信息
     *
     * @param suiteId 套件ID
     * @param code 临时授权码
     * @return UserInfoV2
     * @author zoe zheng
     * @date 2021/5/7 6:05 下午
     */
    DingTalkSsoUserInfoResponse getSsoUserInfoByCode(String suiteId, String code);

    /**
     * 使用模板发送工作通知消息
     *
     * @param suiteId 应用suiteId
     * @param authCorpId 授权企业的corpId
     * @param agentId 第三方企业应用可调用获取企业授权信息接口获取
     * @param templateId 消息模版ID
     * @param data 消息模板动态参数赋值数据,说明 key和value均为字符串格式。
     * @param userIds 钉钉用户ID 最大长度为100
     * @return 创建的异步发送任务ID
     * @author zoe zheng
     * @date 2021/5/14 3:18 下午
     */
    DingTalkAsyncSendCorpMessageResponse sendMessageToUserByTemplateId(String suiteId, String authCorpId, String agentId,
            String templateId, String data, List<String> userIds);

    /**
     * 上传媒体文件
     *
     * @param suiteId 应用suiteId
     * @param authCorpId 授权企业
     * @param mediaType 类型
     * @param file 文件
     * @return DingTalkMediaCreateResponse
     * @author zoe zheng
     * @date 2021/9/29 14:40
     */
    DingTalkMediaUploadResponse uploadMedia(String suiteId, String authCorpId, DingTalkMediaType mediaType, File file);

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
     * 获取内购商品SKU页面地址
     * @param suiteId 应用suiteId
     * @param authCorpId 授权企业
     * @param goodsCode 商品码
     * @param callbackPage 回调页面(进行URLEncode处理)，微应用为页面URL，E应用为页面路径地址。
     * @param extendParam 参数
     * @return DingTalkSkuPageResponse
     * @author zoe zheng
     * @date 2021/10/25 17:30
     */
    DingTalkSkuPageResponse getInternalSkuPage(String suiteId, String authCorpId, String goodsCode, String callbackPage,
            String extendParam);

    /**
     * 内购商品订单处理完成
     * 调用本接口完成内购商品订单处理。
     * @param suiteId 应用suiteId
     * @param authCorpId 授权企业
     * @param orderId 内购订单号。
     * @return BaseResponse
     * @author zoe zheng
     * @date 2021/10/25 18:25
     */
    BaseResponse internalOrderFinish(String suiteId, String authCorpId, String orderId);

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
    DingTalkInternalOrderResponse getInternalOrder(String suiteId, String authCorpId, String orderId);


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
     * 获取部门用户ID
     *
     * @param suiteId 应用suiteId
     * @param authCorpId 授权企业
     * @param deptId 部门ID
     * @return DingTalkDepartmentUserIdListResponse
     * @author zoe zheng
     * @date 2021/11/8 14:15
     */
    DingTalkDepartmentUserIdListResponse getUserIdListByDeptId(String suiteId, String authCorpId, Long deptId);

    /**
     * 递归给入的部门，查询所有用户信息
     *
     * @param suiteId 应用suiteId
     * @param authCorpId 授权企业
     * @param subDeptIds 部门ID列表
     * @param userMap 接受结果集
     * @author zoe zheng
     * @date 2021/11/24 6:24 下午
     */
    void getUserTreeList(String suiteId, String authCorpId, List<String> subDeptIds,
            HashMap<String, DingTalkUserDto> userMap);

    /**
     * 获取部门全部用户信息
     *
     * @param suiteId 应用suiteId
     * @param authCorpId 授权企业
     * @param deptId 部门ID
     * @return HashMap<String, DingTalkUserDto>
     * @author zoe zheng
     * @date 2021/11/24 6:26 下午
     */
    HashMap<String, DingTalkUserDto> getDeptUserDetailMap(String suiteId, String authCorpId, Long deptId);
}
