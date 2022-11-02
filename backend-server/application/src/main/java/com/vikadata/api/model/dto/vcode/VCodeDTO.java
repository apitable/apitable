package com.vikadata.api.model.dto.vcode;

import lombok.Data;

@Data
public class VCodeDTO {

    private Long userId;

    private String vCode;

    private Integer type;
}
