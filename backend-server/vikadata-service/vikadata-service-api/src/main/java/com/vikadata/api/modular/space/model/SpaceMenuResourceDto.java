package com.vikadata.api.modular.space.model;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * <p>
 * 空间管理资源：菜单对应操作资源
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/2/14 15:50
 */
@Data
public class SpaceMenuResourceDto implements Serializable {

	private static final long serialVersionUID = 3010701075278742759L;

	private String menuCode;

	private List<String> resources;
}
