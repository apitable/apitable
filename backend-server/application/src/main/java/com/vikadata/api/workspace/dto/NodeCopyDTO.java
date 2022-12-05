package com.vikadata.api.workspace.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.api.workspace.ro.MetaMapRo;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NodeCopyDTO {

    private MetaMapRo metaMapRo;

    private List<String> delFieldIds;

    private List<String> autoNumberFieldIds;

    private List<String> linkFieldIds;
}
