package com.vikadata.system.config.billing;

import java.util.List;

import lombok.Data;

/**
 * <p>
 * 订阅方案表
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/8/31 15:13
 */
@Data
public class Plan {

    private String id;

    private String description;

    private boolean online;

    private String product;

    private String productCategory;

    private boolean canTrial;

    private String channel;

    private int seats;

    private List<String> features;

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        Plan plan = (Plan) o;

        return getId().equals(plan.getId());
    }

    @Override
    public int hashCode() {
        return getId().hashCode();
    }
}
