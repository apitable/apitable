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

package com.apitable.workspace.ro;

import cn.hutool.core.util.StrUtil;
import com.apitable.shared.sysconfig.i18n.I18nStringsUtil;
import com.apitable.workspace.enums.NodeType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Node Request Parameters.
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Node Request Parameters")
public class NodeOpRo {

    @Schema(description = "Parent Node Id", example = "nod10", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "The parent node ID cannot be empty")
    private String parentId;

    @Schema(description = "Name", example = "This is a node")
    @Size(max = 100, message = "The name length cannot exceed 100 bits")
    private String nodeName;

    @Schema(description = "Type. 1: folder; 2: DataSheet; 3: Form; 4: Dashboard; 5: Mirror, 10: Automation, 12: embed page, ", example = "1", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "Type cannot be empty")
    @Min(value = 1, message = "Error in type")
    @Max(value = 12, message = "Error in type")
    private Integer type;

    @Schema(description = "The previous node of the target position moves to the first position "
        + "when it is empty", example = "nod10")
    private String preNodeId;

    @Schema(description = "Other information")
    private NodeRelRo extra;

    @Schema(description = "Whether to detect duplicate node names", example = "true")
    private Boolean checkDuplicateName;

    @Schema(description = "unit id", example = "1234567")
    private String unitId;

    /**
     * Get Node Name.
     */
    public String getNodeName() {
        if (StrUtil.isNotBlank(nodeName)) {
            return nodeName;
        }
        NodeType nodeType = NodeType.toEnum(type);
        return switch (nodeType) { // The name of the magic form is transmitted from the front end
            case FOLDER, DATASHEET, FORM, DASHBOARD, MIRROR, AI_CHAT_BOT, AUTOMATION, CUSTOM_PAGE ->
                // The image name is transmitted from the front end
                // default_create_'key' Configure in the strings table
                I18nStringsUtil.t("default_create_" + nodeType.name().toLowerCase());
            default -> I18nStringsUtil.t("default_create_file");
        };
    }

    /**
     * create an AI ChatBot object param.
     */
    @Data
    @Builder(toBuilder = true)
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AiChatBotCreateParam {

        private List<AiDatasheetNodeSettingParam> datasheet;
    }
}
