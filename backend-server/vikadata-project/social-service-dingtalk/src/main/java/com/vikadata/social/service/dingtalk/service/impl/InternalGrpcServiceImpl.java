package com.vikadata.social.service.dingtalk.service.impl;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.io.FileUtil;
import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import com.google.protobuf.Any;
import com.google.protobuf.BoolValue;
import com.google.protobuf.ByteString;
import com.google.protobuf.StringValue;
import com.google.protobuf.UInt32Value;
import io.grpc.stub.StreamObserver;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.server.service.GrpcService;

import com.vikadata.integration.grpc.AsyncSendMessageResult;
import com.vikadata.integration.grpc.CorpBizDataDto;
import com.vikadata.integration.grpc.CorpBizDataResult;
import com.vikadata.integration.grpc.CreateMicroApaasAppResult;
import com.vikadata.integration.grpc.CreateMicroApaasAppRo;
import com.vikadata.integration.grpc.DepartmentSubIdRo;
import com.vikadata.integration.grpc.DeptUserListRo;
import com.vikadata.integration.grpc.DingTalkServiceGrpc;
import com.vikadata.integration.grpc.DingTalkSsoUserInfoResult;
import com.vikadata.integration.grpc.DingTalkUserDto;
import com.vikadata.integration.grpc.GetCorpBizDataRo;
import com.vikadata.integration.grpc.GetDdConfigSignRo;
import com.vikadata.integration.grpc.GetInternalOrderRo;
import com.vikadata.integration.grpc.GetInternalSkuPageRo;
import com.vikadata.integration.grpc.GetSocialTenantStatusRo;
import com.vikadata.integration.grpc.GetSsoUserInfoByCodeRo;
import com.vikadata.integration.grpc.GetUserCountRo;
import com.vikadata.integration.grpc.GetUserIdListByDeptIdRo;
import com.vikadata.integration.grpc.GetUserInfoByCodeRo;
import com.vikadata.integration.grpc.GetUserTreeListRo;
import com.vikadata.integration.grpc.InternalOrderFinishRo;
import com.vikadata.integration.grpc.RequestIdResult;
import com.vikadata.integration.grpc.SendMessageToUserByTemplateIdRo;
import com.vikadata.integration.grpc.TenantInfoResult;
import com.vikadata.integration.grpc.UploadMediaRo;
import com.vikadata.integration.grpc.UserDetailRo;
import com.vikadata.integration.grpc.UserTreeListResult;
import com.vikadata.social.dingtalk.enums.DingTalkMediaType;
import com.vikadata.social.dingtalk.model.BaseResponse;
import com.vikadata.social.dingtalk.model.DingTalkAsyncSendCorpMessageResponse;
import com.vikadata.social.dingtalk.model.DingTalkCreateApaasAppRequest;
import com.vikadata.social.dingtalk.model.DingTalkCreateApaasAppResponse;
import com.vikadata.social.dingtalk.model.DingTalkDepartmentSubIdListResponse;
import com.vikadata.social.dingtalk.model.DingTalkDepartmentUserIdListResponse;
import com.vikadata.social.dingtalk.model.DingTalkInternalOrderResponse;
import com.vikadata.social.dingtalk.model.DingTalkMediaUploadResponse;
import com.vikadata.social.dingtalk.model.DingTalkSkuPageResponse;
import com.vikadata.social.dingtalk.model.DingTalkSsoUserInfoResponse;
import com.vikadata.social.dingtalk.model.DingTalkUserDetailResponse;
import com.vikadata.social.dingtalk.model.DingTalkUserInfoV2Response;
import com.vikadata.social.dingtalk.model.DingTalkUserListResponse;
import com.vikadata.social.service.dingtalk.model.dto.SocialTenantBizDataDto;
import com.vikadata.social.service.dingtalk.model.dto.SocialTenantDto;
import com.vikadata.social.service.dingtalk.service.IDingTalkOpenSyncBizDataService;
import com.vikadata.social.service.dingtalk.service.IDingTalkService;
import com.vikadata.social.service.dingtalk.service.ISocialTenantService;

/**
 * <p> 
 * 内部服务调用接口实现
 * 不catch任何异常，因为需要下层业务服务处理异常
 * </p> 
 * @author zoe zheng 
 * @date 2021/9/8 6:57 下午
 */
