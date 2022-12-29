import { RecordType } from 'pc/components/expand_record/expand_record.enum';

export interface IExpandRecordDatasheetProp {
  onClose?: () => void;
}

export interface IExpandRecordIndependentProp {
  recordIds: string[];
  datasheetId: string;
  activeRecordId?: string;
  viewId?: string;
  onClose?: () => void;
  forceCenter?: boolean;
}

export interface IPaneIconProps {
  active: boolean;
  onClick: () => void;
}

export interface IExpandRecordWrapperProp {
  recordType: RecordType;
  modalClose: () => void;
  recordIds: string[];
  nodeId: string;
  activeRecordId?: string;
  viewId?: string;
  onClose?: () => void;
}

export interface IExpandRecordComponentProp extends IExpandRecordIndependentProp {
  recordType: RecordType;
  modalClose: () => void;
  activeRecordId: string;
  switchRecord: (index: number) => void;
  mirrorId?: string;
  pageParamsRecordId?: string;
}

export interface IExpandRecordInnerProp extends IExpandRecordIndependentProp {
  recordType: RecordType;
}
