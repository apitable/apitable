package com.vikadata.api.modular.workspace.model;

import com.vikadata.api.model.ro.datasheet.SnapshotMapRo;
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
