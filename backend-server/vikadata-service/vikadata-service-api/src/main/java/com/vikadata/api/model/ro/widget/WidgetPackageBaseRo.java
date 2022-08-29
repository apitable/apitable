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
 * 小程序包基础请求参数
 * </p>
 *
 * @author Pengap
 * @date 2021/7/8
 */
@Data
@ApiModel("小程序包基础请求参数")
public class WidgetPackageBaseRo {

    @ApiModelProperty(value = "图标", position = 6)
    private MultipartFile icon;

    @ApiModelProperty(value = "封面图", position = 7)
    private MultipartFile cover;

    @ApiModelProperty(value = "作者名", position = 8)
    private String authorName;

    @ApiModelProperty(value = "作者图标", position = 9)
    private MultipartFile authorIcon;

    @ApiModelProperty(value = "作者Email", position = 9)
    @Email(message = "Author email format error")
    private String authorEmail;

    @ApiModelProperty(value = "作者网站地址", position = 10)
    @Pattern(regexp = PatternConstants.URL_HTTP, message = "Author website address format error")
    private String authorLink;

    @ApiModelProperty(value = "小程序描述", example = "{'zh-CN':'中','en-US':'英'}", position = 11)
    private String description;

    @ApiModelProperty(value = "发布代码地址", position = 12)
    private MultipartFile releaseCodeBundle;

    @ApiModelProperty(value = "发布源代码地址", position = 13)
    private MultipartFile sourceCodeBundle;

    @ApiModelProperty(value = "发布源代码加密密钥", position = 14)
    private String secretKey;

    @Data
    public static class I18nField {

        @ApiModelProperty(value = "中文", position = 1)
        @JsonProperty("zh-CN")
        @JsonInclude(Include.NON_EMPTY)
        private String zhCN;

        @ApiModelProperty(value = "英文", position = 2)
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
            // 根据语言返回，如果zh string为空，默认返回en string
            return Optional.ofNullable(Locale.US.toLanguageTag().equals(lang) ? getEnUS() : getZhCN())
                    .orElse(getEnUS());
        }

    }

}
