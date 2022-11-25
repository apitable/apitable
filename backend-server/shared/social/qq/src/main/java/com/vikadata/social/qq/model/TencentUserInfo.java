package com.vikadata.social.qq.model;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * QQ user info
 */
public class TencentUserInfo extends BaseResponse {

    private String nickname;

    private String gender;

    private Integer genderType;

    private String province;

    private String city;

    private String year;

    private String constellation;

    @JsonProperty("figureurl")
    private String figureUrl;

    @JsonProperty("figureurl_1")
    private String figureUrl1;

    @JsonProperty("figureurl_2")
    private String figureUrl2;

    @JsonProperty("figureurl_qq_1")
    private String figureurlQq1;

    @JsonProperty("figureurl_qq_2")
    private String figureurlQq2;

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Integer getGenderType() {
        return genderType;
    }

    public void setGenderType(Integer genderType) {
        this.genderType = genderType;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getConstellation() {
        return constellation;
    }

    public void setConstellation(String constellation) {
        this.constellation = constellation;
    }

    public String getFigureUrl() {
        return figureUrl;
    }

    public void setFigureUrl(String figureUrl) {
        this.figureUrl = figureUrl;
    }

    public String getFigureUrl1() {
        return figureUrl1;
    }

    public void setFigureUrl1(String figureUrl1) {
        this.figureUrl1 = figureUrl1;
    }

    public String getFigureUrl2() {
        return figureUrl2;
    }

    public void setFigureUrl2(String figureUrl2) {
        this.figureUrl2 = figureUrl2;
    }

    public String getFigureurlQq1() {
        return figureurlQq1;
    }

    public void setFigureurlQq1(String figureurlQq1) {
        this.figureurlQq1 = figureurlQq1;
    }

    public String getFigureurlQq2() {
        return figureurlQq2;
    }

    public void setFigureurlQq2(String figureurlQq2) {
        this.figureurlQq2 = figureurlQq2;
    }
}
