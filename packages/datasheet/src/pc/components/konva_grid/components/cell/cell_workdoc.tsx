import dynamic from 'next/dynamic';
import Router from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { KONVA_DATASHEET_ID, Strings, t } from '@apitable/core';
import { AddOutlined, FileOutlined } from '@apitable/icons';
import { useQuery } from 'pc/hooks';
import { generateTargetName } from '../../../gantt_view';
import { Icon, Rect, Text } from '../../../konva_components';
import { GRID_CELL_ADD_ITEM_BUTTON_SIZE, GRID_CELL_VALUE_PADDING, GRID_OPTION_ITEM_PADDING } from '../../constant';
import { KonvaGridContext } from '../../context';
import { CellScrollContainer } from '../cell_scroll_container';
import { ICellProps } from './cell_value';
import { IRenderContentBase, IRenderData } from './interface';

const AddOutlinedPath = AddOutlined.toString();
const FileOutlinedPath = FileOutlined.toString();
const Group = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/group'), { ssr: false });

export const CellWorkdoc = (props: ICellProps) => {
  const { x, y, recordId, field, rowHeight, columnWidth, renderData, isActive, editable, toggleEdit } = props;
  const operatingEnable = isActive;
  const { renderContent, height } = renderData;
  const fieldId = field?.id;
  const query = useQuery();

  useEffect(() => {
    // first render try to open workdoc
    if (query.get('recordId') === recordId && query.get('fieldId') === fieldId) {
      setTimeout(() => {
        toggleEdit && toggleEdit();
      }, 200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { theme } = useContext(KonvaGridContext);
  const colors = theme.color;

  const [isHover, setHover] = useState(false);

  const name = generateTargetName({
    targetName: KONVA_DATASHEET_ID.GRID_CELL,
    fieldId,
    recordId,
    mouseStyle: 'pointer',
  });

  const handleEdit = () => {
    toggleEdit && toggleEdit();
    // query add recordId and fieldId
    const url = Router.asPath;
    const urlObj = new URL(url, window.location.origin);
    urlObj.searchParams.set('recordId', recordId);
    urlObj.searchParams.set('fieldId', fieldId);
    Router.replace(urlObj.toString());
  };

  const renderDoc = () => {
    if (renderContent == null) return null;
    const { x, y, width, height, text } = renderContent[0] as IRenderContentBase;
    return (
      <Group
        x={10}
        y={5}
        listening={isActive}
      >
        <Rect
          name={name}
          width={width + 6}
          height={height + 2}
          fill={isHover ? colors.bgBrandLightHover : colors.bgBrandLightDefault}
          cornerRadius={4}
          onMouseEnter={() => setHover(true)}
          onMouseOut={() => setHover(false)}
          onClick={handleEdit}
          onTap={handleEdit}
        />
        <Icon
          name={name}
          x={1}
          y={0}
          data={FileOutlinedPath}
          backgroundWidth={22}
          backgroundHeight={22}
          fill={colors.textBrandDefault}
          onMouseEnter={() => setHover(true)}
          onMouseOut={() => setHover(false)}
          onMouseDown={handleEdit}
          onTap={handleEdit}
        />
        <Text x={x + 13} y={y - 5} height={height} text={text} fill={colors.textBrandDefault} fontSize={13} />
      </Group>
    );
  };

  return (
    <CellScrollContainer
      x={x}
      y={y}
      columnWidth={columnWidth}
      rowHeight={rowHeight}
      fieldId={fieldId}
      recordId={recordId}
      renderData={{} as IRenderData}
    >
      {(operatingEnable && renderContent == null) ? editable ? (
        <>
          <Icon
            name={name}
            x={GRID_CELL_VALUE_PADDING}
            y={5}
            data={AddOutlinedPath}
            shape={'circle'}
            backgroundWidth={22}
            backgroundHeight={22}
            background={isHover ? colors.rowSelectedBgSolid : 'transparent'}
            onMouseEnter={() => setHover(true)}
            onMouseOut={() => setHover(false)}
            onClick={toggleEdit}
            onTap={toggleEdit}
          />
          <Text
            x={GRID_OPTION_ITEM_PADDING + GRID_CELL_ADD_ITEM_BUTTON_SIZE}
            y={16}
            height={height}
            text={t(Strings.workdoc_create)}
            fontSize={13}
            fill={colors.textCommonTertiary}
          />
        </>
      ) : null : renderDoc()}
    </CellScrollContainer>
  );
};
