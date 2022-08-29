package com.vikadata.api.model.dto.vcode;

import lombok.Data;

/**
 * <p>
 * VCodeDTO
 * </p>
 *
 * @author Chambers
 * @date 2021/7/14
 */
@Data
public class VCodeDTO {

    private Long userId;

    private String vCode;

    private Integer type;
}
