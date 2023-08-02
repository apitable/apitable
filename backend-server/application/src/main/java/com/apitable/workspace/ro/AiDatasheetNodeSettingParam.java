package com.apitable.workspace.ro;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * AI datasheet node setting params.
 *
 * @author Shawn Deng
 */
@Data
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
public class AiDatasheetNodeSettingParam implements AiDatasourceParamInterface {

    private String id;

    private String viewId;
}
