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

package com.apitable.widget.service.impl;

import static com.apitable.workspace.enums.NodeException.UNKNOWN_NODE_TYPE;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.collection.CollUtil;
import cn.hutool.json.JSONUtil;
import com.apitable.base.enums.DatabaseException;
import com.apitable.control.infrastructure.ControlRoleDict;
import com.apitable.control.infrastructure.ControlTemplate;
import com.apitable.core.exception.BusinessException;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.core.util.SqlTool;
import com.apitable.interfaces.widget.facade.WidgetServiceAuditFacade;
import com.apitable.shared.component.TaskManager;
import com.apitable.shared.config.properties.LimitProperties;
import com.apitable.shared.context.LoginContext;
import com.apitable.shared.util.IdUtil;
import com.apitable.template.enums.TemplateException;
import com.apitable.widget.dto.NodeWidgetDto;
import com.apitable.widget.dto.WidgetBaseInfo;
import com.apitable.widget.dto.WidgetDTO;
import com.apitable.widget.dto.WidgetPackageDTO;
import com.apitable.widget.dto.WidgetSpaceByDTO;
import com.apitable.widget.entity.WidgetEntity;
import com.apitable.widget.enums.InstallEnvType;
import com.apitable.widget.enums.RuntimeEnvType;
import com.apitable.widget.enums.WidgetException;
import com.apitable.widget.enums.WidgetPackageStatus;
import com.apitable.widget.enums.WidgetReleaseType;
import com.apitable.widget.mapper.WidgetMapper;
import com.apitable.widget.mapper.WidgetPackageMapper;
import com.apitable.widget.ro.WidgetCreateRo;
import com.apitable.widget.ro.WidgetStoreListRo;
import com.apitable.widget.service.IWidgetService;
import com.apitable.widget.vo.WidgetInfo;
import com.apitable.widget.vo.WidgetPack;
import com.apitable.widget.vo.WidgetSnapshot;
import com.apitable.widget.vo.WidgetStoreListInfo;
import com.apitable.workspace.dto.DatasheetWidgetDTO;
import com.apitable.workspace.entity.DatasheetWidgetEntity;
import com.apitable.workspace.entity.NodeRelEntity;
import com.apitable.workspace.enums.IdRulePrefixEnum;
import com.apitable.workspace.enums.NodeType;
import com.apitable.workspace.enums.PermissionException;
import com.apitable.workspace.mapper.DatasheetWidgetMapper;
import com.apitable.workspace.mapper.ResourceMetaMapper;
import com.apitable.workspace.service.IDatasheetWidgetService;
import com.apitable.workspace.service.INodeRelService;
import com.apitable.workspace.service.INodeService;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * widget service implementation.
 */
@Slf4j
@Service
public class WidgetServiceImpl implements IWidgetService {

    @Resource
    private WidgetMapper widgetMapper;

    @Resource
    private WidgetPackageMapper widgetPackageMapper;

    @Resource
    private WidgetServiceAuditFacade widgetServiceAuditFacade;

    @Resource
    private INodeService iNodeService;

    @Resource
    private INodeRelService iNodeRelService;

    @Resource
    private ControlTemplate controlTemplate;

    @Resource
    private ResourceMetaMapper resourceMetaMapper;

    @Resource
    private IDatasheetWidgetService iDatasheetWidgetService;

    @Resource
    private DatasheetWidgetMapper datasheetWidgetMapper;

    @Resource
    private LimitProperties limitProperties;

    @Resource
    private ObjectMapper objectMapper;

    @Override
    public Long getSpaceWidgetCount(String spaceId) {
        return widgetMapper.selectCountBySpaceId(spaceId);
    }

