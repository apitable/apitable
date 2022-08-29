package com.vikadata.api.modular.social.service.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.modular.social.model.FeishuTenantInfoVO;
import com.vikadata.api.modular.social.service.IFeishuService;
import com.vikadata.boot.autoconfigure.social.FeishuProperties;
import com.vikadata.social.feishu.FeishuEventListenerManager;
import com.vikadata.social.feishu.FeishuServiceProvider;
import com.vikadata.social.feishu.MessageReceiverBuilder;
import com.vikadata.social.feishu.card.Message;
import com.vikadata.social.feishu.config.FeishuConfigStorage;
import com.vikadata.social.feishu.event.FeishuEventParser;
import com.vikadata.social.feishu.event.v3.FeishuV3ContactEventParser;
import com.vikadata.social.feishu.model.BatchMessageRequest;
import com.vikadata.social.feishu.model.BatchSendChatMessageResult;
import com.vikadata.social.feishu.model.FeishuAccessToken;
import com.vikadata.social.feishu.model.FeishuAdminUserList;
import com.vikadata.social.feishu.model.FeishuAdminUserListResponse;
import com.vikadata.social.feishu.model.FeishuBatchGetDepartmentDetailListRequest;
import com.vikadata.social.feishu.model.FeishuBatchUserRequest;
import com.vikadata.social.feishu.model.FeishuCheckUserAdminRequest;
import com.vikadata.social.feishu.model.FeishuCheckUserAdminResponse;
import com.vikadata.social.feishu.model.FeishuContactScope;
import com.vikadata.social.feishu.model.FeishuDepartmentDetail;
import com.vikadata.social.feishu.model.FeishuDepartmentDetailListResponse;
import com.vikadata.social.feishu.model.FeishuDepartmentDetailResponse;
import com.vikadata.social.feishu.model.FeishuDepartmentInfo;
import com.vikadata.social.feishu.model.FeishuGetDepartmentDetailRequest;
import com.vikadata.social.feishu.model.FeishuGetUserByUnionIdInfoResponse;
import com.vikadata.social.feishu.model.FeishuGetUserByUnionIdRequest;
import com.vikadata.social.feishu.model.FeishuPassportAccessToken;
import com.vikadata.social.feishu.model.FeishuPassportUserInfo;
import com.vikadata.social.feishu.model.FeishuTenantInfo;
import com.vikadata.social.feishu.model.FeishuUserDetail;
import com.vikadata.social.feishu.model.FeishuUserDetailResponse;
import com.vikadata.social.feishu.model.builder.DeptIdType;
import com.vikadata.social.feishu.model.builder.DeptIdTypeBuilder;
import com.vikadata.social.feishu.model.builder.UserIdTypeBuilder;
import com.vikadata.social.feishu.model.v3.FeishuDeptObject;
import com.vikadata.social.feishu.model.v3.FeishuUserObject;
import com.vikadata.social.feishu.model.v3.FeishuV3DeptsPager;
import com.vikadata.social.feishu.model.v3.FeishuV3UserResponse;
import com.vikadata.social.feishu.model.v3.FeishuV3UsersPager;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 飞书集成服务 接口实现
 *
 * @author Shawn Deng
 * @date 2020-12-08 16:29:55
 */
@Service
@Slf4j
public class FeishuServiceImpl implements IFeishuService {

    @Autowired(required = false)
    private FeishuProperties feishuProperties;

    @Autowired(required = false)
    private FeishuServiceProvider feishuServiceProvider;

    @Override
    public boolean isDefaultIsv() {
        return feishuServiceProvider.getFeishuTemplate().isDefaultIsv();
    }

    @Override
    public String getIsvAppId() {
        if (feishuProperties == null) {
            return null;
        }
        return feishuProperties.getAppId();
    }

    @Override
    public void switchDefaultContext() {
        feishuServiceProvider.getFeishuTemplate().switchDefault();
    }

    @Override
    public void switchContextIfAbsent(FeishuConfigStorage configStorage) {
        if (feishuServiceProvider == null) {
            return;
        }
        feishuServiceProvider.getFeishuTemplate().switchTo(configStorage);
    }

