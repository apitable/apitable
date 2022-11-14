package com.vikadata.api.workspace.ro;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Node share close notification request parameters
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NodeShareDisableNotifyRo {

    private String nodeId;

    private List<String> shareIds;
}
