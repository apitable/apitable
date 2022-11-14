package com.vikadata.api.space.model;

import io.swagger.annotations.ApiModel;
import lombok.Data;

import java.util.List;

@Data
@ApiModel("Space Member Resource")
public class SpaceMemberResourceDto {

	private Long memberId;

	private List<String> resources;
}
