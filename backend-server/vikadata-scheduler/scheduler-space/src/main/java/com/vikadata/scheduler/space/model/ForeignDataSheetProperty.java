package com.vikadata.scheduler.space.model;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * <p>
 * 神奇关联数表属性
 * </p>
 *
 * @author Pengap
 * @date 2022/2/7 14:41:57
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = { "property" })
public class ForeignDataSheetProperty {

    private String dstId;

    @JsonAlias("id")
    private String fieldId;

    @JsonAlias("name")
    private String fieldName;

    private Property property;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @EqualsAndHashCode(of = { "brotherFieldId", "foreignDatasheetId" })
    public static class Property {

        private String brotherFieldId;

        private String foreignDatasheetId;

    }
}
