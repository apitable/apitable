/**
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

import { t, Strings } from '@apitable/core';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  // Block-level elements
  paragraph: t(Strings.paragraph),
  headingOne: t(Strings.heading_one),
  headingTwo: t(Strings.heading_two),
  headingThree: t(Strings.heading_three),
  headingFour: t(Strings.heading_four),
  headingFive: t(Strings.heading_five),
  headingSix: t(Strings.heading_six),
  image: t(Strings.image),
  orderedList: t(Strings.ordered_list),
  unorderedList: t(Strings.unordered_list),
  taskList: t(Strings.task_list),
  quote: t(Strings.quote),
  codeBlockWrap: t(Strings.code_block),
  divider: t(Strings.divider),
  table: t(Strings.table),
  // Inline elements
  link: t(Strings.link),
  italic: t(Strings.italic),
  underLine: t(Strings.under_line),
  strikeThrough: t(Strings.strikethrough),
  bold: t(Strings.bold),
  inlineCode: t(Strings.inline_code),
  mention: t(Strings.mention),
  highlight: t(Strings.highlight),
  // Alignment method
  alignLeft: t(Strings.align_left),
  alignCenter: t(Strings.align_center),
  alignRight: t(Strings.align_right),
  // Other
  ok: t(Strings.submit),
  cancel: t(Strings.cancel),
  text: t(Strings.text),
  edit: t(Strings.edit),
  unlink: t(Strings.unlink),
  placeholder: t(Strings.editor_placeholder),
  commonFormat: t(Strings.common_format),
  insertBelow: t(Strings.insert_below),
  insertAbove: t(Strings.insert_above),
  mediaElement: t(Strings.media_element),
  associatedElement: t(Strings.associated_element),
  addImage: t(Strings.add_image),
  imageSizeError: t(Strings.image_limit, { number: 2 }),
  imageTypeError: t(Strings.support_image_formats),
  imageUploading: t(Strings.image_uploading),
  copySuccess: t(Strings.copy_success),
  copyFailed: t(Strings.copy_failed),
  delete: t(Strings.delete),
  visit: t(Strings.visit),
  linkInputPlaceholder: t(Strings.link_input_placeholder),
};
