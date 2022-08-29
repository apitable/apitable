package com.vikadata.api.modular.workspace.model;

import com.vikadata.api.model.ro.datasheet.SnapshotMapRo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Vika Bundle data文件
 * </p>
 *
 * @author Chambers
 * @date 2020/5/9
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NodeDataFile {

    private String description;

    private SnapshotMapRo snapshot;
}
