package com.vikadata.api.model.ro.node;

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