    @Override
    public Map<String, Object> decryptData(String eventData) {
        return feishuServiceProvider.decryptIfNeed(eventData);
    }

    @Override
    public void checkVerificationToken(Map<String, Object> jsonData) {
        feishuServiceProvider.checkToken(jsonData);
    }

    @Override
    public FeishuEventParser getEventParser() {
        return feishuServiceProvider.getEventParser();
    }

    @Override
    public FeishuV3ContactEventParser getV3EventParser() {
        return feishuServiceProvider.getV3ContactEventParser();
    }

    @Override
    public FeishuEventListenerManager getEventListenerManager() {
        return feishuServiceProvider.getEventListenerManager();
    }

    @Override
    public String buildAuthUrl(String redirectUri, String state) {
        return feishuServiceProvider.getFeishuTemplate().buildAuthorizationUrl(redirectUri, state);
    }

    @Override
    public FeishuAccessToken getUserAccessToken(String code) {
        return feishuServiceProvider.getFeishuTemplate().getUserAccessToken(code);
    }

    @Override
    public FeishuPassportAccessToken getPassportAccessToken(String code, String redirectUri) {
        return feishuServiceProvider.getFeishuTemplate().getPassportAccessToken(code, redirectUri);
    }

    @Override
    public FeishuPassportUserInfo getPassportUserInfo(String accessToken) {
        return feishuServiceProvider.getFeishuTemplate().getPassportUserInfo(accessToken);
    }

    @Override
    public FeishuTenantInfo getFeishuTenantInfo(String tenantKey) {
        return feishuServiceProvider.getFeishuTemplate().tenantOperations().getTenantInfo(tenantKey).getData().getTenant();
    }

    @Override
    public BatchSendChatMessageResult batchSendCardMessage(String tenantKey, List<String> openIds, Message message) {
        BatchMessageRequest request = new BatchMessageRequest();
        request.setOpenIds(openIds);
        return feishuServiceProvider.getFeishuTemplate().messageOperations().batchSendIsvChatMessage(tenantKey, request, message);
    }

    @Override
    public String sendCardMessageToChatGroup(String tenantKey, String chatId, Message message) {
        return feishuServiceProvider.getFeishuTemplate().messageOperations().sendIsvChatMessage(tenantKey, MessageReceiverBuilder.chatId(chatId), message);
    }

    @Override
    public String sendCardMessageToUserPrivate(String tenantKey, String openId, Message message) {
        return feishuServiceProvider.getFeishuTemplate().messageOperations().sendIsvChatMessage(tenantKey, MessageReceiverBuilder.openId(openId), message);
    }

    @Override
    public String getUnionIdByOpenId(String tenantKey, String openId) {
        FeishuUserObject userObject = getUser(tenantKey, openId);
        if (userObject != null) {
            return userObject.getUnionId();
        }
        return null;
    }

    @Override
    public String getOpenIdByUnionId(String tenantKey, String unionId) {
        FeishuGetUserByUnionIdRequest request = new FeishuGetUserByUnionIdRequest();
        request.setUnionIds(Collections.singletonList(unionId));
        FeishuGetUserByUnionIdInfoResponse response = feishuServiceProvider.getFeishuTemplate().userOperations().batchGetUserIdInfoByUnionId(tenantKey, request);
        return response.getData().getUserInfos().get(unionId).getOpenId();
    }

    @Override
    public FeishuAdminUserList getAdminList(String tenantKey) {
        FeishuAdminUserListResponse response = feishuServiceProvider.getFeishuTemplate().appOperations().getAppAdminList(tenantKey);
        return response.getData();
    }

    @Override
    public List<String> getAdminOpenIds(String tenantKey) {
        return this.getAdminList(tenantKey).getUserList().stream()
                .map(FeishuAdminUserList.Admin::getOpenId).collect(Collectors.toList());
    }

    @Override
    public FeishuUserObject getTenantUserInfo(String tenantKey, String openId) {
        FeishuV3UserResponse response = feishuServiceProvider.getFeishuTemplate().userOperations().getUser(tenantKey, UserIdTypeBuilder.openId(openId));
        return response.getData().getUser();
    }

