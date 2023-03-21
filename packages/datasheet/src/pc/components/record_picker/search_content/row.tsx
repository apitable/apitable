import React, { memo } from 'react';
import { useTheme } from '@apitable/components';
import { ListChildComponentProps } from 'react-window';
import { RecordCard } from './record_card';
import { RecordCardWrapper } from './styled';

export const Row: React.FC<ListChildComponentProps> = memo(props => {
  const { index, data, style } = props;
  const { color } = useTheme();

  const {
    rows,
    columns,
    fieldMap,
    focusIndex,
    selectedSet,
    datasheetId,
    onClick,
  } = data;
  const row = rows[index];
  const recordId = row.recordId;
  const isFocus = focusIndex === index;
  const isSelected = selectedSet.has(recordId);

  return (
    <div 
      key={recordId} 
      style={style}
    >
      <RecordCardWrapper
        isSelected={isSelected}
      >
        <RecordCard
          row={row}
          columns={columns}
          fieldMap={fieldMap}
          datasheetId={datasheetId}
          style={{ 
            backgroundColor: isFocus ? color.bgWarnLightHover : color.fill0
          }}
          onClick={onClick}
        />
      </RecordCardWrapper>
    </div>
  );
});
