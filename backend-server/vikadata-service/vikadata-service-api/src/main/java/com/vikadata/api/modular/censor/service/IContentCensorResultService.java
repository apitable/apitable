package com.vikadata.api.modular.censor.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.model.ro.censor.ContentCensorReportRo;
import com.vikadata.api.model.vo.censor.ContentCensorResultVo;
import com.vikadata.entity.ContentCensorResultEntity;

/**
 * <p>
 * 内容审核-举报记录表 服务类
 * </p>
 *
 * @author Benson Cheung
 * @since 2020-05-11
 */
public interface IContentCensorResultService extends IService<ContentCensorResultEntity> {


    /**
     * 根据条件查询举报信息列表
     *
     * @return  IPage<ContentCensorResultVo> 分页处理结果
     * @param page 分页参数
     * @param status 处理结果，0 未处理，1 封禁，2 正常（解封）
     * @author Benson Cheung
     * @date 2020/5/11
     */
    IPage<ContentCensorResultVo> readReports(Integer status,Page page);

    /**
     * 提交举报信息
     * @param censorReportRo 举报信息
     * @author Benson Cheung
     * @date 2020/5/11
     */
    void createReports(ContentCensorReportRo censorReportRo);

    /**
     * 钉钉群处理举报信息
     *
     * @param nodeId 节点ID
     * @param status 处理结果，0 未处理，1 封禁，2 正常（解封）
     * @author Benson Cheung
     * @date 2020/5/11
     */
    void updateReports(String nodeId, Integer status);
}
