import { useContext, useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { KonvaGridContext } from "pc/components/konva_grid";
import { ClearOutlined, ConnectOutlined } from "@vikadata/icons";
import {
  KonvaGanttViewContext,
  generateTargetName,
} from "pc/components/gantt_view";
import { KonvaGridViewContext } from "pc/components/konva_grid/context";
import { Icon, ToolTip } from "pc/components/konva_components";
import { resourceService } from "pc/resource_service";
import { store } from "pc/store";
import {
  Selectors,
  CollaCommandName,
  t,
  Strings,
  KONVA_DATASHEET_ID,
  ConfigConstant,
} from "@vikadata/core";
import { getRecordName } from "pc/components/expand_record";
import { Message } from "@vikadata/components";
import { Text, autoSizerCanvas } from "pc/components/konva_components";
import { hexToRGB } from "pc/utils";

const Rect = dynamic(
  () => import("pc/components/gantt_view/hooks/use_gantt_timeline/rect"),
  { ssr: false }
);
const Group = dynamic(
  () => import("pc/components/gantt_view/hooks/use_gantt_timeline/group"),
  { ssr: false }
);
const Line = dynamic(
  () => import("pc/components/gantt_view/hooks/use_gantt_timeline/line"),
  { ssr: false }
);
const Arrow = dynamic(
  () => import("pc/components/gantt_view/hooks/use_gantt_timeline/arrow"),
  { ssr: false }
);

const ClearOutlinedPath = ClearOutlined.toString();
const ConnectOutlinedPath = ConnectOutlined.toString();

export const useTaskLineSetting = () => {
  const { taskLineSetting, ganttStyle, setTaskLineSetting } = useContext(
    KonvaGanttViewContext
  );
  const { snapshot, visibleColumns, fieldMap, fieldPermissionMap } =
    useContext(KonvaGridViewContext);
  const state = store.getState();
  const { theme } = useContext(KonvaGridContext);
  const colors = theme.color;
  const { linkFieldId, startFieldId, endFieldId } = ganttStyle;
  const [showConnect, setShowConnect] = useState(false);
  const [delateTootip, setDelateTootip] = useState(false);
  const [relationTootip, setRelationTootip] = useState(false);
  const textSizer = useRef(autoSizerCanvas);

  useEffect(() => {
    setShowConnect(false);
    setRelationTootip(false);
    setDelateTootip(false);
  }, [taskLineSetting]);

  if (!taskLineSetting || !linkFieldId) {
    return {
      settingLineComponments: null,
    };
  }

  const { x, y, sourceId, targetId, fillColor, dashEnabled } = taskLineSetting;

  const firstFieldId = visibleColumns[0].fieldId;
  const sourceCellValue = Selectors.getCellValue(
    state,
    snapshot,
    sourceId,
    firstFieldId
  );
  const sourceTitle =
    getRecordName(sourceCellValue, fieldMap[firstFieldId]) ||
    t(Strings.record_unnamed);
  const sourceRecordTitle = textSizer.current.measureText(
    sourceTitle,
    160,
    1
  ).text;

  const startTimeCellValue = Selectors.getCellValue(
    state,
    snapshot,
    sourceId,
    endFieldId
  );
  const startTimeStr = getRecordName(startTimeCellValue, fieldMap[endFieldId]);
  const startTime = textSizer.current.measureText(startTimeStr, 100, 1).text;

  const targetCellValue = Selectors.getCellValue(
    state,
    snapshot,
    targetId,
    firstFieldId
  );
  const targetTitle =
    getRecordName(targetCellValue, fieldMap[firstFieldId]) ||
    t(Strings.record_unnamed);
  const targetRecordTitle = textSizer.current.measureText(
    targetTitle,
    160,
    1
  ).text;

  const endTimeCellValue = Selectors.getCellValue(
    state,
    snapshot,
    targetId,
    startFieldId
  );
  const endTimeStr = getRecordName(endTimeCellValue, fieldMap[startFieldId]);
  const endTime = textSizer.current.measureText(endTimeStr, 100, 1).text;

  const deleteTaskLine = () => {
    const cellValue =
      Selectors.getCellValue(state, snapshot, targetId, linkFieldId) || [];
    const recordIndex = cellValue.indexOf(sourceId);
    if (recordIndex === -1) {
      return;
    }

    const fieldRole = Selectors.getFieldRoleByFieldId(
      fieldPermissionMap,
      linkFieldId
    );
    const isDrawPermission = [ConfigConstant.Role.Editor, null].includes(
      fieldRole
    );

    if (!isDrawPermission) {
      Message.warning({ content: t(Strings.gantt_not_rights_to_link_warning) });
      return;
    }

    const newCellValue = [...cellValue];
    newCellValue.splice(recordIndex, 1);
    resourceService?.instance?.commandManager?.execute({
      cmd: CollaCommandName.SetRecords,
      data: [
        {
          recordId: targetId,
          fieldId: linkFieldId,
          value: newCellValue,
        },
      ],
    });
    setTaskLineSetting(null);
  };

  const showContactInfo = () => {
    console.log(
      "sourceRecordTitle targetRecordTitle",
      sourceRecordTitle,
      targetRecordTitle
    );
    setShowConnect(true);
  };

  const lineSettingModels = (
    <>
      {showConnect ? (
        <Group x={x - 210} y={y}>
          <Rect
            name={generateTargetName({
              targetName: KONVA_DATASHEET_ID.GANTT_LINE_SETTING,
              recordId: sourceId,
            })}
            x={0}
            y={0}
            width={208}
            height={180}
            fill={colors.bgCommonHigh}
            cornerRadius={4}
            shadowEnabled
            shadowBlur={16}
            shadowColor={hexToRGB(colors.shadowCommonHigh, 0.16)}
          />
          <Rect
            x={16}
            y={16}
            width={176}
            height={58}
            fill={colors.bgControlsDefault}
            cornerRadius={4}
          />
          <Text
            x={24}
            y={24}
            text={sourceRecordTitle}
            fill={colors.fc1}
            height={20}
            fontStyle={"bold"}
            verticalAlign={"middle"}
          />
          <Text
            x={24}
            y={48}
            text={t(Strings.end_time)}
            fill={colors.fc3}
            height={20}
            verticalAlign={"middle"}
          />
          <Text
            x={86}
            y={48}
            text={startTime}
            fill={colors.fc1}
            height={20}
            fontStyle={"bold"}
            verticalAlign={"middle"}
          />
          <Arrow
            points={[104, 74, 104, 105]}
            fill={fillColor}
            stroke={fillColor}
            strokeWidth={1}
            lineCap="round"
            pointerLength={5}
            pointerWidth={5}
            dash={[2, 5]}
            dashEnabled={dashEnabled}
          />
          <Rect
            x={16}
            y={106}
            width={176}
            height={58}
            fill={colors.bgControlsDefault}
            cornerRadius={4}
          />
          <Text
            x={24}
            y={114}
            text={targetRecordTitle}
            fill={colors.fc1}
            height={20}
            fontStyle={"bold"}
            verticalAlign={"middle"}
          />
          <Text
            x={24}
            y={138}
            text={t(Strings.start_field_name)}
            fill={colors.fc3}
            height={20}
            fontStyle={"bold"}
            verticalAlign={"middle"}
          />
          <Text
            x={86}
            y={138}
            text={endTime}
            fill={colors.fc1}
            height={20}
            verticalAlign={"middle"}
          />
        </Group>
      ) : (
        <Group x={x - 40} y={dashEnabled ? y + 2 : y - 42}>
          <Rect
            name={generateTargetName({
              targetName: KONVA_DATASHEET_ID.GANTT_LINE_SETTING,
              recordId: sourceId,
            })}
            x={0}
            y={0}
            width={80}
            height={40}
            fill={colors.bgCommonHigh}
            cornerRadius={4}
            shadowEnabled
            shadowBlur={16}
            shadowColor={hexToRGB(colors.shadowCommonHigh, 0.16)}
          />
          <Icon
            x={8}
            y={8}
            data={ConnectOutlinedPath}
            backgroundWidth={24}
            backgroundHeight={24}
            onClick={() => showContactInfo()}
            onMouseEnter={() => setRelationTootip(true)}
            onMouseOut={() => setRelationTootip(false)}
          />
          {relationTootip && (
            <ToolTip
              x={20}
              y={8}
              text={t(Strings.gantt_check_connection)}
              background={colors.fc13}
              fill={colors.defaultBg}
              pointerDirection={"down"}
              pointerWidth={5}
              pointerHeight={2.5}
            />
          )}
          <Line points={[40, 10, 40, 30]} stroke={colors.fc5} strokeWidth={1} />
          <Icon
            x={48}
            y={8}
            data={ClearOutlinedPath}
            backgroundWidth={24}
            backgroundHeight={24}
            onClick={() => deleteTaskLine()}
            onMouseEnter={() => setDelateTootip(true)}
            onMouseOut={() => setDelateTootip(false)}
          />
          {delateTootip && (
            <ToolTip
              x={60}
              y={8}
              text={t(Strings.gantt_disconnect)}
              background={colors.fc13}
              fill={colors.defaultBg}
              pointerDirection={"down"}
              pointerWidth={5}
              pointerHeight={2.5}
            />
          )}
        </Group>
      )}
    </>
  );

  return {
    lineSettingModels,
  };
};
