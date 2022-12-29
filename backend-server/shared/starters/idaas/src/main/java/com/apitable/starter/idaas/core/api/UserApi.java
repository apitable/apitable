package com.apitable.starter.idaas.core.api;

import java.util.List;
import java.util.Objects;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.text.CharSequenceUtil;

import com.apitable.starter.idaas.core.IdaasApiException;
import com.apitable.starter.idaas.core.IdaasTemplate;
import com.apitable.starter.idaas.core.constant.ApiUri;
import com.apitable.starter.idaas.core.model.UsersRequest;
import com.apitable.starter.idaas.core.model.UsersResponse;
import com.apitable.starter.idaas.core.model.UsersResponse.UserResponse;
import com.apitable.starter.idaas.core.model.UsersResponse.UserResponse.Values;
import com.apitable.starter.idaas.core.support.ServiceAccount;

import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

/**
 * <p>
 * User API
 * </p>
 *
 */
public class UserApi {

    private final IdaasTemplate idaasTemplate;
    private final String contactHost;

    public UserApi(IdaasTemplate idaasTemplate, String contactHost) {
        this.idaasTemplate = idaasTemplate;
        this.contactHost = contactHost;
    }

    /**
     * get user list
     *
     * @param request request parameters
     * @param serviceAccount tenant ServiceAccount
     * @param tenantName tenant name
     * @return result
     */
    public UsersResponse users(UsersRequest request, ServiceAccount serviceAccount, String tenantName) throws IdaasApiException {
        MultiValueMap<String, Object> multiValueMap = new LinkedMultiValueMap<>();
        if (CharSequenceUtil.isNotBlank(request.getStatus())) {
            multiValueMap.set("status", request.getStatus());
        }
        if (CharSequenceUtil.isNotBlank(request.getDeptId())) {
            multiValueMap.set("dept_id", request.getDeptId());
        }
        if (CharSequenceUtil.isNotBlank(request.getPhoneNum())) {
            multiValueMap.set("phone_num", request.getPhoneNum());
        }
        if (Objects.nonNull(request.getStartTime())) {
            multiValueMap.set("start_time", request.getStartTime());
        }
        if (Objects.nonNull(request.getEndTime())) {
            multiValueMap.set("end_time", request.getEndTime());
        }
        multiValueMap.set("page_index", request.getPageIndex());
        multiValueMap.set("page_size", request.getPageSize());
        if (CollUtil.isNotEmpty(request.getOrderBy())) {
            multiValueMap.addAll("order_by", request.getOrderBy());
        }

        UsersResponse usersResponse = idaasTemplate.get(contactHost + ApiUri.USERS, multiValueMap, UsersResponse.class, tenantName, serviceAccount, null);
        List<UserResponse> userResponses = usersResponse.getData();
        if (CollUtil.isNotEmpty(userResponses)) {
            for (UserResponse userResponse : userResponses) {
                Values userValues = userResponse.getValues();
                // If a user does not have a mobile phone number or email address, empty characters will be transmitted.
                // Set this parameter to null to prevent field duplication in future saving.
                if (CharSequenceUtil.isBlank(userValues.getPhoneNum())) {
                    userValues.setPhoneNum(null);
                }
                if (CharSequenceUtil.isBlank(userValues.getPrimaryMail())) {
                    userValues.setPrimaryMail(null);
                }
            }
        }

        return usersResponse;
    }

}
