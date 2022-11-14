package com.vikadata.api.enterprise.control.service;

import java.util.List;
import java.util.function.Consumer;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.enterprise.control.infrastructure.ControlType;
import com.vikadata.entity.ControlEntity;

/**
 * Control service
 */
public interface IControlService extends IService<ControlEntity> {

    /**
     * Query control unit
     *
     * @param controlId Control unit ID
     * @return ControlEntity
     */
    ControlEntity getByControlId(String controlId);

    /**
     * Check the status of authority control unit
     *
     * @param controlId Control unit ID
     * @param consumer  Custom consumer
     */
    void checkControlStatus(String controlId, Consumer<Boolean> consumer);

    /**
     * Create permission control unit
     *
     * @param userId        User ID
     * @param spaceId       Space ID
     * @param controlId     Control unit ID
     * @param controlType   Control unit type
     */
    void create(Long userId, String spaceId, String controlId, ControlType controlType);

    /**
     * Delete information about the control unit
     *
     * @param controlIds Control unit ID set
     * @param delSetting Deleting control unit settings
     */
    void removeControl(Long userId, List<String> controlIds, boolean delSetting);

    /**
     * Get the permission control unit ID
     *
     * @param prefix    Control unit ID prefix
     * @param type      Control unit type
     * @return Control unit ID
     */
    List<String> getControlIdByControlIdPrefixAndType(String prefix, Integer type);

    /**
     * Get the existing control unit ID
     *
     * @param controlIds Control unit ID set
     * @return Control unit ID
     */
    List<String> getExistedControlId(List<String> controlIds);

    /**
     * Get the member ID of the authority control unit creator
     *
     * @param controlId Control unit ID
     * @return memberId
     */
    Long getOwnerMemberId(String controlId);
}
