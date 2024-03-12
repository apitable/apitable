package com.apitable.workspace.vo;

import com.apitable.organization.vo.MemberInfoVo;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * <p>
 * Node Collaborator View.
 * </p>
 *
 * @author Chambers
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "Node Collaborator View")
public class NodeCollaboratorVO extends MemberInfoVo {

    @Schema(description = "Role", example = "editor")
    private String role;
}
