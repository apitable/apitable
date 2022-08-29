package com.vikadata.api.modular.space.model;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * <p>
 * 空间管理资源：分组资源
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/2/14 15:50
 */
@Data
public class SpaceGroupResourceDto implements Serializable {

	private static final long serialVersionUID = 3010701075278742759L;

	private String groupCode;

	private String groupName;

	private String groupDesc;

	private List<String> resources;
}
