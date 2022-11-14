package com.vikadata.api.shared.listener.event;

import java.util.List;

import org.springframework.context.ApplicationEvent;

/**
 * <p>
 * Shared Node Disable Event
 * </p>
 *
 * @author Chambers
 */
public class NodeShareDisableEvent extends ApplicationEvent {

    private static final long serialVersionUID = -5990736999758248187L;

    private final List<String> nodeIds;

    public NodeShareDisableEvent(Object source, List<String> nodeIds) {
        super(source);
        this.nodeIds = nodeIds;
    }

    public List<String> getNodeIds() {
        return nodeIds;
    }
}
