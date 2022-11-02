package com.vikadata.api.model.ro.widget;

import java.util.Locale;
import java.util.Optional;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.vikadata.api.constants.PatternConstants;

/**
 * <p>
 * widget package based information
 * </p>
 *
 * @author Pengap
 * @date 2021/7/8
 */
@Data
@ApiModel("widget package request based information")
public class WidgetPackageBaseV2Ro {

    @ApiModelProperty(value = "icon file token", position = 1)
    private String iconToken;

    @ApiModelProperty(value = "cover file token", position = 2)
    private String coverToken;

    @ApiModelProperty(value = "author", position = 3)
    private String authorName;

    @ApiModelProperty(value = "author icon file token", position = 4)
    private String authorIconToken;

    @ApiModelProperty(value = "author email", position = 5)
    @Email(message = "Author email format error")
    private String authorEmail;

    @ApiModelProperty(value = "author website", position = 6)
    @Pattern(regexp = PatternConstants.URL_HTTP, message = "Author website address format error")
    private String authorLink;

    @ApiModelProperty(value = "widget description", example = "{'zh-CN':'中','en-US':'english'}", position = 7)
    private String description;

    @ApiModelProperty(value = "release code link", position = 8)
    private String releaseCodeBundleToken;

    @ApiModelProperty(value = "source code link", position = 9)
    private String sourceCodeBundleToken;

    @ApiModelProperty(value = "the source code's secret key", position = 10)
    private String secretKey;

    @ApiModelProperty(value = "widget package's id", example = "wpkAAA", position = 11)
    @NotBlank(message = "Widget package id not blank")
    private String packageId;

    @ApiModelProperty(value = "version", example = "1.0.0", position = 12)
    @NotBlank(message = "Release version no blank")
    private String version;

    @Data
    public static class I18nField {

        @ApiModelProperty(value = "中文", position = 1)
        @JsonProperty("zh-CN")
        @JsonInclude(Include.NON_EMPTY)
        private String zhCN;

        @ApiModelProperty(value = "english", position = 2)
        @JsonProperty(value = "en-US")
        private String enUS;

        @Override
        public String toString() {
            return "{" +
                    "zhCN='" + zhCN + '\'' +
                    ", enUS='" + enUS + '\'' +
                    '}';
        }

        public String toJson() throws JsonProcessingException {
            return new ObjectMapper().writeValueAsString(this);
        }

        public static I18nField toBean(String json) throws JsonProcessingException {
            return new ObjectMapper().readValue(json, I18nField.class);
        }

        public String getString(String lang) {
            // depending on the language, en String is returned by default if zh string is empty
            return Optional.ofNullable(Locale.US.toLanguageTag().equals(lang) ? getEnUS() : getZhCN())
                    .orElse(getEnUS());
        }

    }

}