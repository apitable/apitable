package com.vikadata.api.organization.enums;

import java.util.HashMap;
import java.util.Map;

import lombok.Getter;

import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.serializer.IBaseEnum;

import static com.vikadata.api.organization.enums.OrganizationException.DELETE_ACTION_ERROR;

@Getter
public enum DeleteMemberType implements IBaseEnum{

    /**
     * deleted from department
     */
    FROM_TEAM(0, "deleted from department"),

    /**
     * deleted from organization
     */
    FROM_SPACE(1, "deleted from organization");

    private final int value;

    private final String desc;

    private static Map<Integer, DeleteMemberType> valueMap = new HashMap<>(16);

    static {
        for(DeleteMemberType type : DeleteMemberType.values()) {
            valueMap.put(type.value, type);
        }
    }

    DeleteMemberType(int value, String desc) {
        this.value = value;
        this.desc = desc;
    }

    @Override
    public Integer getValue() {
        return this.value;
    }

    public String getDesc() {
        return this.desc;
    }

    public static DeleteMemberType getByValue(int value) {
        DeleteMemberType result = valueMap.get(value);
        if(result == null) {
            throw new BusinessException(DELETE_ACTION_ERROR);
        }
        return result;
    }
}
