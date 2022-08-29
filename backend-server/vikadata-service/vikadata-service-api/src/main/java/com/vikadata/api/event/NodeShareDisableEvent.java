package com.vikadata.api.event;

import java.util.List;

import org.springframework.context.ApplicationEvent;

/**
 * <p>
 * 节点分享关闭事件
 * </p>
 *
 * @author Chambers
 * @date 2021/3/3
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
