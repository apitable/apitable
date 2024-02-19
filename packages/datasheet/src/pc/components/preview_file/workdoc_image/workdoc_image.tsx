import * as React from 'react';
import { createPortal } from 'react-dom';
import { IWorkdocImage, WorkdocImagePortal } from './portal';

export const WorkdocImage = (props: IWorkdocImage) => {

  const parent = document.getElementById('workdocImage');

  if (!parent) {
    return null;
  }

  return createPortal((
    <WorkdocImagePortal {...props} />
  ), parent);
};