    @Override
    public List<WidgetStoreListInfo> widgetStoreList(Long userId, String spaceId,
                                                     WidgetStoreListRo storeListRo) {
        if (null != storeListRo
            && WidgetReleaseType.WAIT_REVIEW.getValue().equals(storeListRo.getType())) {
            // show a list of global widgets to be reviewed
            return widgetServiceAuditFacade.getWaitReviewWidgetList(storeListRo);
        }
        List<WidgetStoreListInfo> datas =
            widgetPackageMapper.selectWidgetStoreList(userId, spaceId, storeListRo);
        for (WidgetStoreListInfo widgetInfo : datas) {
            widgetInfo.setInstallEnv(InstallEnvType.toValueList(widgetInfo.getInstallEnvCode()));
            widgetInfo.setRuntimeEnv(RuntimeEnvType.toValueList(widgetInfo.getRuntimeEnvCode()));
            // replace space station widget author name
            if (WidgetReleaseType.SPACE.getValue().equals(widgetInfo.getReleaseType())) {
                WidgetSpaceByDTO byDTO =
                    widgetPackageMapper.selectWidgetSpaceBy(widgetInfo.getWidgetPackageId());
                if (null != byDTO) {
                    widgetInfo.setAuthorName(byDTO.getAuthorName());
                    widgetInfo.setAuthorIcon(byDTO.getAuthorIcon());
                    widgetInfo.setOwnerUuid(byDTO.getOwnerUuid());
                    widgetInfo.setOwnerMemberId(byDTO.getOwnerMemberId());
                }
            }
        }
        return datas;
    }

