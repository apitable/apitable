package com.vikadata.api.model.dto.widget;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

/**
 * <p>
 * 小程序扩展参数
 * </p>
 *
 * @author Pengap
 * @date 2022/3/8 21:07:37
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
@Builder(toBuilder = true)
@JsonIgnoreProperties(ignoreUnknown = true)
public class WidgetBodyDTO {

    @JsonInclude(Include.NON_EMPTY)
    private String widgetOpenSource;

    @JsonInclude(Include.NON_EMPTY)
    private String templateCover;

    @JsonInclude(Include.NON_EMPTY)
    private String website;

    /*
     * 签发全局小组件Id数据存档
     * 记录着审核操作的数表Id + 数表记录Id信息
     */
    @JsonInclude(Include.NON_NULL)
    private DataArchive issuedIdArchive;

    /*
     * submit结果数据存档
     * 记录着submit结果操作的数表Id + 数表记录Id信息
     */
    @JsonInclude(Include.NON_NULL)
    private DataArchive auditSubmitResultArchive;

    /*
     * 审核小程序归属父级小程序Id
     */
    @JsonInclude(Include.NON_EMPTY)
    private String fatherWidgetId;

    /*
     * 历史发布版本Id
     */
    @JsonInclude(Include.NON_EMPTY)
    private List<Long> historyReleaseVersion;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class DataArchive {

        private String dstId;

        private String recordId;

        private Long authOpUser;

    }

    public String toJson() throws JsonProcessingException {
        return new ObjectMapper().writeValueAsString(this);
    }

    public static WidgetBodyDTO toBean(String json) throws JsonProcessingException {
        return new ObjectMapper().readValue(json, WidgetBodyDTO.class);
    }

}
