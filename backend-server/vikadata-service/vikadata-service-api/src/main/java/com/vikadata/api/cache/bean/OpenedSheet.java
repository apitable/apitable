package com.vikadata.api.cache.bean;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * datasheet opened by the user in the current space
 *
 * @author Chambers
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class OpenedSheet {

    private String nodeId;

    private String viewId;

    private Integer position;
}
