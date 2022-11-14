package com.vikadata.api.workspace.ro;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Associated Field Properties
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class LinkFieldProperty {

	/**
	 * Associated number table ID
	 */
	private String foreignDatasheetId;

	/**
	 * Brother field ID of related number table
	 */
	private String brotherFieldId;

	/**
	 * Only records can be selected for the corresponding viewId
	 */
	private String limitToView;

	/**
	 * Whether to restrict the association of only one record
	 */
	private Boolean limitSingleRecord;
}
