package com.vikadata.api.modular.organization.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * 组织单元信息DTO
 * </p>
 *
 * @author Chambers
 * @date 2022/6/6
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UnitInfoDTO {

    private Long unitId;

    private String name;
}
