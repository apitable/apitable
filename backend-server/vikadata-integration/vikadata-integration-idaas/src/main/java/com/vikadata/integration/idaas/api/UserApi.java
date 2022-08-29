package com.vikadata.integration.idaas.api;

import java.util.List;
import java.util.Objects;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.text.CharSequenceUtil;

import com.vikadata.integration.idaas.IdaasApiException;
import com.vikadata.integration.idaas.IdaasTemplate;
import com.vikadata.integration.idaas.constant.ApiUri;
import com.vikadata.integration.idaas.model.UsersRequest;
import com.vikadata.integration.idaas.model.UsersResponse;
import com.vikadata.integration.idaas.model.UsersResponse.UserResponse;
import com.vikadata.integration.idaas.model.UsersResponse.UserResponse.Values;
import com.vikadata.integration.idaas.support.ServiceAccount;

import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

/**
 * <p>
 * 人员 API
 * </p>
 * @author 刘斌华
 * @date 2022-05-13 16:25:27
 */
public class UserApi {

    private final IdaasTemplate idaasTemplate;
    private final String contactHost;

    public UserApi(IdaasTemplate idaasTemplate, String contactHost) {
        this.idaasTemplate = idaasTemplate;
        this.contactHost = contactHost;
    }

    /**
     * 获取人员列表
     *
     * @param request 请求参数
     * @param serviceAccount 租户 ServiceAccount
     * @param tenantName 租户名
     * @return 返回结果
     * @author 刘斌华
     * @date 2022-05-13 16:43:13
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
                // 用户没有手机号码、邮箱时会传空字符，这里设置为 null，防止后续保存时字段重复
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