    @Override
    public FeishuUserDetail getSingleUserDetail(String tenantKey, String openId) {
        FeishuBatchUserRequest request = new FeishuBatchUserRequest();
        request.setOpenIds(Collections.singletonList(openId));
        FeishuUserDetailResponse response = feishuServiceProvider.getFeishuTemplate().userOperations().batchGetUserDetail(tenantKey, request);
        return CollUtil.isNotEmpty(response.getData().getUserInfos()) && response.getData().getUserInfos().size() == 1 ?
                response.getData().getUserInfos().get(0) : null;
    }

    @Override
    public List<FeishuUserDetail> batchGetUserDetail(String tenantKey, List<String> openIds) {
        FeishuBatchUserRequest request = new FeishuBatchUserRequest();
        request.setOpenIds(openIds);
        FeishuUserDetailResponse response = feishuServiceProvider.getFeishuTemplate().userOperations().batchGetUserDetail(tenantKey, request);
        List<FeishuUserDetail> userDetails = response.getData().getUserInfos();
        if (CollUtil.isNotEmpty(userDetails)) {
            return userDetails;
        }
        return null;
    }

    @Override
    public boolean checkUserIsAdmin(String tenantKey, String openId) {
        FeishuCheckUserAdminRequest request = new FeishuCheckUserAdminRequest();
        request.setOpenId(openId);
        FeishuCheckUserAdminResponse response = feishuServiceProvider.getFeishuTemplate().appOperations().checkAppAdmin(tenantKey, request);
        return response.getData().isAppAdmin();
    }

    @Override
    public FeishuContactScope getFeishuTenantContactAuthScope(String tenantKey) {
        return feishuServiceProvider.getFeishuTemplate().contactOperations().getContactScope(tenantKey).getData();
    }

    @Override
    public int getFeishuTenantContactScopeEmployeeCount(String tenantKey, boolean filterInactive) {
        // 获取通讯录授权范围，得到授权范围的部门列表（只有一级）
        FeishuContactScope contactScope = this.getFeishuTenantContactAuthScope(tenantKey);
        List<String> authedOpenIds = contactScope.getAuthedOpenIds();
        int memberCount = 0;
        if (CollUtil.isNotEmpty(authedOpenIds)) {
            if (filterInactive) {
                List<FeishuUserDetail> userDetails = batchGetUserDetail(tenantKey, authedOpenIds);
                if (CollUtil.isNotEmpty(userDetails)) {
                    memberCount = memberCount + (int) userDetails.stream().filter(userDetail -> userDetail.getStatus() != null && userDetail.getStatus() == 0).count();
                }
            }
            else {
                memberCount = memberCount + authedOpenIds.size();
            }
        }
        List<String> authedDepartments = contactScope.getAuthedDepartments();
        if (log.isDebugEnabled()) {
            log.debug("[飞书]租户：「{}」，通讯录授权范围，部门：{}", tenantKey, JSONUtil.toJsonStr(authedDepartments));
        }
        // 查询授权部门的成员总数
        if (CollUtil.isNotEmpty(authedDepartments)) {
            if (filterInactive) {
                for (String authedDepartment : authedDepartments) {
                    List<FeishuUserDetail> userDetails = getUserListByDept(tenantKey, authedDepartment, 100, true);
                    if (CollUtil.isNotEmpty(userDetails)) {
                        memberCount = memberCount + (int) userDetails.stream().filter(userDetail -> userDetail.getStatus() != null && userDetail.getStatus() == 0).count();
                    }
                }
            }
            else {
                List<FeishuDepartmentDetail> detailList = batchGetDepartmentDetail(tenantKey, authedDepartments);
                if (CollUtil.isNotEmpty(detailList)) {
                    memberCount = memberCount + detailList.stream().mapToInt(FeishuDepartmentDetail::getMemberCount).sum();
                }
            }

        }
        return memberCount;
    }


    @Override
    public FeishuTenantInfoVO getTenantInfo(String tenantKey) {
        FeishuTenantInfoVO infoVO = new FeishuTenantInfoVO();
        infoVO.setMemberCount(getFeishuTenantContactScopeEmployeeCount(tenantKey, true));
        return infoVO;
    }

