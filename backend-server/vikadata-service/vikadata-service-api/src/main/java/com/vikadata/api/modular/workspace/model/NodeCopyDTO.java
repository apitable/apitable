package com.vikadata.api.modular.workspace.model;

import com.vikadata.api.model.ro.datasheet.MetaMapRo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * <p>
 * 节点复制 DTO
 * </p>
 *
 * @author Chambers
 * @date 2021/1/20
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NodeCopyDTO {

    private MetaMapRo metaMapRo;

    private List<String> delFieldIds;

    private List<String> autoNumberFieldIds;

    private List<String> linkFieldIds;
}
