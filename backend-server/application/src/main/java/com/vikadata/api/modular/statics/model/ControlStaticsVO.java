package com.vikadata.api.modular.statics.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Permission Statistics Vo
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ControlStaticsVO {

    private Long nodeRoleCount;

    private Long fieldRoleCount;
}
