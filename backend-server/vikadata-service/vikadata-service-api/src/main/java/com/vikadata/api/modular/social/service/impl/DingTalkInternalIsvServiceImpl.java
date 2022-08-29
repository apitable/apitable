package com.vikadata.api.modular.social.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.annotation.Resource;

import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.NumberUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.modular.grpc.client.service.IGrpcClientService;
import com.vikadata.api.modular.social.mapper.SocialTenantMapper;
import com.vikadata.api.modular.social.service.IDingTalkInternalIsvService;
import com.vikadata.api.modular.social.service.ISocialUserBindService;
import com.vikadata.boot.autoconfigure.social.DingTalkProperties;
import com.vikadata.boot.autoconfigure.social.DingTalkProperties.IsvAppProperty;
import com.vikadata.integration.grpc.CorpBizDataDto;
import com.vikadata.integration.grpc.DingTalkUserDto;
import com.vikadata.integration.grpc.DingTalkUserDto.Builder;
import com.vikadata.integration.grpc.TenantInfoResult;
import com.vikadata.social.dingtalk.enums.DingTalkBizType;
import com.vikadata.social.dingtalk.enums.DingTalkMediaType;
import com.vikadata.social.dingtalk.exception.DingTalkApiException;
import com.vikadata.social.dingtalk.model.DingTalkAsyncSendCorpMessageResponse;
import com.vikadata.social.dingtalk.model.DingTalkCreateApaasAppRequest;
import com.vikadata.social.dingtalk.model.DingTalkCreateApaasAppResponse;
import com.vikadata.social.dingtalk.model.DingTalkInternalOrderResponse.InAppGoodsOrderVo;
import com.vikadata.social.dingtalk.model.DingTalkSsoUserInfoResponse;
import com.vikadata.social.dingtalk.model.DingTalkUserDetail;
import com.vikadata.social.dingtalk.model.DingTalkUserListResponse.UserPageResult;
import com.vikadata.social.dingtalk.model.UserInfoV2;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import static com.vikadata.social.dingtalk.constants.DingTalkApiConst.SEND_MESSAGE_BY_ID_MAX_COUNT;
import static com.vikadata.social.dingtalk.constants.DingTalkApiConst.SEND_MESSAGE_USER_MAX_COUNT;

/**
 * 钉钉集成服务 接口实现
 *
 * @author Shawn Deng
 * @date 2020-12-08 16:29:55
 */
@Service
@Slf4j
public class DingTalkInternalIsvServiceImpl implements IDingTalkInternalIsvService {

    @Resource
    private IGrpcClientService iGrpcClientService;

    @Resource
    private SocialTenantMapper socialTenantMapper;

    @Autowired(required = false)
    private DingTalkProperties dingTalkProperties;

    @Resource
    private ISocialUserBindService iSocialUserBindService;

    @Override
    public UserInfoV2 getUserInfoByCode(String suiteId, String authCorpId, String code) {
        try {
            return iGrpcClientService.getUserInfoByCode(suiteId, authCorpId, code);
        }
        catch (Exception e) {
            log.error("根据临时授权码获取用户信息失败", e);
        }
        return null;
    }

    @Override
    public DingTalkSsoUserInfoResponse getSsoUserInfoByCode(String suiteId, String code) {
        try {
            return iGrpcClientService.getSsoUserInfoByCode(suiteId, code);
        }
        catch (Exception e) {
            log.error("根据临时授权码获取后台用户信息失败", e);
        }
        return null;
    }

    @Override
    public DingTalkUserDetail getUserDetailByCode(String suiteId, String authCorpId, String code) {
        UserInfoV2 userInfo = getUserInfoByCode(suiteId, authCorpId, code);
        if (userInfo != null) {
            try {
                return getUserDetailByUserId(suiteId, authCorpId, userInfo.getUserid());
            }
            catch (Exception e) {
                log.error("根据userId取用户信息失败", e);
            }
        }
        return null;
    }

    @Override
    public DingTalkUserDetail getUserDetailByUserId(String suiteId, String authCorpId, String userId) {
        return iGrpcClientService.getIsvUserDetailByUserId(suiteId, authCorpId, userId);
    }


