package com.vikadata.api.workspace.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Vika Bundle Manifest
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class Manifest {

    private String version;

    /**
     * encryption，password/null/...
     */
    private String encryption;

    private String password;

    /**
     * the root node of the file tree
     */
    private NodeFileTree root;
}
