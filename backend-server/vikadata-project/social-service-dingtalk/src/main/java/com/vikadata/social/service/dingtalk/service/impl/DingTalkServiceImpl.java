package com.vikadata.social.service.dingtalk.service.impl;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.integration.grpc.DingTalkUserDto;
import com.vikadata.integration.grpc.DingTalkUserDto.Builder;
import com.vikadata.social.dingtalk.DingTalkTemplate;
import com.vikadata.social.dingtalk.DingtalkConfig.IsvApp;
import com.vikadata.social.dingtalk.enums.DingTalkLanguageType;
import com.vikadata.social.dingtalk.enums.DingTalkMediaType;
import com.vikadata.social.dingtalk.enums.DingTalkOrderField;
import com.vikadata.social.dingtalk.exception.DingTalkApiException;
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
import com.vikadata.social.dingtalk.model.DingTalkUserDetail;
import com.vikadata.social.dingtalk.model.DingTalkUserDetailResponse;
import com.vikadata.social.dingtalk.model.DingTalkUserInfoV2Response;
import com.vikadata.social.dingtalk.model.DingTalkUserListResponse;
import com.vikadata.social.dingtalk.model.DingTalkUserListResponse.UserPageResult;
import com.vikadata.social.service.dingtalk.exception.DingTalkApiLimitException;
import com.vikadata.social.service.dingtalk.service.IDingTalkService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.retry.RetryCallback;
import org.springframework.retry.support.RetryTemplate;
import org.springframework.stereotype.Service;

/**
 * 钉钉开放平台接口实现类
 *
 * @author Zoe Zheng
 * @date 2021-09-01 18:28:37
 */
@Service
@Slf4j
public class DingTalkServiceImpl implements IDingTalkService {

    @Autowired(required = false)
    private DingTalkTemplate dingTalkTemplate;

    @Resource
    private RetryTemplate retryTemplate;

    @Override
    public IsvApp getIsvAppConfig(String suiteId) {
        if (dingTalkTemplate != null) {
            return dingTalkTemplate.getDingTalkConfig().getIsvAppMap().get(suiteId);
        }
        return null;
    }

    @Override
    public void refreshAccessToken(String suiteId, String authCorpId) {
        dingTalkTemplate.isvAppOperations().getAccessToken(suiteId, authCorpId, true);
    }

    @Override
    public DingTalkUserListResponse getUserDetailList(String suiteId, String authCorpId, Long deptId, Integer cursor,
            Integer size) {
        return retryTemplate.execute((RetryCallback<DingTalkUserListResponse, DingTalkApiLimitException>) context -> {
            try {
                return dingTalkTemplate.isvAppOperations().getUserList(suiteId, authCorpId, deptId, cursor, size,
                        DingTalkOrderField.CUSTOM, false, DingTalkLanguageType.ZH_CN);
            }
            catch (DingTalkApiException e) {
                if (e.isLimitError()) {
                    log.error("获取部门用户列表触发限流:{}:{}:{}", e.getCode(), e.getMessage(), context.getRetryCount());
                    throw new DingTalkApiLimitException(e.getCode(), e.getMessage());
                }
                log.error("获取部门用户列表失败:{}:{}", authCorpId, deptId, e);
                return null;
            }
        });
    }

    @Override
    public DingTalkDepartmentSubIdListResponse getDepartmentSubIdList(String suiteId, String authCorpId, Long deptId) {
        return retryTemplate.execute((RetryCallback<DingTalkDepartmentSubIdListResponse, DingTalkApiLimitException>) context -> {
            try {
                return dingTalkTemplate.isvAppOperations().getDepartmentSubIdList(suiteId, authCorpId, deptId);
            }
            catch (DingTalkApiException e) {
                if (e.isLimitError()) {
                    log.error("获取subId触发限流:{}:{}:{}", e.getCode(), e.getMessage(), context.getRetryCount());
                    throw new DingTalkApiLimitException(e.getCode(), e.getMessage());
                }
                log.error("获取子部门ID失败:{}:{}", authCorpId, deptId, e);
                return null;
            }
        });
    }

    @Override
    public DingTalkUserDetailResponse getUserDetailByUserId(String suiteId, String authCorpId, String userId) {
        return dingTalkTemplate.isvAppOperations().getUserDetailByUserId(suiteId, authCorpId, userId);
    }

    @Override
    public Boolean activeSuite(String suiteId, String authCorpId, String permanentCode) {
        try {
            return dingTalkTemplate.isvAppOperations().activateSuite(suiteId, authCorpId, permanentCode);
        }
        catch (DingTalkApiException e) {
            log.error("激活应用失败:{}", suiteId);
        }
        return false;
    }

    @Override
    public DingTalkServerAuthInfoResponse getAuthCorpInfo(String suiteId, String authCorpId) {
        try {
            return dingTalkTemplate.isvAppOperations().getAuthCorpInfo(suiteId, authCorpId);
        }
        catch (DingTalkApiException e) {
            log.info("获取企业授权信息异常:{}:{}:{}", suiteId, authCorpId, e.getMessage());
        }
        return null;
    }

    @Override
    public DingTalkUserInfoV2Response getUserInfoByCode(String suiteId, String authCorpId, String code) {
        return dingTalkTemplate.isvAppOperations().getUserInfoV2ByCode(suiteId, authCorpId, code);
    }

