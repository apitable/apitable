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

    @JsonInclude(Include.NON_NULL)
    private DataArchive issuedIdArchive;

    @JsonInclude(Include.NON_NULL)
    private DataArchive auditSubmitResultArchive;

    @JsonInclude(Include.NON_EMPTY)
    private String fatherWidgetId;

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
