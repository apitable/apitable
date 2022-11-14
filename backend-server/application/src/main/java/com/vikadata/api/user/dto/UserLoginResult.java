package com.vikadata.api.user.dto;

import lombok.Data;

@Data
public class UserLoginResult {

    private Long userId;

    private String unionId;

    private String nickName;

    private Boolean isSignUp;

    @Deprecated
    private String token;
}