    @Override
    public DingTalkUserDto getIsvUserDetailByUserId(String suiteId, String authCorpId, String userId) {
        DingTalkUserDetail userDetail = getUserDetailByUserId(suiteId, authCorpId, userId);
        return getIsvDingTalkUserInfo(userDetail);
    }

    @Override
    public Boolean getSocialTenantStatus(String suiteId, String authCorpId) {
        return iGrpcClientService.getSocialTenantStatus(suiteId, authCorpId);
    }

    @Override
    public List<Long> getDepartmentSubIdList(String suiteId, String authCorpId, Long deptId) {
        try {
            return iGrpcClientService.getDingTalkDepartmentSubIdList(suiteId, authCorpId, deptId.toString()).stream().filter(x -> x > 0).collect(Collectors.toList());
        }
        catch (Exception e) {
            log.error("获取子部门ID异常:{}:{}", authCorpId, deptId, e);
            return new ArrayList<>();
        }
    }

    @Override
    public UserPageResult getDeptUserDetailList(String suiteId, String authCorpId, Long deptId, Integer cursor,
            Integer size) {
        return iGrpcClientService.getDingTalkDeptUserList(suiteId, authCorpId, deptId.toString(), cursor, size);
    }

    @Override
    public HashMap<String, DingTalkUserDto> getAuthCorpUserDetailMap(String suiteId, String authCorpId,
            List<String> authDeptIds, List<String> authUserIds) {
        log.info("钉钉ISV获取通讯录开始:{}", authCorpId);
        long startAt = System.currentTimeMillis();
        HashMap<String, DingTalkUserDto> userMap = new HashMap<>();
        if (!authDeptIds.isEmpty()) {
            userMap.putAll(getUserTreeList(suiteId, authCorpId, authDeptIds));
        }
        if (!authUserIds.isEmpty()) {
            Set<String> existOpenIds =
                    userMap.values().stream().map(DingTalkUserDto::getOpenId).collect(Collectors.toSet());
            List<String> openIds =
                    authUserIds.stream().filter(i -> !existOpenIds.contains(i)).collect(Collectors.toList());
            userMap.putAll(getAuthCorpUserDetailListByUserIds(suiteId, authCorpId, openIds));
        }
        log.info("钉钉ISV获取通讯录耗时:{}:{}:{}ms", authCorpId, userMap.size(), System.currentTimeMillis() - startAt);
        return userMap;
    }

    @Override
    public Map<String, DingTalkUserDto> getAuthCorpUserDetailListByUserIds(String suiteId, String authCorpId,
            List<String> userIds) {
        HashMap<String, DingTalkUserDto> userMap = MapUtil.newHashMap();
        for (String userId : userIds) {
            DingTalkUserDetail userDetail = getUserDetailByUserId(suiteId, authCorpId, userId);
            if (userDetail.getActive()) {
                userMap.put(userDetail.getUnionid(), getIsvDingTalkUserInfo(userDetail));
            }
        }
        return handleIsvDingTalkUserName(userMap);
    }

    @Override
    public List<DingTalkAsyncSendCorpMessageResponse> sendMessageToUserByTemplateId(String suiteId, String authCorpId,
            String templateId, HashMap<String, String> data, List<String> userIds) {
        String agentId = getIsvDingTalkAgentId(suiteId, authCorpId);
        return sendMessageToUserByTemplateId(suiteId, authCorpId, templateId, data, userIds, agentId);
    }

