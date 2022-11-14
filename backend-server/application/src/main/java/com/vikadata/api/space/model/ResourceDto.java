package com.vikadata.api.space.model;

import io.swagger.annotations.ApiModel;
import lombok.Data;

import java.io.Serializable;

@Data
@ApiModel("Resource")
public class ResourceDto implements Serializable {

	private static final long serialVersionUID = 4874925997491297053L;

	private String resourceCode;

	private String resourceName;

	private String resourceDesc;
}
