package com.vikadata.api.modular.workspace.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.vikadata.entity.NodeResourceEntity;
import com.vikadata.api.modular.workspace.mapper.NodeResourceMapper;
import com.vikadata.api.modular.workspace.service.INodeResourceService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 工作台-节点-资源表 服务实现类
 * </p>
 *
 * @author Shawn Deng
 * @since 2020-02-18
 */
@Service
@Slf4j
public class NodeResourceServiceImpl extends ServiceImpl<NodeResourceMapper, NodeResourceEntity> implements INodeResourceService {

}
