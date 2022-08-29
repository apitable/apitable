package com.vikadata.api.enums.datasheet;

/**
 * <p>
 * 单元格类型
 * </p>
 *
 * @author Benson Cheung
 * @date 2019-09-17 00:26
 */
public enum SegmentType {
    /**
     * 不支持该类型
     */
    NOT_SUPPORT(0),

    /**
     * 文本
     */
    TEXT(1);

    private int segmentType;

    SegmentType(int segmentType) {
        this.segmentType = segmentType;
    }

    public int getSegmentType() {
        return segmentType;
    }

    public void setSegmentType(int segmentType) {
        this.segmentType = segmentType;
    }


}
