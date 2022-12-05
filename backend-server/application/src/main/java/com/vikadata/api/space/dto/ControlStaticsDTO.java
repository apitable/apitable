package com.vikadata.api.space.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Permission Statistics Vo
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ControlStaticsDTO {

    private Long nodeRoleCount;

    private Long fieldRoleCount;
}
