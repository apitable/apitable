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

import cn.hutool.core.codec.Base64;
import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.date.DatePattern;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.io.FileUtil;
import cn.hutool.core.io.IoUtil;
import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.crypto.digest.DigestAlgorithm;
import cn.hutool.crypto.digest.Digester;
import cn.hutool.json.JSONException;
import cn.hutool.json.JSONUtil;
import com.apitable.base.enums.ActionException;
import com.apitable.base.enums.ParameterException;
import com.apitable.core.exception.BusinessException;
import com.apitable.core.support.tree.DefaultTreeBuildFactory;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.shared.cache.service.UserSpaceCacheService;
import com.apitable.shared.security.PasswordService;
import com.apitable.shared.util.ExportUtil;
import com.apitable.shared.util.IdUtil;
import com.apitable.shared.util.RandomExtendUtil;
import com.apitable.space.dto.NodeAssetDTO;
import com.apitable.space.mapper.SpaceAssetMapper;
import com.apitable.space.service.ISpaceAssetService;
import com.apitable.workspace.dto.Manifest;
import com.apitable.workspace.dto.NodeDataFile;
import com.apitable.workspace.dto.NodeFileTree;
import com.apitable.workspace.entity.NodeDescEntity;
import com.apitable.workspace.entity.NodeEntity;
import com.apitable.workspace.enums.NodeType;
import com.apitable.workspace.enums.PermissionException;
import com.apitable.workspace.mapper.NodeMapper;
import com.apitable.workspace.ro.DataSheetCreateRo;
import com.apitable.workspace.ro.MetaMapRo;
import com.apitable.workspace.ro.SnapshotMapRo;
import com.apitable.workspace.service.IDatasheetService;
import com.apitable.workspace.service.INodeDescService;
import com.apitable.workspace.service.INodeService;
import com.apitable.workspace.service.NodeBundleService;
import com.apitable.workspace.vo.NodeShareTree;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import jakarta.annotation.Resource;
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

/**
 * node bundle service implement.
 */
@Slf4j
@Service
public class NodeBundleServiceImpl implements NodeBundleService {

    @Resource
    private INodeService iNodeService;

    @Resource
    private INodeDescService iNodeDescService;

    @Resource
    private NodeMapper nodeMapper;

    @Resource
    private IDatasheetService iDatasheetService;

    @Resource
    private ISpaceAssetService iSpaceAssetService;

    @Resource
    private SpaceAssetMapper spaceAssetMapper;

    @Resource
    private PasswordService passwordService;

    @Resource
    private UserSpaceCacheService userSpaceCacheService;

    private static final String MANIFEST = "manifest.json";

    private static final String DATA_DIR = "data";

    private static final String ASSET_DIR = "assets";

