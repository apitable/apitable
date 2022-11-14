package com.vikadata.api.user.dto;

import lombok.Data;

@Data
public class UserRegisterResult {

    private Long userId;

    private boolean isNewUser;

    private Integer type;

    private String unionId;

    private boolean emailRegister;
}
