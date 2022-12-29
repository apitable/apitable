package com.vikadata.api.space.dto;

import java.io.Serializable;
import java.util.List;

import io.swagger.annotations.ApiModel;
import lombok.Data;

@Data
@ApiModel("Space Resource Group")
public class SpaceGroupResourceDto implements Serializable {

	private static final long serialVersionUID = 3010701075278742759L;

	private String groupCode;

	private String groupName;

	private String groupDesc;

	private List<String> resources;
}
