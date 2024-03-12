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

import { useEffect, useState } from 'react';
import { shallowEqual } from 'react-redux';
import { ResourceType, Selectors } from '@apitable/core';
import { Network } from 'pc/components/network_status';

import { useAppSelector } from 'pc/store/react-redux';

export const useNetwork = (automatic = true, resourceId: string, resourceType: ResourceType) => {
  const [status, setStatus] = useState<Network>(Network.Online);
  const { templateId, nodeId } = useAppSelector((state) => state.pageParams);
  const { syncing, connected } = useAppSelector((state) => {
    const resourceNetwork = Selectors.getResourceNetworking(state, resourceId, resourceType);
    if (!resourceNetwork) {
      return {
        syncing: false,
        connected: false,
      };
    }
    return {
      syncing: resourceNetwork.syncing,
      connected: resourceNetwork.connected,
    };
  }, shallowEqual);
  const { reconnecting: IOConnecting } = useAppSelector((state) => state.space);

  useEffect(() => {
    window.parent.postMessage(
      {
        message: 'socketStatus',
        data: {
          roomId: nodeId,
          status: status,
        },
      },
      '*',
    );
  }, [status, nodeId]);

  useEffect(() => {
    if (!automatic) {
      return;
    }

    if (!connected) {
      setStatus(Network.Offline);
      return;
    }
    if (IOConnecting) {
      setStatus(Network.Loading);
      return;
    }
    if (syncing) {
      setStatus(Network.Sync);
      return;
    }
    setStatus(Network.Online);
  }, [syncing, connected, IOConnecting, automatic, templateId]);

  if (!automatic) {
    return {
      status,
      setStatus,
    };
  }
  return {
    status,
  };
};
