package com.vikadata.api.model.dto.datasheet;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

import javax.validation.constraints.NotNull;

/**
 * <p>
 * 数表变更集的Message dto
 * </p>
 *
 * @author Benson Cheung
 * @date 2020/04/01
 */
@Data
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder(toBuilder = true)
public class DataSheetChangesetMsgDto {

    @NotNull
    @ApiModelProperty(value = "数表ID", example = "dst2mVrm9YjN334Wnw", position = 1)
    private String datasheetId;

    @NotNull
    @ApiModelProperty(value = "传过来的版本号",example = "1", position = 2)
    private Long revision;

    @NotNull
    @ApiModelProperty(value = "changeset请求的唯一标识，用于保证changeset的唯一",example = "123", position = 3)
    private String messageId;
}
