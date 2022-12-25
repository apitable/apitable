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

import { Label } from './Label';
import { WrapIfAdditional } from './WrapIfAdditional';

export function DefaultTemplate(props: any) {
  const {
    id,
    label,
    children,
    errors,
    help,
    description,
    hidden,
    required,
    displayLabel,
  } = props;
  if (hidden) {
    return <div className="hidden">{children}</div>;
  }

  return (
    <WrapIfAdditional {...props}>
      {displayLabel && <Label label={label} required={required} id={id} />}
      {displayLabel && description ? description : null}
      {children}
      {errors}
      {help}
    </WrapIfAdditional>
  );
}

// if (process.env.NODE_ENV !== "production") {
//   DefaultTemplate.propTypes = {
//     id: PropTypes.string,
//     classNames: PropTypes.string,
//     label: PropTypes.string,
//     children: PropTypes.node.isRequired,
//     errors: PropTypes.element,
//     rawErrors: PropTypes.arrayOf(PropTypes.string),
//     help: PropTypes.element,
//     rawHelp: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
//     description: PropTypes.element,
//     rawDescription: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
//     hidden: PropTypes.bool,
//     required: PropTypes.bool,
//     readonly: PropTypes.bool,
//     displayLabel: PropTypes.bool,
//     fields: PropTypes.object,
//     formContext: PropTypes.object,
//   };
// }

// DefaultTemplate.defaultProps = {
//   hidden: false,
//   readonly: false,
//   required: false,
//   displayLabel: true,
// };
