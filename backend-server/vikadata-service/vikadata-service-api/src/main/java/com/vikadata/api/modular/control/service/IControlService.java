package com.vikadata.api.modular.control.service;

import java.util.List;
import java.util.function.Consumer;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.control.ControlType;
import com.vikadata.entity.ControlEntity;

/**
 *
 * @author Shawn Deng
 * @date 2021-04-01 19:35:52
 */
public interface IControlService extends IService<ControlEntity> {

    /**
     * 查询控制单元
     * @param controlId 控制单元ID
     * @return ControlEntity
     * @author Shawn Deng
     * @date 2021/6/9 17:23
     */
    ControlEntity getByControlId(String controlId);

    /**
     * 检查权限控制单元状态
     *
     * @param controlId 控制单元ID
     * @param consumer  自定义 consumer
     * @author Chambers
     * @date 2021/4/22
     */
    void checkControlStatus(String controlId, Consumer<Boolean> consumer);

    /**
     * 创建权限控制单元
     *
     * @param userId        用户ID
     * @param spaceId       空间ID
     * @param controlId     控制单元ID
     * @param controlType   控制单元类型
     * @author Chambers
     * @date 2021/4/27
     */
    void create(Long userId, String spaceId, String controlId, ControlType controlType);

    /**
     * 删除控制单元相关信息
     *
     * @param controlIds 控制单元ID 集合
     * @param delSetting 删除控制单元设置
     * @author Chambers
     * @date 2021/4/27
     */
    void removeControl(Long userId, List<String> controlIds, boolean delSetting);

    /**
     * 获取权限控制单元ID
     *
     * @param prefix    控制单元ID 前缀
     * @param type      控制单元类型
     * @return 控制单元ID
     * @author Chambers
     * @date 2021/4/14
     */
    List<String> getControlIdByControlIdPrefixAndType(String prefix, Integer type);

    /**
     * 获取存在的控制单元ID
     *
     * @param controlIds 控制单元ID 集合
     * @return 控制单元ID
     * @author Chambers
     * @date 2021/4/30
     */
    List<String> getExistedControlId(List<String> controlIds);

    /**
     * 获取权限控制单元创建者的成员ID
     *
     * @param controlId 控制单元ID
     * @return memberId
     * @author Chambers
     * @date 2021/6/7
     */
    Long getOwnerMemberId(String controlId);
}
