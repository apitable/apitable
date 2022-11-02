package com.vikadata.api.modular.social.model;

import java.util.List;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

/**
 * OneAccess UserSchema  define vo
 */
@Data
@ApiModel("OneAccess UserSchema  define vo")
public class OneAccessUserSchemaVo{

    @ApiModelProperty(value = "The request ID sent by the platform each time the interface is called", position = 1)
    private String bimRequestId;

    @ApiModelProperty(value = "system account", position = 2)
    private List<AttributeEntity> account;

    @ApiModelProperty(value = "System organization", position = 3)
    private List<AttributeEntity> organization;

    public OneAccessUserSchemaVo(String bimRequestId) {
        this.bimRequestId = bimRequestId;
    }

    @Builder(toBuilder = true)
    @Setter
    @Getter
    public static class AttributeEntity {

        @ApiModelProperty(value = "Is it multi-valued", example = "false", position = 1)
        private boolean multivalued;

        @ApiModelProperty(value = "attribute field name", example = "uid", position = 2)
        private String name;

        @ApiModelProperty(value = "required", example = "false", position = 3)
        private boolean required;

        // Optional values are String, int, double, float, long, byte, boolean. The field is of type String。
        @ApiModelProperty(value = "Field Type", example = "false", position = 4)
        private String type;
    }
}
