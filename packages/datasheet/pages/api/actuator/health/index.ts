import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Health Check API
 * @param _req
 * @param res
 */
export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<ActuatorHandler>
) {
  return res.status(200).json(responseData);
}

type ActuatorHandler = {
  env: string | undefined
  version: string | undefined
};

const responseData = {
  env: process.env.ENV,
  version: process.env.WEB_CLIENT_VERSION
};
