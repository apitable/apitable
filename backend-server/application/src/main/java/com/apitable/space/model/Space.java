package com.apitable.space.model;

import lombok.Data;

/**
 * space object.
 *
 * @author Shawn Deng
 */
@Data
public class Space {

    private String id;

    private String rootNodeId;

    public Space(String id, String rootNodeId) {
        this.id = id;
        this.rootNodeId = rootNodeId;
    }
}
