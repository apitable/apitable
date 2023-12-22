package com.apitable.asset.ro;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Data;

/**
 * asset url signature ro.
 */
@Data
@Schema(description = "Attachment resource url add signature RO")
public class AssetUrlSignatureRo {
    @Schema(description = "List of resource names", example = "[\"spc10/2019/12/10/159\", "
        + "\"spc10/2019/12/10/168\"]")
    private List<String> resourceKeys;
}
