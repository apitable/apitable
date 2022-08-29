package com.vikadata.scheduler.space.service;

/**
 * <p>
 * 数据清洗 服务接口
 * </p>
 *
 * @author Chambers
 * @date 2020/9/8
 */
public interface IDataProcessService {

    /**
     * 调整 V码剩余可使用次数
     *
     * @author Chambers
     * @date 2020/9/29
     */
    void changeRetainTimes();

    /**
     * 修改基础资源表数据
     *
     * @author Chambers
     * @date 2020/10/13
     */
    void updateAssetData();

    /**
     * 修改成员表数据
     *
     * @author Chambers
     * @date 2020/10/13
     */
    void updateMemberData();

    void controlDataInit();

    void controlCompensate();
}