    @Override
    public List<WidgetInfo> getWidgetInfoList(String spaceId, Long memberId, Integer count) {
        log.info("Gets the component information in the specified space.");
        // load only the components in the datasheet
        List<WidgetInfo> widgetInfos = widgetMapper.selectInfoBySpaceIdAndNodeType(spaceId,
            NodeType.DATASHEET.getNodeType(), count);
        if (CollUtil.isEmpty(widgetInfos)) {
            return new ArrayList<>();
        }
        // filter source datasheet permissions
        List<String> datasheetIds =
            widgetInfos.stream().map(WidgetInfo::getDatasheetId).collect(Collectors.toList());
        ControlRoleDict roleDict = controlTemplate.fetchNodeRole(memberId, datasheetIds);
        if (CollUtil.isEmpty(roleDict)) {
            return new ArrayList<>();
        }
        List<WidgetInfo> infos = new ArrayList<>(count);
        for (int i = 0, number = 0; i < widgetInfos.size() && number < count; i++) {
            WidgetInfo info = widgetInfos.get(i);
            if (!roleDict.containsKey(info.getDatasheetId())) {
                continue;
            }
            infos.add(info);
            number++;
        }
        return infos;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public String create(Long userId, String spaceId, WidgetCreateRo widget) {
        log.info("Create Widget");
        // to determine whether the component package exists, only under development, pending release, and released status can be added
        List<Integer> checkStatus = CollUtil.newArrayList(WidgetPackageStatus.DEVELOP.getValue(),
            WidgetPackageStatus.UNPUBLISHED.getValue(), WidgetPackageStatus.ONLINE.getValue());
        this.checkWidgetPackIfExist(widget.getWidgetPackageId(), checkStatus);
        String widgetId = IdUtil.createWidgetId();
        // if it is a widget in the data datasheet, create a widget in the data datasheet. if it is a widget in the dashboard, check the maximum number
        NodeType nodeType = iNodeService.getTypeByNodeId(widget.getNodeId());
        switch (nodeType) {
            case DATASHEET:
                // create associations between tables and components
                iDatasheetWidgetService.create(spaceId, widget.getNodeId(), widgetId,
                    widget.getNodeId());
                break;
            case DASHBOARD:
                // Note: The number of statistics uses the number of Dashboard layout to ensure the accuracy, and the widget instance may have dirty data
                int count = SqlTool.retCount(
                    resourceMetaMapper.countDashboardWidgetNumber(widget.getNodeId()));
                ExceptionUtil.isTrue(count < limitProperties.getDsbWidgetMaxCount(),
                    WidgetException.WIDGET_NUMBER_LIMIT);
                break;
            case MIRROR:
                // create an association between a mirror source table and a component
                NodeRelEntity nodeRel = iNodeRelService.getByRelNodeId(widget.getNodeId());
                ExceptionUtil.isNotNull(nodeRel, PermissionException.NODE_NOT_EXIST);
                iDatasheetWidgetService.create(spaceId, nodeRel.getMainNodeId(), widgetId,
                    widget.getNodeId());
                break;
            default:
                throw new BusinessException(UNKNOWN_NODE_TYPE);
        }
        // new components
        WidgetEntity widgetEntity = WidgetEntity.builder()
            .id(IdWorker.getId())
            .spaceId(spaceId)
            .nodeId(widget.getNodeId())
            .packageId(widget.getWidgetPackageId())
            .widgetId(widgetId)
            .name(widget.getName())
            .storage(JSONUtil.createObj().toString())
            .createdBy(userId)
            .updatedBy(userId)
            .build();
        boolean flag =
            SqlHelper.retBool(widgetMapper.insertBatch(Collections.singletonList(widgetEntity)));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
        // the cumulative number of installations of the component package
        TaskManager.me().execute(
            () -> widgetPackageMapper.updateInstalledNumByPackageId(widget.getWidgetPackageId(),
                1));
        return widgetId;
    }

    private void checkWidgetPackIfExist(String widgetPackageId, List<Integer> status) {
        log.info("check if the component installation package exists, widgetPackageId:{}，status:{}",
            widgetPackageId, status);
        // determine if a component package exists
        Integer packageStatus = widgetPackageMapper.selectStatusByPackageId(widgetPackageId);
        ExceptionUtil.isTrue(packageStatus != null && status.contains(packageStatus),
            WidgetException.WIDGET_PACKAGE_NOT_EXIST);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Collection<String> copyWidget(Long userId, String spaceId,
                                         String nodeId, List<String> widgetIds) {
        log.info("copy widgets");
        if (nodeId.startsWith(IdRulePrefixEnum.DASHBOARD.getIdRulePrefixEnum())) {
            // verify the maximum number of components for a dashboard
            int count = SqlTool.retCount(resourceMetaMapper.countDashboardWidgetNumber(nodeId));
            ExceptionUtil.isTrue(count + widgetIds.size()
                <= limitProperties.getDsbWidgetMaxCount(), WidgetException.WIDGET_NUMBER_LIMIT);
        }
        // check if components exist
        int widgetCount =
            SqlTool.retCount(widgetMapper.selectCountBySpaceIdAndWidgetIds(spaceId, widgetIds));
        ExceptionUtil.isTrue(widgetCount == widgetIds.size(), WidgetException.WIDGET_NOT_EXIST);
        // verify that component data sources all exist
        List<WidgetDTO> widgetDTOList = widgetMapper.selectWidgetDtoByWidgetIds(widgetIds);
        ExceptionUtil.isTrue(
            CollUtil.isNotEmpty(widgetDTOList) && widgetDTOList.size() == widgetIds.size(),
            WidgetException.WIDGET_DATASHEET_NOT_EXIST);
        // Build: Old widgetId and new widgetId mapping, new widgetId and data source datasheetId mapping
        Map<String, String> newNodeMap = new HashMap<>(widgetIds.size());
        Map<String, String> newWidgetIdMap = new HashMap<>(widgetIds.size());
        Map<String, DatasheetWidgetDTO> newWidgetIdToDstMap = new HashMap<>(widgetIds.size());
        for (WidgetDTO dto : widgetDTOList) {
            newNodeMap.put(dto.getNodeId(), nodeId);
            String newWidgetId = IdUtil.createWidgetId();
            newWidgetIdMap.put(dto.getWidgetId(), newWidgetId);
            DatasheetWidgetDTO datasheetWidgetDTO = new DatasheetWidgetDTO();
            BeanUtil.copyProperties(dto, datasheetWidgetDTO);
            newWidgetIdToDstMap.put(newWidgetId, datasheetWidgetDTO);
        }
        // copy widgets
        this.copyBatch(userId, spaceId, newNodeMap, newWidgetIdMap, newWidgetIdToDstMap);
        return newWidgetIdMap.values();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void copyBatch(Long userId, String destSpaceId, Map<String, String> newNodeMap,
                          Map<String, String> newWidgetIdMap,
                          Map<String, DatasheetWidgetDTO> newWidgetIdToDstMap) {
        // batch generation of new widgets
        List<WidgetBaseInfo> widgetBaseInfos =
            widgetMapper.selectWidgetBaseInfoByWidgetIds(newWidgetIdMap.keySet());
        if (widgetBaseInfos.isEmpty()) {
            return;
        }
        List<WidgetEntity> entities = new ArrayList<>(widgetBaseInfos.size());
        List<DatasheetWidgetEntity> datasheetWidgets = new ArrayList<>(newWidgetIdToDstMap.size());
        for (WidgetBaseInfo widgetInfo : widgetBaseInfos) {
            String widgetId = newWidgetIdMap.get(widgetInfo.getWidgetId());
            // Reset the widget storage configuration when there is no data source.
            boolean hasDataSource = newWidgetIdToDstMap.containsKey(widgetId);
            String storage =
                hasDataSource ? widgetInfo.getStorage() : JSONUtil.createObj().toString();
            // build widget entity
            WidgetEntity widgetEntity = WidgetEntity.builder()
                .id(IdWorker.getId())
                .spaceId(destSpaceId)
                .nodeId(newNodeMap.get(widgetInfo.getNodeId()))
                .packageId(widgetInfo.getWidgetPackageId())
                .widgetId(widgetId)
                .name(widgetInfo.getName())
                .storage(storage)
                .createdBy(userId)
                .updatedBy(userId)
                .build();
            entities.add(widgetEntity);
            if (!hasDataSource) {
                continue;
            }
            DatasheetWidgetDTO datasheetWidgetDTO = newWidgetIdToDstMap.get(widgetId);
            // Build the associated entity of the datasheet and the widget.
            DatasheetWidgetEntity datasheetWidget = DatasheetWidgetEntity.builder()
                .id(IdWorker.getId())
                .spaceId(destSpaceId)
                .dstId(datasheetWidgetDTO.getDstId())
                .sourceId(datasheetWidgetDTO.getSourceId())
                .widgetId(widgetId)
                .build();
            datasheetWidgets.add(datasheetWidget);
        }
        boolean flag = SqlHelper.retBool(widgetMapper.insertBatch(entities));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
        if (CollUtil.isNotEmpty(datasheetWidgets)) {
            // Batch Create Association between datasheet and widget
            flag = SqlHelper.retBool(datasheetWidgetMapper.insertBatch(datasheetWidgets));
            ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
        }
        // cumulative installation times of widget package
        TaskManager.me().execute(() -> {
            Map<String, List<WidgetBaseInfo>> packageIdToInfosMap = widgetBaseInfos.stream()
                .collect(Collectors.groupingBy(WidgetBaseInfo::getWidgetPackageId));
            packageIdToInfosMap.forEach((widgetPackageId, infos) ->
                widgetPackageMapper.updateInstalledNumByPackageId(widgetPackageId, infos.size()));
        });
    }

    @Override
    public String checkByWidgetIds(List<String> widgetIds) {
        // widget space verification, all must be in the same space
        List<String> spaceIds = widgetMapper.selectSpaceIdByWidgetIds(widgetIds);
        ExceptionUtil.isTrue(CollUtil.isNotEmpty(spaceIds) && spaceIds.size() == 1,
            WidgetException.WIDGET_SPACE_ERROR);
        return spaceIds.get(0);
    }

    @Override
    public WidgetPack getWidgetPack(String widgetId) {
        log.info("get widget package information，widgetId:{}", widgetId);
        List<WidgetPack> widgetPackList =
            this.getWidgetPackList(Collections.singletonList(widgetId));
        if (CollUtil.isEmpty(widgetPackList)) {
            return new WidgetPack();
        }
        return widgetPackList.get(0);
    }

    @Override
    public List<WidgetPack> getWidgetPackList(Collection<String> widgetIds) {
        log.info("get the widget package information collection");
        if (CollUtil.isEmpty(widgetIds)) {
            return new ArrayList<>();
        }
        List<WidgetBaseInfo> widgetBaseInfos =
            widgetMapper.selectWidgetBaseInfoByWidgetIds(widgetIds);
        if (CollUtil.isEmpty(widgetBaseInfos)) {
            return new ArrayList<>();
        }
        // unified query data source datasheet
        List<DatasheetWidgetDTO> datasheetWidgetDTOList =
            datasheetWidgetMapper.selectDtoByWidgetIds(widgetIds);
        Map<String, DatasheetWidgetDTO> widgetIdToDstMap = datasheetWidgetDTOList.stream()
            .collect(Collectors.toMap(DatasheetWidgetDTO::getWidgetId, dto -> dto));

        // Unified query widget installation package information content
        Set<String> packageIds = widgetBaseInfos.stream().map(WidgetBaseInfo::getWidgetPackageId)
            .collect(Collectors.toSet());
        List<WidgetPackageDTO> packageEntities =
            widgetPackageMapper.selectByPackageIdsIncludeDelete(packageIds,
                LoginContext.me().getLocaleStr());
        Map<String, WidgetPackageDTO> widgetPackageMap = packageEntities.stream()
            .collect(
                Collectors.toMap(WidgetPackageDTO::getPackageId, widgetPackage -> widgetPackage));

        // build widget package information
        List<WidgetPack> widgetPacks = new ArrayList<>(widgetBaseInfos.size());

        widgetBaseInfos.forEach(widget -> {
            HashMap<Object, Object> snapshotStorage = new HashMap<>();
            try {
                TypeReference<HashMap<Object, Object>> typeReference =
                    new TypeReference<>() {
                    };
                snapshotStorage = objectMapper.readValue(widget.getStorage(), typeReference);
            } catch (JsonProcessingException ignored) {
                // ignored
            }
            // assembly widget snapshot information
            WidgetSnapshot snapshot = WidgetSnapshot.builder()
                .widgetName(widget.getName())
                .storage(snapshotStorage)
                .build();
            if (widgetIdToDstMap.containsKey(widget.getWidgetId())) {
                DatasheetWidgetDTO datasheetWidgetDTO = widgetIdToDstMap.get(widget.getWidgetId());
                snapshot.setDatasheetId(datasheetWidgetDTO.getDstId());
                snapshot.setSourceId(datasheetWidgetDTO.getSourceId());
            }
            WidgetPackageDTO widgetPackage = widgetPackageMap.get(widget.getWidgetPackageId());
            WidgetPack widgetPack = WidgetPack.builder()
                .id(widget.getWidgetId())
                .revision(widget.getRevision())
                .widgetPackageId(widgetPackage.getPackageId())
                .widgetPackageName(widgetPackage.getName())
                .widgetPackageIcon(widgetPackage.getIcon())
                .widgetPackageVersion(widgetPackage.getVersion())
                .snapshot(snapshot)
                .status(widgetPackage.getStatus())
                .authorEmail(widgetPackage.getAuthorEmail())
                .authorLink(widgetPackage.getAuthorLink())
                .packageType(widgetPackage.getPackageType())
                .releaseType(widgetPackage.getReleaseType())
                .releaseCodeBundle(widgetPackage.getReleaseCodeBundle())
                .sandbox(widgetPackage.getSandbox())
                .installEnv(InstallEnvType.toValueList(widgetPackage.getInstallEnvCode()))
                .runtimeEnv(RuntimeEnvType.toValueList(widgetPackage.getRuntimeEnvCode()))
                .build();
            // Replace the name of the author of the small widget of the space station.
            if (WidgetReleaseType.SPACE.getValue().equals(widgetPack.getReleaseType())) {
                WidgetSpaceByDTO byDTO =
                    widgetPackageMapper.selectWidgetSpaceBy(widgetPack.getWidgetPackageId());
                if (null != byDTO) {
                    widgetPack.setAuthorName(byDTO.getAuthorName());
                    widgetPack.setAuthorIcon(byDTO.getAuthorIcon());
                }
            } else {
                widgetPack.setAuthorName(widgetPackage.getAuthorName());
                widgetPack.setAuthorIcon(widgetPackage.getAuthorIcon());
                // to be audited widget rendering parent widget id
                if (WidgetReleaseType.WAIT_REVIEW.getValue().equals(widgetPack.getReleaseType())) {
                    widgetPack.setFatherWidgetPackageId(widgetPackage.getFatherWidgetId());
                }
            }
            widgetPacks.add(widgetPack);
        });
        return widgetPacks;
    }

    @Override
    public String getSpaceIdByWidgetId(String widgetId) {
        return widgetMapper.selectSpaceIdByWidgetIdIncludeDeleted(widgetId);
    }

    @Override
    public void checkWidgetReference(List<String> subNodeIds, List<String> widgetIds) {
        // If there is a dashboard, verify whether the data source of the component references an external data table
        List<NodeWidgetDto> widgetInfos = widgetMapper.selectNodeWidgetDtoByNodeIds(widgetIds);
        // Group by dashboard nodeId
        Map<String, List<NodeWidgetDto>> dashboardNodeMap =
            widgetInfos.stream().collect(Collectors.groupingBy(NodeWidgetDto::getNodeId));
        for (String dashboardNodeId : dashboardNodeMap.keySet()) {
            for (NodeWidgetDto widgetInfo : dashboardNodeMap.get(dashboardNodeId)) {
                // Throws an exception if the widget is associated with an external table
                if (!subNodeIds.contains(widgetInfo.getDstId())) {
                    Map<String, Object> foreignMap = new HashMap<>();
                    foreignMap.put("NODE_NAME", iNodeService.getNodeNameByNodeId(dashboardNodeId));
                    foreignMap.put("FOREIGN_WIDGET_NAME", widgetInfo.getWidgetName());
                    throw new BusinessException(
                        TemplateException.FOLDER_DASHBOARD_LINK_FOREIGN_NODE, foreignMap);
                }
            }
        }
    }
}
