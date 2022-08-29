package com.vikadata.api.modular.workspace.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Vika Bundle Manifest
 * </p>
 *
 * @author Chambers
 * @date 2020/4/28
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class Manifest {

    /**
     * 版本
     */
    private String version;

    /**
     * 加密模式，password/null/...
     */
    private String encryption;

    /**
     * 密码
     */
    private String password;

    /**
     * 文件树的根节点
     */
    private NodeFileTree root;
}
