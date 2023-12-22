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
import jakarta.validation.constraints.Pattern;
import java.util.Locale;
import java.util.Optional;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

/**
 * <p>
 * Widget package basic request parameters.
 * </p>
 */
@Data
@Schema(description = "Widget package basic request parameters")
public class WidgetPackageBaseRo {

    @Schema(description = "Icon")
    private MultipartFile icon;

    @Schema(description = "Cover")
    private MultipartFile cover;

    @Schema(description = "Author Name")
    private String authorName;

    @Schema(description = "Author icon")
    private MultipartFile authorIcon;

    @Schema(description = "Author Email")
    @Email(message = "Author email format error")
    private String authorEmail;

    @Schema(description = "Author website address")
    @Pattern(regexp = PatternConstants.URL_HTTP,
        message = "Author website address format error")
    private String authorLink;

    @Schema(description = "Applet Description", example = "{'zh-CN':'xx','en-US':'xx'}")
    private String description;

    @Schema(description = "Release code address")
    private MultipartFile releaseCodeBundle;

    @Schema(description = "Publish source code address")
    private MultipartFile sourceCodeBundle;

    @Schema(description = "Publish source code encryption key")
    private String secretKey;

    /**
     * I18nField.
     */
    @Data
    public static class I18nField {

        @Schema(description = "Chinese")
        @JsonProperty("zh-CN")
        @JsonInclude(Include.NON_EMPTY)
        private String zhCN;

        @Schema(description = "English")
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
            // Returns according to the language.
            // If zh string is empty, en string is returned by default
            return Optional.ofNullable(
                    Locale.US.toLanguageTag().equals(lang) ? getEnUS() : getZhCN())
                .orElse(getEnUS());
        }

    }

}