    @Override
    public List<DingTalkAsyncSendCorpMessageResponse> sendMessageToUserByTemplateId(String suiteId, String authCorpId,
            String templateId, HashMap<String, String> data, List<String> userIds, String agentId) {
        List<DingTalkAsyncSendCorpMessageResponse> results = new ArrayList<>();
        if (agentId != null) {
            int maxSize = NumberUtil.ceilDiv(userIds.size(), SEND_MESSAGE_BY_ID_MAX_COUNT);
            Stream.iterate(0, n -> n + 1).limit(maxSize).forEach(i -> {
                List<String> tmpUserIds =
                        userIds.stream().skip((long) i * SEND_MESSAGE_BY_ID_MAX_COUNT).limit(SEND_MESSAGE_BY_ID_MAX_COUNT).collect(Collectors.toList());
                try {
                    DingTalkAsyncSendCorpMessageResponse response =
                            iGrpcClientService.sendMessageToUserByTemplateId(suiteId, authCorpId, agentId,
                                    templateId, data, tmpUserIds);
                    results.add(response);
                }
                catch (DingTalkApiException e) {
                    log.error("发送钉钉开始使用通知失败:suiteId={},userIds={}", suiteId, tmpUserIds, e);
                }
            });
        }
        return results;
    }

    @Override
    public IsvAppProperty getIsvAppConfig(String suiteId) {
        if (dingTalkProperties != null) {
            if (dingTalkProperties.getIsvAppList() != null) {
                for (IsvAppProperty isv : dingTalkProperties.getIsvAppList()) {
                    if (suiteId.equals(isv.getSuiteId())) {
                        return isv;
                    }
                }
            }
        }
        return null;
    }

    @Override
    public IsvAppProperty getIsvAppConfigByDingDingDaKey(String dingDingDaKey) {
        if (dingTalkProperties.getIsvAppList() != null) {
            for (IsvAppProperty isv : dingTalkProperties.getIsvAppList()) {
                if (isv.getDingTalkDa() != null && dingDingDaKey.equals(isv.getDingTalkDa().getKey())) {
                    return isv;
                }
            }
        }
        return null;
    }

    @Override
    public String uploadMedia(String suiteId, String authCorpId, DingTalkMediaType mediaType, byte[] file, String fileName) {
        return iGrpcClientService.uploadMedia(suiteId, authCorpId, mediaType, file, fileName);
    }

    @Override
    public DingTalkCreateApaasAppResponse createMicroApaasApp(String suiteId, String authCorpId, DingTalkCreateApaasAppRequest request) {
        return iGrpcClientService.createMicroApaasApp(suiteId, authCorpId, request);
    }

    @Override
    public TenantInfoResult getSocialTenantInfo(String authCorpId, String suiteId) {
        return iGrpcClientService.getSocialTenantInfo(authCorpId, suiteId);
    }

    @Override
    public String getInternalSkuPage(String suiteId, String authCorpId, String callbackPage, String extendParam) {
        IsvAppProperty app = getIsvAppConfig(suiteId);
        if (app != null && app.getGoodsCode() != null) {
            return iGrpcClientService.getInternalSkuPage(suiteId, authCorpId, app.getGoodsCode(), callbackPage, extendParam);
        }
        return null;
    }

    @Override
    public Boolean internalOrderFinish(String suiteId, String authCorpId, String orderId) {
        try {
            return iGrpcClientService.internalOrderFinish(suiteId, authCorpId, orderId);
        }
        catch (Exception e) {
            log.error("标记订单处理完成失败:{}:{}", authCorpId, orderId, e);
        }
        return false;
    }

    @Override
    public InAppGoodsOrderVo getInternalOrder(String suiteId, String authCorpId, String orderId) {
        try {
            return iGrpcClientService.getInternalOrder(suiteId, authCorpId, orderId);
        }
        catch (Exception e) {
            log.error("获取钉钉订单数据失败:{}", orderId, e);
        }
        return null;
    }

    @Override
    public String ddConfigSign(String suiteId, String authCorpId, String nonceStr, String timestamp, String url) {
        return iGrpcClientService.ddConfigSign(suiteId, authCorpId, nonceStr, timestamp, url);
    }

    @Override
    public String getIsvDingTalkAgentId(String suiteId, String authCorpId) {
        String result = socialTenantMapper.selectIsvAgentIdByTenantIdAndAppId(authCorpId, suiteId);
        if (result != null) {
            JSONArray jsonArray = JSONUtil.parseArray(result);
            Object agentId = jsonArray.get(0);
            if (agentId != null) {
                return agentId.toString();
            }
            log.error("企业AgentId信息错误:{}:{}:{}", authCorpId, suiteId, result);
        }
        log.warn("企业信息错误:{}:{}", authCorpId, suiteId);
        return null;
    }

