package com.vikadata.api.modular.user.model;

import lombok.Data;

/**
 * 用户语言及其邮箱
 *
 * @author wuyitao
 * @date 22/01/21
 */
@Data
public class UserLangDTO {

    private Long id;

    private String locale;

    private String email;

}
