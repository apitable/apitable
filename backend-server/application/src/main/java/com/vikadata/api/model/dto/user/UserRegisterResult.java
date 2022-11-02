package com.vikadata.api.model.dto.user;

import lombok.Data;

@Data
public class UserRegisterResult {

    private Long userId;

    private boolean isNewUser;

    private Integer type;

    private String unionId;

    private boolean emailRegister;
}
