package com.vikadata.api.modular.social.model;

import io.swagger.annotations.ApiModel;
import lombok.Data;

@Data
@ApiModel("OneAccess UserInfo Response")
public class OneAccessUserInfoResponse {

    private String error_code;

    private String msg;

    /**
     * The corresponding login user name
     */
    private String loginName;

    /**
     * The corresponding integrated application system account (used when the application account is inconsistent with the user name or has multiple accounts)
     */
    private String[] spRoleList;

    private String uid;
}
