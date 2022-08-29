package com.vikadata.api.modular.statics.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 权限统计视图
 * @author Shawn Deng
 * @date 2021-09-01 23:03:48
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ControlStaticsVO {

    private Long nodeRoleCount;

    private Long fieldRoleCount;
}