@GrpcService
@Slf4j
public class InternalGrpcServiceImpl extends DingTalkServiceGrpc.DingTalkServiceImplBase {

    @Resource
    private IDingTalkService iDingTalkService;

    @Resource
    private ISocialTenantService iSocialTenantService;

    @Resource
    private IDingTalkOpenSyncBizDataService iDingTalkOpenSyncBizDataService;

    @SneakyThrows
    @Override
    public void getDeptUserList(DeptUserListRo req, StreamObserver<RequestIdResult> responseObserver) {
        DingTalkUserListResponse response = iDingTalkService.getUserDetailList(req.getSuiteId(), req.getAuthCorpId(),
                Long.parseLong(req.getDeptId()), req.getCursor(), req.getSize());
        Any anyResult = packToAny(response.getResult());
        RequestIdResult result = RequestIdResult.newBuilder().setRequestId(response.getRequestId()).setResult(anyResult).build();
        responseObserver.onNext(result);
        responseObserver.onCompleted();
    }

    @SneakyThrows
    @Override
    public void getDepartmentSubIdList(DepartmentSubIdRo req, StreamObserver<RequestIdResult> responseObserver) {
        DingTalkDepartmentSubIdListResponse response = iDingTalkService.getDepartmentSubIdList(req.getSuiteId(),
                req.getAuthCorpId(), Long.parseLong(req.getDeptId()));
        Any anyResult = packToAny(response.getResult());
        RequestIdResult result = RequestIdResult.newBuilder().setRequestId(response.getRequestId()).setResult(anyResult).build();
        responseObserver.onNext(result);
        responseObserver.onCompleted();
    }

    @SneakyThrows
    @Override
    public void getUserDetailByUserId(UserDetailRo req, StreamObserver<RequestIdResult> responseObserver) {
        DingTalkUserDetailResponse response = iDingTalkService.getUserDetailByUserId(req.getSuiteId(),
                req.getAuthCorpId(), req.getUserId());
        Any anyResult = packToAny(response.getResult());
        RequestIdResult result = RequestIdResult.newBuilder().setRequestId(response.getRequestId()).setResult(anyResult).build();
        responseObserver.onNext(result);
        responseObserver.onCompleted();
    }

    @SneakyThrows
    @Override
    public void getSocialTenantStatus(GetSocialTenantStatusRo req, StreamObserver<BoolValue> responseObserver) {
        boolean isTenantAppExist = iSocialTenantService.getTenantStatus(req.getAuthCorpId(), req.getSuiteId());
        BoolValue result = BoolValue.newBuilder().setValue(isTenantAppExist).build();
        responseObserver.onNext(result);
        responseObserver.onCompleted();
    }


    @SneakyThrows
    @Override
    public void getUserInfoByCode(GetUserInfoByCodeRo req, StreamObserver<RequestIdResult> responseObserver) {
        DingTalkUserInfoV2Response response = iDingTalkService.getUserInfoByCode(req.getSuiteId(), req.getAuthCorpId(), req.getCode());
        Any anyResult = packToAny(response.getResult());
        RequestIdResult result = RequestIdResult.newBuilder().setRequestId(response.getRequestId()).setResult(anyResult).build();
        responseObserver.onNext(result);
        responseObserver.onCompleted();
    }

    @SneakyThrows
    @Override
    public void getSsoUserInfoByCode(GetSsoUserInfoByCodeRo req, StreamObserver<DingTalkSsoUserInfoResult> responseObserver) {
        DingTalkSsoUserInfoResponse response = iDingTalkService.getSsoUserInfoByCode(req.getSuiteId(), req.getCode());
        Any userInfo = packToAny(response.getUserInfo());
        Any corpInfo = packToAny(response.getCorpInfo());
        DingTalkSsoUserInfoResult result = DingTalkSsoUserInfoResult.newBuilder()
                .setErrcode(response.getErrcode())
                .setErrmsg(response.getErrmsg())
                .setUserInfo(userInfo)
                .setIsSys(response.getIsSys())
                .setCorpInfo(corpInfo).build();
        responseObserver.onNext(result);
        responseObserver.onCompleted();
    }

