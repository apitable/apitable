package com.vikadata.api.modular.space.model;

import lombok.Data;

import java.io.Serializable;

/**
 * <p>
 * 资源对象
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/2/12 23:15
 */
@Data
public class ResourceDto implements Serializable {

	private static final long serialVersionUID = 4874925997491297053L;

	/**
	 * 资源模块编码
	 */
	private String resourceCode;

	/**
	 * 资源模块名称
	 */
	private String resourceName;

	/**
	 * 资源模块描述
	 */
	private String resourceDesc;
}
