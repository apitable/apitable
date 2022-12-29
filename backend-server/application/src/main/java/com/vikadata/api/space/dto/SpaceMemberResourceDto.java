package com.vikadata.api.space.dto;

import java.util.List;

import lombok.Data;

@Data
public class SpaceMemberResourceDto {

	private Long memberId;

	private List<String> resources;
}
