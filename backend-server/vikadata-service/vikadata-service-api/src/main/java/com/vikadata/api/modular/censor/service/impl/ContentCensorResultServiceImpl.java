package com.vikadata.api.modular.censor.service.impl;

import javax.annotation.Resource;

import cn.hutool.core.util.ObjectUtil;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.context.SessionContext;
import com.vikadata.api.model.ro.censor.ContentCensorReportRo;
import com.vikadata.api.model.vo.censor.ContentCensorResultVo;
import com.vikadata.api.modular.censor.mapper.ContentCensorReportMapper;
import com.vikadata.api.modular.censor.mapper.ContentCensorResultMapper;
import com.vikadata.api.modular.censor.service.IContentCensorResultService;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.api.modular.workspace.service.INodeShareService;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.ContentCensorReportEntity;
import com.vikadata.entity.ContentCensorResultEntity;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.enums.exception.DatabaseException.EDIT_ERROR;
import static com.vikadata.api.enums.exception.DatabaseException.INSERT_ERROR;
import static com.vikadata.api.enums.exception.DatabaseException.QUERY_EMPTY_BY_ID;
import static com.vikadata.api.enums.exception.UserException.DING_USER_UNKNOWN;

/**
 * <p>
 * 内容审核-举报记录表 服务实现类
 * </p>
 *
 * @author Benson Cheung
 * @since 2020-05-11
 */
@Service
@Slf4j
public class ContentCensorResultServiceImpl extends ServiceImpl<ContentCensorResultMapper, ContentCensorResultEntity> implements IContentCensorResultService {

    @Resource
    private ContentCensorResultMapper censorResultMapper;

    @Resource
    private ContentCensorReportMapper censorReportMapper;

    @Resource
    private INodeShareService nodeShareService;

    @Resource
    private INodeService nodeService;

    @Override
    public IPage<ContentCensorResultVo> readReports(Integer status,Page page) {
        log.info("查询举报信息列表");
        IPage<ContentCensorResultVo> censorReportList = censorResultMapper.getPageByStatus(status, page);
        ExceptionUtil.isNotEmpty(censorReportList.getRecords(), QUERY_EMPTY_BY_ID);
        return censorReportList;
    }

    @Override
    public void createReports(ContentCensorReportRo censorReportRo) {
        log.info("提交举报信息");
        String nodeId = censorReportRo.getNodeId();
        ContentCensorResultEntity resultEntity = censorResultMapper.getByNodeId(nodeId);
        //校验节点是否公开可访问
        nodeShareService.checkNodeHasShare(nodeId);
        //已被举报过的节点处理逻辑
        if(ObjectUtil.isNotNull(resultEntity)){
            //累加被举报次数，更新审核信息，状态为待处理
            resultEntity.setReportNum(resultEntity.getReportNum()+1);
            resultEntity.setReportResult(0);
            boolean flag = SqlHelper.retBool(censorResultMapper.updateById(resultEntity));
            ExceptionUtil.isTrue(flag, EDIT_ERROR);
        }else{
            //查询节点是否存在被举报过
            resultEntity = ContentCensorResultEntity.builder()
                .nodeId(nodeId)
                .reportNum(1L)
                .build();
            //新增待处理的审核信息
            boolean flag = SqlHelper.retBool(censorResultMapper.insert(resultEntity));
            ExceptionUtil.isTrue(flag, INSERT_ERROR);
        }
        //新增举报记录
        ContentCensorReportEntity reportEntity = ContentCensorReportEntity.builder()
            .nodeId(censorReportRo.getNodeId())
            .reportReason(censorReportRo.getReportReason())
            .build();
        boolean flag = SqlHelper.retBool(censorReportMapper.insert(reportEntity));
        ExceptionUtil.isTrue(flag, INSERT_ERROR);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateReports(String nodeId, Integer status) {
        log.info("钉钉群处理举报信息");
        //查询session中的钉钉会员信息
        String auditorUserId = SessionContext.getDingtalkUserId();
        String auditorName = SessionContext.getDingtalkUserName();
        ExceptionUtil.isNotNull(auditorUserId, DING_USER_UNKNOWN);
        //查询节点是否存在
        ContentCensorResultEntity resultEntity = censorResultMapper.getByNodeId(nodeId);
        ExceptionUtil.isNotNull(resultEntity, QUERY_EMPTY_BY_ID);
        //更新审核结果
        if(ObjectUtil.isNotNull(resultEntity)){
            resultEntity.setReportResult(status);
            resultEntity.setAuditorDtName(auditorUserId);
            resultEntity.setAuditorDtUserId(auditorName);
            boolean flag = SqlHelper.retBool(censorResultMapper.updateById(resultEntity));
            ExceptionUtil.isTrue(flag, EDIT_ERROR);
        }
        if(status == 2){
            status = 0;
        }
        //若封禁，禁用节点不可访问
        //若解封，节点回复正常
        nodeService.updateNodeBanStatus(nodeId, status);
    }

}
