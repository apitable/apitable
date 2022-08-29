package com.vikadata.api.cache.bean;

import lombok.Data;

import java.io.Serializable;
import java.util.Set;

/**
 * <p>
 * 用户在空间内的对应节点权限
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/2/20 20:12
 */
@Data
public class UserSpaceNodeDto implements Serializable {

	private static final long serialVersionUID = 8729125843593180172L;

	private String nodeId;

	private String nodeName;

	private String parentNodeId;

	private String roleCode;

	private Set<String> resourcesCodes;
}
