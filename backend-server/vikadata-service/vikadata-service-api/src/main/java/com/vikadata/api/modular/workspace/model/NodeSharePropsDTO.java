package com.vikadata.api.modular.workspace.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NodeSharePropsDTO {

    /**
     * only share it with others
     */
    private Boolean onlyRead;

    /**
     * share with others for collaborative editing
     */
    private Boolean canBeEdited;

    /**
     * share with others save as a copy
     */
    private Boolean canBeStored;
}