    @SneakyThrows
    @Override
    public void sendMessageToUserByTemplateId(SendMessageToUserByTemplateIdRo req, StreamObserver<AsyncSendMessageResult> responseObserver) {
        DingTalkAsyncSendCorpMessageResponse response = iDingTalkService.sendMessageToUserByTemplateId(req.getSuiteId(),
                req.getAuthCorpId(), req.getAgentId(), req.getTemplateId(), req.getData(), req.getUserIdsList());
        AsyncSendMessageResult result = AsyncSendMessageResult.newBuilder()
                .setRequestId(response.getRequestId())
                .setTaskId(response.getTaskId()).build();
        responseObserver.onNext(result);
        responseObserver.onCompleted();
    }

    @SneakyThrows
    @Override
    public void uploadMedia(UploadMediaRo req, StreamObserver<StringValue> responseObserver) {
        File file = FileUtil.writeBytes(req.getFileBytes().toByteArray(), req.getFileName());
        DingTalkMediaUploadResponse response = iDingTalkService.uploadMedia(req.getSuiteId(),
                req.getAuthCorpId(), DingTalkMediaType.of(req.getMediaType()), file);
        StringValue result = StringValue.newBuilder().setValue(response.getMediaId()).build();
        responseObserver.onNext(result);
        responseObserver.onCompleted();
    }

    @SneakyThrows
    @Override
    public void createMicroApaasApp(CreateMicroApaasAppRo req, StreamObserver<CreateMicroApaasAppResult> responseObserver) {
        DingTalkCreateApaasAppRequest ro = new DingTalkCreateApaasAppRequest();
        ro.setAppName(req.getAppName());
        ro.setAppDesc(req.getAppDesc());
        ro.setAppIcon(req.getAppIcon());
        ro.setHomepageLink(req.getHomepageLink());
        ro.setPcHomepageLink(req.getPcHomepageLink());
        ro.setOmpLink(req.getOmpLink());
        ro.setHomepageEditLink(req.getHomepageEditLink());
        ro.setPcHomepageEditLink(req.getPcHomepageEditLink());
        ro.setOpUserId(req.getOpUserId());
        ro.setBizAppId(req.getBizAppId());
        ro.setTemplateKey(req.getTemplateKey());
        DingTalkCreateApaasAppResponse response = iDingTalkService.createMicroApaasApp(req.getSuiteId(), req.getAuthCorpId(), ro);
        CreateMicroApaasAppResult result = CreateMicroApaasAppResult.newBuilder()
                .setBizAppId(response.getBizAppId())
                .setAgentId(response.getAgentId()).build();
        responseObserver.onNext(result);
        responseObserver.onCompleted();
    }

    @SneakyThrows
    @Override
    public void getSocialTenantInfo(GetSocialTenantStatusRo req, StreamObserver<TenantInfoResult> responseObserver) {
        SocialTenantDto dto = iSocialTenantService.getByTenantIdAndAppId(req.getAuthCorpId(), req.getSuiteId());
        boolean status = false;
        String agentId = "";
        if (dto != null) {
            status = SqlHelper.retBool(dto.getStatus());
            if (dto.getAgentId() != null) {
                JSONArray jsonArray = JSONUtil.parseArray(dto.getAgentId());
                Object agentIdObj = jsonArray.get(0);
                if (agentIdObj != null) {
                    agentId = agentIdObj.toString();
                }
            }
        }
        TenantInfoResult result = TenantInfoResult.newBuilder()
                .setTenantId(req.getAuthCorpId())
                .setStatus(status)
                .setAgentId(agentId)
                .build();
        responseObserver.onNext(result);
        responseObserver.onCompleted();
    }

    @SneakyThrows
    @Override
    public void getInternalSkuPage(GetInternalSkuPageRo req, StreamObserver<StringValue> responseObserver) {
        DingTalkSkuPageResponse response = iDingTalkService.getInternalSkuPage(req.getSuiteId(), req.getAuthCorpId(),
                req.getGoodsCode(), req.getCallbackPage(), req.getExtendParam());
        StringValue result = StringValue.newBuilder().setValue(response.getResult()).build();
        responseObserver.onNext(result);
        responseObserver.onCompleted();
    }

