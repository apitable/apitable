package com.vikadata.aider.service;

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
     * control 数据迁移
     *
     * @author Chambers
     * @date 2021/12/3
     */
    void controlProcess();

    /**
     * 修复 211202 - 220124 期间，引用模板/导入多sheetExcel 后子文件的创建信息为空的数据问题
     *
     * @author Chambers
     * @date 2022/1/28
     */
    void nodeCreated();

    /**
     * 镜像小程序支持，所需要的数据处理
     *
     * @author Chambers
     * @date 2022/1/28
     */
    void mirrorWidget();
}
