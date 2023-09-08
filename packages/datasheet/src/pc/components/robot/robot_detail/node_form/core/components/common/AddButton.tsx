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

import * as React from 'react';
import IconButton from './IconButton';

type IAddButtonProps = {
  className: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled: boolean;
};

export default function AddButton({ className, onClick, disabled }: IAddButtonProps) {
  return (
    <div className="row">
      <p className={`col-xs-3 col-xs-offset-9 text-right ${className}`}>
        <IconButton type="info" icon="plus" className="btn-add col-xs-12" aria-label="Add" tabIndex="0" onClick={onClick} disabled={disabled} />
      </p>
    </div>
  );
}
