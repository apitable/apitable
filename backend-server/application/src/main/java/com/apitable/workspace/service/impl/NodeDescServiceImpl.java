/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.workspace.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.ReUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.http.HtmlUtil;
import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.apitable.base.enums.DatabaseException;
import com.apitable.shared.constants.NodeDescConstants;
import com.apitable.workspace.dto.NodeDescDTO;
import com.apitable.workspace.dto.NodeDescParseDTO;
import com.apitable.workspace.mapper.NodeDescMapper;
import com.apitable.workspace.service.INodeDescService;
import com.apitable.workspace.enums.NodeException;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.workspace.entity.NodeDescEntity;

import org.springframework.stereotype.Service;

import static com.apitable.shared.constants.NodeDescConstants.DESC_JSON_DATA_IMAGE_URL_PREFIX;
import static com.apitable.shared.constants.NodeDescConstants.DESC_JSON_DATA_NEW_FOD_PREFIX;
import static com.apitable.shared.constants.NodeDescConstants.DESC_JSON_DATA_NEW_PREFIX;
import static com.apitable.shared.constants.NodeDescConstants.DESC_JSON_DATA_TEXT_CHILDREN_PREFIX;

@Slf4j
@Service
public class NodeDescServiceImpl extends ServiceImpl<NodeDescMapper, NodeDescEntity> implements INodeDescService {

    @Override
    public void edit(String nodeId, String desc) {
        log.info("edit node description");
        if (StrUtil.isEmpty(desc)) {
            baseMapper.updateDescByNodeId(nodeId, desc);
            return;
        }
        int byteLength = desc.getBytes().length;
        ExceptionUtil.isTrue(byteLength <= 65535, NodeException.DESCRIPTION_TOO_LONG);
        Long id = baseMapper.selectIdByNodeId(nodeId);
        NodeDescEntity nodeDescEntity = NodeDescEntity.builder().id(id).nodeId(nodeId).description(desc).build();
        boolean flag = this.saveOrUpdate(nodeDescEntity);
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
    }

    @Override
    public void copyBatch(Map<String, String> newNodeMap) {
        log.info("copy node description");
        if (MapUtil.isEmpty(newNodeMap)) {
            return;
        }
        List<NodeDescDTO> dtoList = baseMapper.selectByNodeIds(newNodeMap.keySet());
        if (CollUtil.isEmpty(dtoList)) {
            return;
        }
        List<NodeDescEntity> entities = new ArrayList<>(dtoList.size());
        for (NodeDescDTO dto : dtoList) {
            NodeDescEntity entity = NodeDescEntity.builder()
                    .id(IdWorker.getId())
                    .nodeId(newNodeMap.get(dto.getNodeId()))
                    .description(dto.getDescription())
                    .build();
            entities.add(entity);
        }
        boolean flag = SqlHelper.retBool(baseMapper.insertBatch(entities));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
    }

    @Override
    public Map<String, String> getNodeIdToDescMap(List<String> nodeIds) {
        log.info("obtain node and corresponding description");
        if (CollUtil.isNotEmpty(nodeIds)) {
            List<NodeDescDTO> dtoList = baseMapper.selectByNodeIds(nodeIds);
            return dtoList.stream().collect(Collectors.toMap(NodeDescDTO::getNodeId, NodeDescDTO::getDescription));
        }
        return null;
    }

    @Override
    public void insertBatch(List<NodeDescEntity> nodeDescList) {
        log.info("batch add node description");
        if (CollUtil.isNotEmpty(nodeDescList)) {
            boolean flag = SqlHelper.retBool(baseMapper.insertBatch(nodeDescList));
            ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
        }
    }

    /**
     * desc of parsing node
     *
     * @param destDstId node id
     * @return NodeDescParseDto
     */
    @Override
    public NodeDescParseDTO parseNodeDescByNodeId(String destDstId) {
        List<String> content = new ArrayList<>();
        List<String> imageUrl = new ArrayList<>();
        String nodeDesc = baseMapper.selectDescriptionByNodeId(destDstId);
        if (StrUtil.isNotBlank(nodeDesc)) {
            Object desc = JSONUtil.getByPath(JSONUtil.parse(nodeDesc), NodeDescConstants.DESC_JSON_DATA_PREFIX);
            // The description of compatible old data node and the description of datasheet json are not in the same format.
            JSONArray descJsonArray = ObjectUtil.isNotNull(desc) ? JSONUtil.parseArray(desc) : JSONUtil
                    .parseArray(JSONUtil.getByPath(JSONUtil.parse(nodeDesc), NodeDescConstants.DESC_JSON_RENDER_PREFIX));
            if (ObjectUtil.isNotEmpty(descJsonArray) && !CollUtil.hasNull(descJsonArray)) {
                for (Object o : descJsonArray) {
                    Object descText = JSONUtil.parse(o).getByPath(NodeDescConstants.DESC_JSON_DATA_TEXT_PREFIX);
                    if (descText instanceof String) {
                        String reStr = HtmlUtil.escape(
                                ReUtil.replaceAll(descText.toString(), NodeDescConstants.DESC_JSON_DATA_ESCAPE_RE, " "));
                        if (StrUtil.isNotBlank(reStr)) {
                            content.add(reStr);
                        }
                    }
                    else {
                        // gets the label of the image
                        Object imageObj =
                                JSONUtil.parse(descText).getByPath(NodeDescConstants.DESC_JSON_DATA_IMAGE_PREFIX);
                        if (null != imageObj) {
                            imageUrl.add(imageObj.toString());
                        }
                    }
                }
            }
            else {
                // compatible with current data
                Object newDesc = JSONUtil.getByPath(JSONUtil.parseObj(nodeDesc), DESC_JSON_DATA_NEW_FOD_PREFIX);
                // compatible folder description
                if (ObjectUtil.isNull(newDesc)) {
                    newDesc = JSONUtil.getByPath(JSONUtil.parseObj(nodeDesc), DESC_JSON_DATA_NEW_PREFIX);
                }
                if (ObjectUtil.isNotNull(newDesc)) {
                    JSONArray descArray = JSONUtil.parseArray(newDesc);
                    if (!CollUtil.hasNull(descArray)) {
                        JSONArray textArray = JSONUtil.parseArray(descArray.getByPath(DESC_JSON_DATA_TEXT_CHILDREN_PREFIX));
                        JSONArray imageArray = JSONUtil.parseArray(descArray.getByPath(DESC_JSON_DATA_IMAGE_URL_PREFIX));
                        if (CollUtil.isNotEmpty(textArray)) {
                            for (Object text : textArray) {
                                JSONArray tmp = JSONUtil.parseArray(text);
                                String reStr = CollUtil.hasNull(tmp) ? ""
                                        : HtmlUtil.escape(ReUtil.replaceAll(StrUtil.join("", tmp), NodeDescConstants.DESC_JSON_DATA_ESCAPE_RE, " "));
                                if (StrUtil.isNotBlank(reStr)) {
                                    content.add(reStr);
                                }
                            }
                        }
                        if (CollUtil.isNotEmpty(imageArray)) {
                            for (Object url : imageArray) {
                                if (ObjectUtil.isNotNull(url)) {
                                    imageUrl.add(url.toString());
                                }
                            }
                        }
                    }
                }
            }
        }
        return NodeDescParseDTO.builder().content(content).imageUrl(imageUrl).build();
    }
}
