package com.vikadata.api.modular.developer.model;

import io.swagger.annotations.ApiModel;
import lombok.Data;

/**
 * <p>
 * 总部命令添加用户返回
 * </p>
 *
 * @author 登录结果
 * @date 2020/5/27 15:20
 */
@Data
@ApiModel("总部命令添加用户返回")
public class HqAddUserVo {

    private String username;
    private String password;
    private String phone;
}
