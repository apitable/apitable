package com.vikadata.api.modular.finance.model;

import java.time.LocalDate;

import lombok.Data;

@Data
public class SpaceSubscriptionVo {

    private String spaceId;

    private String product;

    private int seats;

    private LocalDate startDate;

    private LocalDate endDate;
}
