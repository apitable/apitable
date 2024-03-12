/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.widget.ro;

import com.apitable.shared.constants.PatternConstants;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import java.util.Locale;
import java.util.Optional;
import lombok.Data;

/**
 * <p>
 * widget package based information.
 * </p>
 */
@Data
@Schema(description = "widget package request based information")
public class WidgetPackageBaseV2Ro {

    @Schema(description = "icon file token")
    private String iconToken;

    @Schema(description = "cover file token")
    private String coverToken;

    @Schema(description = "author")
    private String authorName;

    @Schema(description = "author icon file token")
    private String authorIconToken;

    @Schema(description = "author email")
    @Email(message = "Author email format error")
    private String authorEmail;

    @Schema(description = "author website")
    @Pattern(regexp = PatternConstants.URL_HTTP,
        message = "Author website address format error")
    private String authorLink;

    @Schema(description = "widget description",
        example = "{'zh-CN':'Chinese','en-US':'English'}")
    private String description;

    @Schema(description = "release code link")
    private String releaseCodeBundleToken;

    @Schema(description = "source code link")
    private String sourceCodeBundleToken;

    @Schema(description = "the source code's secret key")
    private String secretKey;

    @Schema(description = "widget package's id", example = "wpkAAA")
    @NotBlank(message = "Widget package id not blank")
    private String packageId;

    @Schema(description = "version", example = "1.0.0")
    @NotBlank(message = "Release version no blank")
    private String version;

    /**
     * I18nField.
     */
    @Data
    public static class I18nField {

        @Schema(description = "Chinese")
        @JsonProperty("zh-CN")
        @JsonInclude(Include.NON_EMPTY)
        private String zhCN;

        @Schema(description = "english")
        @JsonProperty(value = "en-US")
        private String enUS;

        @Override
        public String toString() {
            return "{" + "zhCN='" + zhCN + '\'' + ", enUS='" + enUS + '\'' + '}';
        }

        public String toJson() throws JsonProcessingException {
            return new ObjectMapper().writeValueAsString(this);
        }

        public static I18nField toBean(String json) throws JsonProcessingException {
            return new ObjectMapper().readValue(json, I18nField.class);
        }

        /**
         * getString.
         */
        public String getString(String lang) {
            // depending on the language, en String is returned by default if zh string is empty
            return Optional.ofNullable(
                    Locale.US.toLanguageTag().equals(lang) ? getEnUS() : getZhCN())
                .orElse(getEnUS());
        }

    }

}