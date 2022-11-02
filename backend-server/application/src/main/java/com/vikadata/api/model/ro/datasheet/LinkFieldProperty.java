package com.vikadata.api.model.ro.datasheet;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * 关联字段属性
 * </p>
 *
 * @author Chambers
 * @date 2020/3/17
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class LinkFieldProperty {

	/**
	 * 关联数表ID
	 */
	private String foreignDatasheetId;

	/**
	 * 关联数表兄弟字段ID
	 */
	private String brotherFieldId;

	/**
	 * 限制只在对应 viewId 可选 record
	 */
	private String limitToView;

	/**
	 * 是否限制只允许关联一条记录
	 */
	private Boolean limitSingleRecord;
}
