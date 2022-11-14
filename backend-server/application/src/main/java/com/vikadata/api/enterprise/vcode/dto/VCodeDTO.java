package com.vikadata.api.enterprise.vcode.dto;

import lombok.Data;

@Data
public class VCodeDTO {

    private Long userId;

    private String vCode;

    private Integer type;
}
