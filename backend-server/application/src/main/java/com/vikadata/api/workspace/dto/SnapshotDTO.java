package com.vikadata.api.workspace.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.api.workspace.ro.SnapshotMapRo;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SnapshotDTO {

    private String dstId;

    private SnapshotMapRo snapshot;
}