    @Override
    public FeishuDepartmentDetail getDepartmentDetail(String tenantKey, String departmentId, String openDepartmentId) {
        FeishuGetDepartmentDetailRequest request = new FeishuGetDepartmentDetailRequest();
        request.setDepartmentId(departmentId);
        request.setOpenDepartmentId(openDepartmentId);
        FeishuDepartmentDetailResponse response = feishuServiceProvider.getFeishuTemplate().departmentOperations().getDepartmentDetail(tenantKey, request);
        return response.getData().getDepartmentInfo();
    }

    @Override
    public List<FeishuDepartmentDetail> batchGetDepartmentDetail(String tenantKey, List<String> departmentIds) {
        FeishuBatchGetDepartmentDetailListRequest request = new FeishuBatchGetDepartmentDetailListRequest();
        request.setDepartmentIds(departmentIds);
        FeishuDepartmentDetailListResponse response = feishuServiceProvider.getFeishuTemplate().departmentOperations().batchGetDepartmentDetail(tenantKey, request);
        return response.getData().getDepartmentInfos();
    }

    @Override
    public List<FeishuDepartmentInfo> getAllSubDepartments(String tenantKey, List<String> departmentIds) {
        List<FeishuDepartmentInfo> departmentList = new ArrayList<>();
        departmentIds.forEach(departmentId -> {
            List<FeishuDepartmentInfo> departmentInfos = getDeptListByParentDept(tenantKey, departmentId, 100, true);
            if (CollUtil.isNotEmpty(departmentInfos)) {
                departmentList.addAll(departmentInfos);
            }
        });
        return departmentList;
    }

    @Override
    public List<FeishuDepartmentInfo> getDeptListByParentDept(String tenantKey, String departmentId, int pageSize, boolean fetchChild) {
        return feishuServiceProvider.getFeishuTemplate().departmentOperations().getDeptListByParentDept(tenantKey, departmentId, pageSize, fetchChild).all();
    }

    @Override
    public List<FeishuUserDetail> getUserListByDept(String tenantKey, String departmentId, int pageSize, boolean fetchChild) {
        return feishuServiceProvider.getFeishuTemplate().departmentOperations().getUserListByDept(tenantKey, departmentId, pageSize, true).all();
    }

    @Override
    public FeishuDeptObject getDept(String tenantKey, String departmentId, String openDepartmentId) {
        DeptIdType deptIdType = null;
        if (StrUtil.isNotBlank(departmentId)) {
            deptIdType = DeptIdTypeBuilder.departmentId(departmentId);
        }
        else if (StrUtil.isNotBlank(openDepartmentId)) {
            deptIdType = DeptIdTypeBuilder.openDepartmentId(openDepartmentId);
        }
        return feishuServiceProvider.getFeishuTemplate().departmentOperations().getDept(tenantKey, deptIdType).getData().getDepartment();
    }

    @Override
    public FeishuV3DeptsPager getDeptPager(String tenantKey, String parentDepartmentId) {
        return feishuServiceProvider.getFeishuTemplate().departmentOperations().getDepts(tenantKey, DeptIdTypeBuilder.departmentId(parentDepartmentId));
    }

    @Override
    public FeishuV3DeptsPager getDeptPagerByOpenDepartmentId(String tenantKey, String parentOpenDepartmentId) {
        return feishuServiceProvider.getFeishuTemplate().departmentOperations().getDepts(tenantKey, DeptIdTypeBuilder.openDepartmentId(parentOpenDepartmentId));
    }

    @Override
    public FeishuUserObject getUser(String tenantKey, String openId) {
        return feishuServiceProvider.getFeishuTemplate().userOperations().getUser(tenantKey, UserIdTypeBuilder.openId(openId)).getData().getUser();
    }

    @Override
    public FeishuV3UsersPager getUserPager(String tenantKey, String departmentId) {
        return feishuServiceProvider.getFeishuTemplate().userOperations().getUsers(tenantKey, DeptIdTypeBuilder.departmentId(departmentId));
    }

    @Override
    public FeishuV3UsersPager getUserPagerByOpenDeptId(String tenantKey, String openDepartmentId) {
        return feishuServiceProvider.getFeishuTemplate().userOperations().getUsers(tenantKey, DeptIdTypeBuilder.openDepartmentId(openDepartmentId));
    }
}
