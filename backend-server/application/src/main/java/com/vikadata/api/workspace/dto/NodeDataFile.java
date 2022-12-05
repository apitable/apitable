package com.vikadata.api.workspace.dto;

import com.vikadata.api.workspace.ro.SnapshotMapRo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Vika Bundle data file
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NodeDataFile {

    private String description;

    private SnapshotMapRo snapshot;
}
