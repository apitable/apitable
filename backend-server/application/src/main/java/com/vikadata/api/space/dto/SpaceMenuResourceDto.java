package com.vikadata.api.space.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

@Data
public class SpaceMenuResourceDto implements Serializable {

	private static final long serialVersionUID = 3010701075278742759L;

	private String menuCode;

	private List<String> resources;
}
