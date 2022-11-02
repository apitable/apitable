package com.vikadata.api.modular.space.model;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class SpaceMenuResourceDto implements Serializable {

	private static final long serialVersionUID = 3010701075278742759L;

	private String menuCode;

	private List<String> resources;
}