    @Override
    public void generate(String nodeId, boolean saveData, String password) {
        log.info("generate bundle file");
        // check whether the node exists
        NodeEntity node = nodeMapper.selectByNodeId(nodeId);
        ExceptionUtil.isNotNull(node, PermissionException.NODE_ACCESS_DENIED);
        // Create random temporary directories to avoid simultaneous use of the same node.
        String dir = RandomExtendUtil.randomString(6);
        Digester md5 = new Digester(DigestAlgorithm.MD5);
        List<File> files = new ArrayList<>();
        // traverse all nodes down
        List<String> nodeIds = CollUtil.newArrayList(nodeId);
        Map<String, String> nodeIdToFileNameMap = new HashMap<>();
        List<NodeShareTree> childrenList = new ArrayList<>();
        if (node.getType() < NodeType.DATASHEET.getNodeType()) {
            childrenList = iNodeService.getSubNodes(nodeId);
            if (CollUtil.isNotEmpty(childrenList)) {
                List<String> ids = childrenList.stream().map(NodeShareTree::getNodeId)
                    .collect(Collectors.toList());
                nodeIds.addAll(ids);
            }
        }
        // build resource files
        List<NodeAssetDTO> nodeAssetDTOList = spaceAssetMapper.selectNodeAssetDto(nodeIds);
        if (CollUtil.isNotEmpty(nodeAssetDTOList)) {
            String jsonArrStrEncode =
                Base64.encode(JSONUtil.parseArray(nodeAssetDTOList).toString());
            File assets = FileUtil.writeUtf8String(jsonArrStrEncode,
                StrUtil.format("{}/{}--{}", dir, ASSET_DIR, md5.digestHex(jsonArrStrEncode)));
            files.add(assets);
        }
        // build data files
        Map<String, String> nodeIdToDescMap = iNodeDescService.getNodeIdToDescMap(nodeIds);
        Map<String, List<String>> foreignDstIdsMap =
            iDatasheetService.getForeignDstIds(nodeIds, true);
        if (MapUtil.isNotEmpty(foreignDstIdsMap)) {
            nodeIds = (List<String>) CollUtil.subtract(nodeIds, foreignDstIdsMap.keySet());
            // processing correlation table
            foreignDstIdsMap.forEach((dstId, foreignDstIds) -> {
                SnapshotMapRo snapshotMapRo =
                    iDatasheetService.delFieldIfLinkDstId(null, dstId, foreignDstIds, false);
                if (!saveData) {
                    snapshotMapRo.setRecordMap(JSONUtil.createObj());
                }
                createDataFile(dir, md5, nodeIdToFileNameMap, files, dstId, snapshotMapRo,
                    nodeIdToDescMap.get(dstId));
            });
        }
        if (CollUtil.isNotEmpty(nodeIds)) {
            // get snapshot
            Map<String, SnapshotMapRo> snapshotMap =
                iDatasheetService.findSnapshotMapByDstIds(nodeIds, saveData);
            nodeIds.stream()
                .filter(id -> snapshotMap.get(id) != null || nodeIdToDescMap.get(id) != null)
                .forEach(
                    id -> createDataFile(dir, md5, nodeIdToFileNameMap, files, id,
                        snapshotMap.get(id), nodeIdToDescMap.get(id)));
        }
        // build a file tree and generate manifest
        NodeFileTree root =
            new NodeFileTree(null, nodeId, node.getNodeName(), node.getIcon(), node.getType(),
                node.getCover(), nodeIdToFileNameMap.get(nodeId));
        if (CollUtil.isNotEmpty(childrenList)) {
            List<NodeFileTree> childList = new ArrayList<>();
            childrenList.forEach(share -> {
                NodeFileTree nodeFileTree =
                    new NodeFileTree(share.getParentId(), share.getNodeId(), share.getNodeName(),
                        share.getIcon(), share.getType(), share.getCover(),
                        nodeIdToFileNameMap.get(share.getNodeId()));
                childList.add(nodeFileTree);
            });
            List<NodeFileTree> treeList =
                new DefaultTreeBuildFactory<NodeFileTree>(nodeId).doTreeBuild(childList);
            root.setChild(treeList);
        }
        String version = DateUtil.format(LocalDateTime.now(), DatePattern.NORM_DATE_PATTERN);
        Manifest manifest = Manifest.builder().version(version).root(root).build();
        if (StrUtil.isNotBlank(password)) {
            String pwdEncode = passwordService.encode(password);
            manifest.setEncryption("password");
            manifest.setPassword(pwdEncode);
        }
        File manifestFile = FileUtil.writeUtf8String(JSONUtil.parseObj(manifest).toString(),
            StrUtil.format("{}/{}", dir, MANIFEST));
        files.add(manifestFile);
        String zipFileName = StrUtil.format("{}/{}.apitable", dir, node.getNodeName());
        File zipFile = FileUtil.file(zipFileName);
        try (ZipOutputStream zip = new ZipOutputStream(Files.newOutputStream(zipFile.toPath()))) {
            for (File file : files) {
                zip.putNextEntry(new ZipEntry(file.getName().replace("--", "/")));
                zip.write(Files.readAllBytes(file.toPath()));
                zip.closeEntry();
            }
            ExportUtil.exportBytes(IoUtil.readBytes(Files.newInputStream(zipFile.toPath())),
                URLEncoder.encode(zipFile.getName(), StandardCharsets.UTF_8.name()),
                "application/zip");
        } catch (IOException e) {
            log.error("generation bundle failed", e);
        } finally {
            FileUtil.del(dir);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void analyze(MultipartFile file, String password, String parentId, String preNodeId,
                        Long userId, Long unitId) {
        log.info("parse bundle file");
        ExceptionUtil.isNotNull(file, ActionException.FILE_EMPTY);
        ExceptionUtil.isTrue(StrUtil.isNotBlank(parentId) || StrUtil.isNotBlank(preNodeId),
            ParameterException.INCORRECT_ARG);
        // Check whether the pre-node is under the parent node, if not saved in the first place of the parent node
        if (StrUtil.isNotBlank(preNodeId)) {
            String nodeParentId = nodeMapper.selectParentIdByNodeId(preNodeId);
            if (StrUtil.isBlank(parentId)) {
                parentId = nodeParentId;
            } else if (!parentId.equals(nodeParentId)) {
                preNodeId = null;
            }
        }
        String spaceId = nodeMapper.selectSpaceIdByNodeId(parentId);
        Long memberId = userSpaceCacheService.getMemberId(userId, spaceId);
        iNodeService.checkEnableOperateNodeBySpaceFeature(memberId, spaceId, parentId);
        String manifestStr = null;
        String assetsContent = null;
        // get file
        Map<String, String> fileNameToContentMap = MapUtil.newHashMap();
        try (ZipInputStream zip = new ZipInputStream(file.getInputStream())) {
            ZipEntry entry;
            while ((entry = zip.getNextEntry()) != null) {
                String name = entry.getName();
                BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(zip));
                String line;
                StringBuilder content = new StringBuilder();
                while ((line = bufferedReader.readLine()) != null) {
                    content.append(line);
                }
                if (MANIFEST.equals(name)) {
                    manifestStr = content.toString();
                } else if (name.startsWith(ASSET_DIR)) {
                    assetsContent = content.toString();
                } else {
                    fileNameToContentMap.put(name, content.toString());
                }
            }
        } catch (IOException e) {
            log.info("parsing bundle file failed");
            throw new BusinessException(ActionException.FILE_ERROR_CONTENT);
        }
        ExceptionUtil.isNotBlank(manifestStr, ActionException.FILE_ERROR_CONTENT);
        // file parsing
        try {
            Manifest manifest = JSONUtil.parseObj(manifestStr).toBean(Manifest.class);
            // verify parsing password
            ExceptionUtil.isTrue(StrUtil.isBlank(manifest.getEncryption())
                    || (StrUtil.isNotBlank(password)
                    && passwordService.matches(password, manifest.getPassword())),
                ActionException.FILE_ERROR_PASSWORD);
            // processing file tree
            List<NodeEntity> nodeList = new ArrayList<>();
            Map<String, String> newNodeIdMap = MapUtil.newHashMap();
            Map<String, List<DataSheetCreateRo>> fileNameToNodeMap = MapUtil.newHashMap();
            NodeFileTree root = manifest.getRoot();
            // If the export is a root node, modify it to folder type
            if (root.getType() == NodeType.ROOT.getNodeType()) {
                root.setType(NodeType.FOLDER.getNodeType());
            }
            // duplicate name modification at the same level
            String name =
                iNodeService.duplicateNameModify(parentId, root.getType(), root.getNodeName(),
                    null, unitId);
            root.setNodeName(name);
            this.processNode(userId, spaceId, parentId, preNodeId, unitId, root, nodeList,
                newNodeIdMap, fileNameToNodeMap);
            // processing data files
            if (MapUtil.isNotEmpty(fileNameToNodeMap)) {
                ExceptionUtil.isTrue(fileNameToNodeMap.size() == fileNameToContentMap.size(),
                    ActionException.FILE_ERROR_CONTENT);
                // Obtain the ID of the space to which the original node belongs. If it is inconsistent with the saved space, you need to clear the data related to the member field.
                String sourceSpaceId =
                    nodeMapper.selectSpaceIdByNodeIdIncludeDeleted(root.getNodeId());
                boolean same = spaceId.equals(sourceSpaceId);
                List<NodeDescEntity> nodeDescList = new ArrayList<>();
                fileNameToContentMap.forEach((fileName, content) -> {
                    NodeDataFile dataFile =
                        JSONUtil.parseObj(Base64.decodeStr(content)).toBean(NodeDataFile.class);
                    List<DataSheetCreateRo> roList = fileNameToNodeMap.get(fileName);
                    SnapshotMapRo snapshot = dataFile.getSnapshot();
                    roList.forEach(createRo -> {
                        if (snapshot != null) {
                            MetaMapRo meta = snapshot.getMeta().toBean(MetaMapRo.class);
                            List<String> delFieldIds =
                                iDatasheetService.replaceFieldDstId(userId, same, meta,
                                    newNodeIdMap);
                            if (!same && CollUtil.isNotEmpty(delFieldIds)) {
                                snapshot.getRecordMap().values().forEach(recordMapRo ->
                                    JSONUtil.parseObj(recordMapRo).getJSONObject("data").keySet()
                                        .removeIf(delFieldIds::contains));
                            }
                            iDatasheetService.create(userId, spaceId, createRo.getNodeId(),
                                createRo.getName(), meta, snapshot.getRecordMap());
                        }
                        if (dataFile.getDescription() != null) {
                            NodeDescEntity descEntity =
                                NodeDescEntity.builder().id(IdWorker.getId())
                                    .nodeId(createRo.getNodeId())
                                    .description(dataFile.getDescription()).build();
                            nodeDescList.add(descEntity);
                        }
                    });
                });
                iNodeDescService.insertBatch(nodeDescList);
            }
            // The node after the original front node is updated, and the position is moved back by one bit.
            nodeMapper.updatePreNodeIdBySelf(newNodeIdMap.get(root.getNodeId()), preNodeId,
                parentId);
            iNodeService.insertBatch(nodeList, null);
            // processing resource files
            if (StrUtil.isNotBlank(assetsContent)) {
                List<NodeAssetDTO> list =
                    JSONUtil.parseArray(Base64.decodeStr(assetsContent)).toList(NodeAssetDTO.class);
                iSpaceAssetService.processNodeAssets(newNodeIdMap, spaceId, list);
            }
        } catch (JSONException | NullPointerException e) {
            throw new BusinessException(ActionException.FILE_ERROR_CONTENT);
        }
    }

    private void processNode(Long userId, String spaceId, String parentId, String preNodeId,
                             Long unitId, NodeFileTree node, List<NodeEntity> nodeList,
                             Map<String, String> newNodeIdMap,
                             Map<String, List<DataSheetCreateRo>> fileNameToNodeMap) {
        boolean isDst = node.getType() == NodeType.DATASHEET.getNodeType();
        String nodeId = isDst ? IdUtil.createDstId() : IdUtil.createNodeId();
        NodeEntity nodeEntity = NodeEntity.builder()
            .id(IdWorker.getId())
            .isTemplate(false)
            .spaceId(spaceId)
            .nodeId(nodeId)
            .nodeName(node.getNodeName())
            .parentId(parentId)
            .type(node.getType())
            .icon(node.getIcon())
            .preNodeId(preNodeId)
            .cover(node.getCover())
            .createdBy(userId)
            .updatedBy(userId)
            .unitId(unitId)
            .build();
        nodeList.add(nodeEntity);
        newNodeIdMap.put(node.getNodeId(), nodeId);
        if (isDst || node.getData() != null) {
            String fileName = StrUtil.format("{}/{}", DATA_DIR, node.getData());
            List<DataSheetCreateRo> roList = fileNameToNodeMap.get(fileName);
            DataSheetCreateRo ro =
                DataSheetCreateRo.builder().nodeId(nodeId).name(node.getNodeName()).build();
            if (CollUtil.isNotEmpty(roList)) {
                // Multiple folders describe the same situation and point to the same data file.
                roList.add(ro);
            } else {
                fileNameToNodeMap.put(fileName, CollUtil.newArrayList(ro));
            }
        }
        if (!isDst && CollUtil.isNotEmpty(node.getChild())) {
            // processing child nodes
            this.processChildList(userId, spaceId, nodeId, unitId, node.getChild(), nodeList,
                newNodeIdMap, fileNameToNodeMap);
        }
    }

    private void processChildList(Long userId, String spaceId, String parentId, Long unitId,
                                  List<NodeFileTree> child, List<NodeEntity> nodeList,
                                  Map<String, String> newNodeIdMap,
                                  Map<String, List<DataSheetCreateRo>> fileNameToNodeMap) {
        String preNodeId = null;
        for (NodeFileTree node : child) {
            this.processNode(userId, spaceId, parentId, preNodeId, unitId, node, nodeList,
                newNodeIdMap, fileNameToNodeMap);
            preNodeId = newNodeIdMap.get(node.getNodeId());
        }
    }

    private void createDataFile(String dir, Digester md5, Map<String, String> nodeIdToFileNameMap,
                                List<File> files, String nodeId, SnapshotMapRo snapshotMapRo,
                                String nodeDesc) {
        NodeDataFile dataFile = new NodeDataFile(nodeDesc, snapshotMapRo);
        String jsonStrEncode = Base64.encode(JSONUtil.parseObj(dataFile).toString());
        String fileName = StrUtil.join(".", md5.digestHex(jsonStrEncode), "apitable");
        // The same file already exists and is not generated repeatedly (scenario: folder description is the same)
        if (!nodeIdToFileNameMap.containsValue(fileName)) {
            File file = FileUtil.writeUtf8String(jsonStrEncode,
                StrUtil.format("{}/{}--{}", dir, DATA_DIR, fileName));
            files.add(file);
        }
        nodeIdToFileNameMap.put(nodeId, fileName);
    }

}
