package com.vikadata.integration.vika.model;

/**
 * <p>
 * 积分奖励信息
 * </p>
 *
 * @author Chambers
 * @date 2022/6/24
 */
public class IntegralRewardInfo {

    private String recordId;

    private String areaCode;

    private String target;

    private Integer count;

    private String activityName;

    public IntegralRewardInfo() {
    }

    public String getRecordId() {
        return recordId;
    }

    public void setRecordId(String recordId) {
        this.recordId = recordId;
    }

    public String getAreaCode() {
        return areaCode;
    }

    public void setAreaCode(String areaCode) {
        this.areaCode = areaCode;
    }

    public String getTarget() {
        return target;
    }

    public void setTarget(String target) {
        this.target = target;
    }

    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }

    public String getActivityName() {
        return activityName;
    }

    public void setActivityName(String activityName) {
        this.activityName = activityName;
    }
}
