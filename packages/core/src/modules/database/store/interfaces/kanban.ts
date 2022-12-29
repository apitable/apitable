import { KanbanStyleKey } from '../../../shared/store/constants';
import { HiddenGroupMap } from './resource';

interface ISetKanbanCoverFieldId {
  styleKey: KanbanStyleKey.CoverFieldId;
  styleValue: string | null;
}
interface ISetKanbanIsCoverFit {
  styleKey: KanbanStyleKey.IsCoverFit;
  styleValue: boolean | null;
}
interface ISetKanbanIsColNameVisible {
  styleKey: KanbanStyleKey.IsColNameVisible;
  styleValue: boolean | null;
}

interface ISetHiddenGroupMap {
  styleKey: KanbanStyleKey.HiddenGroupMap;
  styleValue: HiddenGroupMap | null;
}

interface ISetBoardField {
  styleKey: KanbanStyleKey.KanbanFieldId;
  styleValue: string | null;
}

export type ISetKanbanStyleValue = ISetKanbanCoverFieldId | ISetKanbanIsCoverFit | ISetBoardField | ISetKanbanIsColNameVisible | ISetHiddenGroupMap;