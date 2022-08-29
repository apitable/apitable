package com.vikadata.api.modular.control.model;

import lombok.Data;

/**
 * <p>
 * 权限控制单元及类型DTO
 * </p>
 *
 * @author Chambers
 * @date 2021/12/29
 */
@Data
public class ControlTypeDTO {

    private String controlId;

    private Integer controlType;
}
