import { useProviderTheme } from 'hooks';
import React from 'react';
import styled from 'styled-components';

const LoadingSvg = styled.svg`
  margin: auto; 
  background: none; 
  display: block; 
  shape-rendering: auto;
`;

export const Loading = ({ currentColor = false, strokeWidth = 3 }: { currentColor?: boolean; strokeWidth?: number }) => {
  const theme = useProviderTheme();
  const fontColor = currentColor ? 'currentColor' : theme.palette.primary;
  return (
    <LoadingSvg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid" width="1em" height="1em">
      <circle cx="12" cy="12" fill="none" stroke={fontColor} strokeWidth={strokeWidth} r="10" strokeDasharray="45 35">
        <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 12 12 ;360 12 12" keyTimes="0;1" />
      </circle>
    </LoadingSvg>
  );
};