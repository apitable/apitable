package com.vikadata.social.dingtalk.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * media file type
 */
@Getter
@AllArgsConstructor
public enum DingTalkMediaType {

    /**
     * Pictures, pictures up to 1 MB. Support uploading jpg, gif, png, bmp formats
     */
    IMAGE("image"),

    /**
     * Voice, voice files up to 2 MB. Support uploading amr, mp 3, wav formats
     */
    VOICE("voice"),

    /**
     * Video, video up to 10 MB. Support upload mp 4 format
     */
    VIDEO("video"),
    /**
     * Normal files, up to 10 MB. Support uploading doc, docx, xls, xlsx, ppt, pptx, zip, pdf, rar formats
     */
    FILE("file");

    private final String value;

    public String getValue() {
        return this.value;
    }

    public static DingTalkMediaType of(String value) {
        for (DingTalkMediaType dingTalkMediaType : DingTalkMediaType.values()) {
            if (dingTalkMediaType.value.equals(value)) {
                return dingTalkMediaType;
            }
        }
        throw new IllegalStateException("Unknown media file type");
    }
}
