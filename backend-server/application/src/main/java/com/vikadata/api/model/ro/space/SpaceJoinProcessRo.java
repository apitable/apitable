package com.vikadata.api.model.ro.space;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.vikadata.core.support.deserializer.StringToLongDeserializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * <p>
 * Request parameters for space joining application processing
 * </p>
 */
@Data
@ApiModel("Request parameters for space joining application processing")
public class SpaceJoinProcessRo {

    @ApiModelProperty(value = "Notification ID", dataType = "java.lang.String", required = true, example = "761263712638")
    @JsonDeserialize(using = StringToLongDeserializer.class)
    @NotNull(message = "Notification ID cannot be empty")
    private Long notifyId;

    @ApiModelProperty(value = "Agree or not", dataType = "java.lang.Boolean", required = true, example = "true")
    @NotNull(message = "Agree or not cannot be blank")
    private Boolean agree;
}