    @SneakyThrows
    @Override
    public void internalOrderFinish(InternalOrderFinishRo req, StreamObserver<BoolValue> responseObserver) {
        BaseResponse response = iDingTalkService.internalOrderFinish(req.getSuiteId(), req.getAuthCorpId(), req.getOrderId());
        BoolValue result = BoolValue.newBuilder().setValue(response.getErrcode() == 0).build();
        responseObserver.onNext(result);
        responseObserver.onCompleted();
    }

    @SneakyThrows
    @Override
    public void getInternalOrder(GetInternalOrderRo req, StreamObserver<RequestIdResult> responseObserver) {
        DingTalkInternalOrderResponse response = iDingTalkService.getInternalOrder(req.getSuiteId(),
                req.getAuthCorpId(), req.getOrderId());
        Any anyResult = packToAny(response.getResult());
        RequestIdResult result = RequestIdResult.newBuilder().setRequestId("").setResult(anyResult).build();
        responseObserver.onNext(result);
        responseObserver.onCompleted();
    }

    @SneakyThrows
    @Override
    public void getDdConfigSign(GetDdConfigSignRo req, StreamObserver<StringValue> responseObserver) {
        String value = iDingTalkService.ddConfigSign(req.getSuiteId(), req.getAuthCorpId(),
                req.getNonceStr(), req.getTimestamp(), req.getUrl());
        StringValue result = StringValue.newBuilder().setValue(value).build();
        responseObserver.onNext(result);
        responseObserver.onCompleted();
    }

    @SneakyThrows
    @Override
    public void getUserCount(GetUserCountRo req, StreamObserver<UInt32Value> responseObserver) {
        Integer value = iDingTalkService.getUserCount(req.getSuiteId(), req.getAuthCorpId(), req.getOnlyActive());
        UInt32Value result = UInt32Value.newBuilder().setValue(value).build();
        responseObserver.onNext(result);
        responseObserver.onCompleted();
    }

    @SneakyThrows
    @Override
    public void getUserIdListByDeptId(GetUserIdListByDeptIdRo req, StreamObserver<RequestIdResult> responseObserver) {
        DingTalkDepartmentUserIdListResponse response = iDingTalkService.getUserIdListByDeptId(req.getSuiteId(),
                req.getAuthCorpId(), Long.parseLong(req.getDeptId()));
        Any anyResult = packToAny(response.getResult());
        RequestIdResult result = RequestIdResult.newBuilder().setRequestId(response.getRequestId()).setResult(anyResult).build();
        responseObserver.onNext(result);
        responseObserver.onCompleted();
    }

    @Override
    public void getUerTreeList(GetUserTreeListRo req, StreamObserver<UserTreeListResult> responseObserver) {
        long startedAt = System.currentTimeMillis();
        log.info("获取全部用户开始:{}", req.getAuthCorpId());
        HashMap<String, DingTalkUserDto> userMap = new HashMap<>();
        iDingTalkService.getUserTreeList(req.getSuiteId(), req.getAuthCorpId(), req.getSubDeptIdsList(), userMap);
        UserTreeListResult result = UserTreeListResult.newBuilder().putAllUserTreeList(userMap).build();
        log.info("获取全部用户结束:{}:{}", req.getAuthCorpId(), System.currentTimeMillis() - startedAt);
        responseObserver.onNext(result);
        responseObserver.onCompleted();
    }

    @Override
    public void getCorpBizData(GetCorpBizDataRo req, StreamObserver<CorpBizDataResult> responseObserver) {
        String subscribeId = req.getSuiteId() + "_0";
        List<SocialTenantBizDataDto> bizDatas = iDingTalkOpenSyncBizDataService.getBySubscribeIdAndBizTypes(subscribeId,
                req.getAuthCorpId(), req.getBizTypesList());
        List<CorpBizDataDto> dtoList =
                bizDatas.stream().map(i -> CorpBizDataDto.newBuilder().setBizData(i.getBizData()).setBizId(i.getBizId()).setBizType(i.getBizType()).build()).collect(Collectors.toList());
        CorpBizDataResult result = CorpBizDataResult.newBuilder().addAllResult(dtoList).build();
        responseObserver.onNext(result);
        responseObserver.onCompleted();
    }

    private Any packToAny(Object o) {
        return Any.newBuilder().setValue(ByteString.copyFromUtf8(JSONUtil.toJsonStr(o))).build();
    }
}
