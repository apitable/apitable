package com.vikadata.api.model.ro.widget;

import java.util.Locale;
import java.util.Optional;

import javax.validation.constraints.Email;
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

import org.springframework.web.multipart.MultipartFile;

/**
 * <p>
 * Widget package basic request parameters
 * </p>
 */
@Data
@ApiModel("Widget package basic request parameters")
public class WidgetPackageBaseRo {

    @ApiModelProperty(value = "Icon", position = 6)
    private MultipartFile icon;

    @ApiModelProperty(value = "Cover", position = 7)
    private MultipartFile cover;

    @ApiModelProperty(value = "Author Name", position = 8)
    private String authorName;

    @ApiModelProperty(value = "Author icon", position = 9)
    private MultipartFile authorIcon;

    @ApiModelProperty(value = "Author Email", position = 9)
    @Email(message = "Author email format error")
    private String authorEmail;

    @ApiModelProperty(value = "Author website address", position = 10)
    @Pattern(regexp = PatternConstants.URL_HTTP, message = "Author website address format error")
    private String authorLink;

    @ApiModelProperty(value = "Applet Description", example = "{'zh-CN':'中','en-US':'英'}", position = 11)
    private String description;

    @ApiModelProperty(value = "Release code address", position = 12)
    private MultipartFile releaseCodeBundle;

    @ApiModelProperty(value = "Publish source code address", position = 13)
    private MultipartFile sourceCodeBundle;

    @ApiModelProperty(value = "Publish source code encryption key", position = 14)
    private String secretKey;

    @Data
    public static class I18nField {

        @ApiModelProperty(value = "Chinese", position = 1)
        @JsonProperty("zh-CN")
        @JsonInclude(Include.NON_EMPTY)
        private String zhCN;

        @ApiModelProperty(value = "English", position = 2)
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
            // Returns according to the language. If zh string is empty, en string is returned by default
            return Optional.ofNullable(Locale.US.toLanguageTag().equals(lang) ? getEnUS() : getZhCN())
                    .orElse(getEnUS());
        }

    }

}
