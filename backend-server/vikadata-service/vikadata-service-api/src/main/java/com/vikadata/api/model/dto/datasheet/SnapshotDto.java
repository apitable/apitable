package com.vikadata.api.model.dto.datasheet;

import com.vikadata.api.model.ro.datasheet.SnapshotMapRo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Snapshot
 * </p>
 *
 * @author Chambers
 * @date 2020/4/30
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SnapshotDto {

    private String dstId;

    private SnapshotMapRo snapshot;
}
