package com.vikadata.integration.idaas.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * 获取用户信息
 * </p>
 * @author 刘斌华
 * @date 2022-05-24 17:22:22
 */
@Setter
@Getter
public class UserInfoResponse {

    /**
     * 用户唯一 ID
     */
    @JsonProperty("user_id")
    private String userId;

    /**
     * 用户名
     */
    @JsonProperty("sub")
    private String sub;

    /**
     * 用户在千帆玉符的显示名称
     */
    @JsonProperty("name")
    private String name;

    /**
     * 用户在千帆玉符的邮箱
     */
    @JsonProperty("email")
    private String email;

    /**
     * 用户在千帆玉符的手机号
     */
    @JsonProperty("phone_number")
    private String phoneNumber;

}
