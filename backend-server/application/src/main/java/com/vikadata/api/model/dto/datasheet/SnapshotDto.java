package com.vikadata.api.model.dto.datasheet;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.api.model.ro.datasheet.SnapshotMapRo;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SnapshotDto {

    private String dstId;

    private SnapshotMapRo snapshot;
}
