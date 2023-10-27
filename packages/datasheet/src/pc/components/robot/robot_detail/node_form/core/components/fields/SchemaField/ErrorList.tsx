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

import { Typography, useTheme } from '@apitable/components';

interface IErrorListProps {
  errors: string[];
}

export function ErrorList(props: IErrorListProps) {
  const { errors = [] } = props;
  const newErrors = Array.from(new Set(errors));
  const theme = useTheme();
  if (errors.length === 0) {
    return null;
  }
  const onlyOneError = newErrors.length === 1;

  return (
    <div style={{ marginTop: 4 }}>
      {onlyOneError ? (
        <Typography variant="body4" color={theme.color.fc10}>
          {newErrors[0]}
        </Typography>
      ) : (
        <ul
          style={{
            color: theme.color.fc10,
          }}
        >
          {newErrors
            .filter((elem) => !!elem)
            .map((error, index) => {
              return (
                <li key={index}>
                  <Typography variant="body4">{error}</Typography>
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
}