    @Override
    public DingTalkSsoUserInfoResponse getSsoUserInfoByCode(String suiteId, String code) {
        return dingTalkTemplate.isvAppOperations().getSsoUserInfoByCode(suiteId, code);
    }

    @Override
    public DingTalkAsyncSendCorpMessageResponse sendMessageToUserByTemplateId(String suiteId, String authCorpId,
            String agentId, String templateId, String data, List<String> userIds) {
        return dingTalkTemplate.isvAppOperations().sendMessageToUserByTemplateId(suiteId, authCorpId, agentId,
                templateId, data, userIds);
    }

    @Override
    public DingTalkMediaUploadResponse uploadMedia(String suiteId, String authCorpId, DingTalkMediaType mediaType, File file) {
        return dingTalkTemplate.isvAppOperations().uploadMedia(suiteId, authCorpId, mediaType, file);
    }

    @Override
    public DingTalkCreateApaasAppResponse createMicroApaasApp(String suiteId, String authCorpId, DingTalkCreateApaasAppRequest request) {
        return dingTalkTemplate.isvAppOperations().createMicroApaasApp(suiteId, authCorpId, request);
    }

    @Override
    public DingTalkSkuPageResponse getInternalSkuPage(String suiteId, String authCorpId, String goodsCode, String callbackPage, String extendParam) {
        return dingTalkTemplate.isvAppOperations().getInternalSkuPage(suiteId, authCorpId, goodsCode, callbackPage, extendParam);
    }

    @Override
    public BaseResponse internalOrderFinish(String suiteId, String authCorpId, String orderId) {
        return dingTalkTemplate.isvAppOperations().internalOrderFinish(suiteId, authCorpId, orderId);
    }

    @Override
    public DingTalkInternalOrderResponse getInternalOrder(String suiteId, String authCorpId, String orderId) {
        return dingTalkTemplate.isvAppOperations().getInternalOrder(suiteId, authCorpId, orderId);
    }

    @Override
    public String ddConfigSign(String suiteId, String authCorpId, String nonceStr, String timestamp, String url) {
        return dingTalkTemplate.isvAppOperations().ddConfigSign(suiteId, authCorpId, nonceStr, timestamp, url);
    }

    @Override
    public Integer getUserCount(String suiteId, String authCorpId, Boolean onlyActive) {
        return dingTalkTemplate.isvAppOperations().getUserCount(suiteId, authCorpId, onlyActive);
    }

    @Override
    public DingTalkDepartmentUserIdListResponse getUserIdListByDeptId(String suiteId, String authCorpId, Long deptId) {
        return dingTalkTemplate.isvAppOperations().getUserIdListByDeptId(suiteId, authCorpId, deptId);
    }

    @Override
    public void getUserTreeList(String suiteId, String authCorpId, List<String> subDeptIds, HashMap<String,
            DingTalkUserDto> userMap) {
        // 算出所有部门ID
        for (String deptId : subDeptIds) {
            // 过滤家校通讯录
            DingTalkDepartmentSubIdListResponse response = getDepartmentSubIdList(suiteId, authCorpId,
                    Long.parseLong(deptId));
            if (response != null) {
                List<String> list = response.getResult().getDeptIdList().stream()
                        .filter(i -> i > 0).map(Object::toString).collect(Collectors.toList());
                if (!list.isEmpty()) {
                    getUserTreeList(suiteId, authCorpId, list, userMap);
                }
            }
            userMap.putAll(getDeptUserDetailMap(suiteId, authCorpId, Long.parseLong(deptId)));
        }
    }

    @Override
    public HashMap<String, DingTalkUserDto> getDeptUserDetailMap(String suiteId, String authCorpId, Long deptId) {
        HashMap<String, DingTalkUserDto> users = MapUtil.newHashMap();
        boolean hasMoreUser = false;
        int cursor = 0;
        // 加载部门的全部用户
        do {
            DingTalkUserListResponse response = getUserDetailList(suiteId, authCorpId, deptId, cursor, 100);
            if (response != null) {
                UserPageResult userPageResult = response.getResult();
                hasMoreUser = userPageResult.getHasMore();
                if (hasMoreUser) {
                    cursor = userPageResult.getNextCursor().intValue();
                }
                if (CollUtil.isNotEmpty(userPageResult.getList())) {
                    for (DingTalkUserDetail userDetail : userPageResult.getList()) {
                        if (userDetail.getActive()) {
                            users.put(userDetail.getUnionid(), getIsvDingTalkUserInfo(userDetail));
                        }
                    }
                }
            }
        } while (hasMoreUser);
        return users;
    }

    private DingTalkUserDto getIsvDingTalkUserInfo(DingTalkUserDetail userDetail) {
        Builder builder = DingTalkUserDto.newBuilder();
        builder.setOpenId(userDetail.getUserid());
        builder.setUnionId(userDetail.getUnionid());
        if (StrUtil.isNotBlank(userDetail.getAvatar())) {
            builder.setAvatar(userDetail.getAvatar());
        }
        if (StrUtil.isNotBlank(userDetail.getName())) {
            builder.setUserName(userDetail.getName());
        }
        return builder.build();
    }
}
