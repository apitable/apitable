package com.vikadata.api.modular.space.model;

import lombok.Data;

import java.util.List;

/**
 * <p>
 * 空间管理资源：成员对应操作资源
 * </p>
 *
 * @author Chambers
 * @date 2020/3/25
 */
@Data
public class SpaceMemberResourceDto {

	private Long memberId;

	private List<String> resources;
}
