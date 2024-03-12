package com.apitable.asset.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * asset url signature vo.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Attachment resource url add signature")
public class AssetUrlSignatureVo {
    @Schema(description = "File Access Path(possibly non-final value)",
        example = "space/2023/03/07/8195212453744848953f87c54dc0369b")
    private String resourceKey;
    @Schema(description = "Path after signature",
        example = "https://aitable.ai/space/2023/03/07/8195212453744848953f87c54dc0369b"
            + "?sign=6bede194fb458c876676139f469b5576&t=64d4bb25")
    private String url;
}
