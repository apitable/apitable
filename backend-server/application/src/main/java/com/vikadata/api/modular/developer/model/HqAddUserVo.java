package com.vikadata.api.modular.developer.model;

import io.swagger.annotations.ApiModel;
import lombok.Data;

@Data
@ApiModel("Hq Add User Vo")
public class HqAddUserVo {

    private String username;
    private String password;
    private String phone;
}
