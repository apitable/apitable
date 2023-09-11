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

import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Health Check API
 * @param _req
 * @param res
 */
export default function handler(_req: NextApiRequest, res: NextApiResponse<ActuatorHandler>) {
  return res.status(200).json(responseData);
}

type ActuatorHandler = {
  env: string | undefined;
  version: string | undefined;
};

const responseData = {
  env: process.env.ENV,
  version: process.env.WEB_CLIENT_VERSION,
};
