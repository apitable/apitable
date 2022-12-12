package com.vikadata.api.user.dto;

import lombok.Data;

/**
 * User Language and Email
 */
@Data
public class UserLangDTO {

    private Long id;

    private String locale;

    private String email;

}
