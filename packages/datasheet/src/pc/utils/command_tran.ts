
import { Strings, t, CollaCommandName } from '@apitable/core';

export const CollaCommandTran = {
  [CollaCommandName.SetRecords]: t(Strings.command_set_record),
  [CollaCommandName.AddRecords]: t(Strings.command_add_record),
  [CollaCommandName.SetFieldAttr]: t(Strings.command_set_field_attr),
  [CollaCommandName.DeleteField]: t(Strings.command_delete_field),
  [CollaCommandName.PasteSetRecords]: t(Strings.command_paste_set_record),
  [CollaCommandName.Rollback]: t(Strings.command_rollback),
  [CollaCommandName.InsertComment]: t(Strings.command_insert_comment),
  [CollaCommandName.AddFields]: t(Strings.command_set_record),
  [CollaCommandName.FillDataToCells]: t(Strings.command_paste_set_record),
  [CollaCommandName.MoveRow]: t(Strings.command_move_row),
  [CollaCommandName.DeleteRecords]: t(Strings.command_delete_record),
  'UNDO:SetRecords': t(Strings.command_undo_set_record),
  'UNDO:AddRecords': t(Strings.command_undo_add_record),
  'UNDO:SetFieldAttr': t(Strings.command_undo_set_field_attr),
  'UNDO:DeleteField': t(Strings.command_undo_delete_field),
  'UNDO:DeleteRecords': t(Strings.command_undo_delete_records),
  'UNDO:PasteSetRecords': t(Strings.command_undo_paste_set_record),
  'UNDO:Rollback': t(Strings.command_undo_rollback),
  'UNDO:AddFields': t(Strings.command_undo_set_record),
  'UNDO:FillDataToCells': t(Strings.command_undo_paste_set_record),
  'UNDO:MoveRow': t(Strings.command_undo_move_row),
};

export const commandTran = (cmd: string) => {
  return CollaCommandTran[cmd] || cmd;
};