    @Override
    public Integer getUserCount(String suiteId, String authCorpId, Boolean onlyActive) {
        return iGrpcClientService.getDingTalkIsvUserCount(suiteId, authCorpId, onlyActive);
    }

    @Override
    public Integer getUserCountByDeptIds(String suiteId, String authCorpId, List<String> deptIds) {
        Set<String> userIds = new HashSet<>();
        for (String deptId : deptIds) {
            List<String> tmpUserIds = iGrpcClientService.getDingTalkUserIdListByDeptId(suiteId, authCorpId,
                    Long.parseLong(deptId));
            userIds.addAll(tmpUserIds);
        }
        return userIds.size();
    }

    @Override
    public Integer getUserCountByDeptIdsAndUserIds(String suiteId, String authCorpId, List<String> deptIds,
            List<String> userIds) {
        Set<String> userIdSet = new HashSet<>(userIds);
        for (String deptId : deptIds) {
            List<String> tmpUserIds = iGrpcClientService.getDingTalkUserIdListByDeptId(suiteId, authCorpId,
                    Long.parseLong(deptId));
            userIdSet.addAll(tmpUserIds);
        }
        return userIdSet.size();
    }

    @Override
    public Map<String, DingTalkUserDto> getUserTreeList(String suiteId, String authCorpId, List<String> subDeptIds) {
        log.info("获取钉钉企业授权人员信息开始-[{}]", authCorpId);
        long startedAt = System.currentTimeMillis();
        Map<String, DingTalkUserDto> userMap = iGrpcClientService.getUserTreeList(suiteId, authCorpId, subDeptIds);
        log.info("获取钉钉企业授权人员信息结束-[{}],部门:{},总人数:{},耗时:{}", authCorpId, subDeptIds, userMap.size(),
                System.currentTimeMillis() - startedAt);
        return handleIsvDingTalkUserName(userMap);
    }

    @Override
    public List<CorpBizDataDto> getCorpBizDataByBizTypes(String suiteId, String authCorpId, List<DingTalkBizType> bizTypes) {
        List<Integer> types = bizTypes.stream().map(DingTalkBizType::getValue).collect(Collectors.toList());
        return iGrpcClientService.getCorpBizDataByBizTypes(suiteId, authCorpId, types);
    }

    private DingTalkUserDto getIsvDingTalkUserInfo(DingTalkUserDetail userDetail) {
        Builder dto = DingTalkUserDto.newBuilder();
        dto.setOpenId(userDetail.getUserid());
        dto.setUnionId(userDetail.getUnionid());
        if (StrUtil.isNotBlank(userDetail.getAvatar())) {
            dto.setAvatar(userDetail.getAvatar());
        }
        if (StrUtil.isNotBlank(userDetail.getName())) {
            dto.setUserName(userDetail.getName());
        }
        return dto.build();
    }

    private Map<String, DingTalkUserDto> handleIsvDingTalkUserName(Map<String, DingTalkUserDto> users) {
        if (users.isEmpty()) {
            return users;
        }
        HashMap<String, DingTalkUserDto> userMap = new HashMap<>(users);
        int maxSize = NumberUtil.ceilDiv(userMap.size(), SEND_MESSAGE_USER_MAX_COUNT);
        // 根据unionId查出用户的名称
        Set<String> unionIds = userMap.keySet();
        Stream.iterate(0, n -> n + 1).limit(maxSize).forEach(i -> {
            List<String> tmpUnionIds =
                    unionIds.stream().skip((long) i * SEND_MESSAGE_USER_MAX_COUNT).limit(SEND_MESSAGE_USER_MAX_COUNT).collect(Collectors.toList());
            HashMap<String, String> nickNameMap = iSocialUserBindService.getUserNameByUnionIds(tmpUnionIds);
            nickNameMap.forEach((k, v) -> {
                Builder userInfo = userMap.get(k).toBuilder();
                userInfo.setUserName(v);
                userMap.put(k, userInfo.build());
            });
        });
        return userMap;
    }
}
