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

import { message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { shallowEqual } from 'react-redux';
import { ResourceType, Selectors, Strings, t } from '@apitable/core';
import { Message } from 'pc/components/common';
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
  const hideMsgRef = useRef<() => void>(() => {
    return;
  });

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
    return () => {
      hideMsgRef.current();
      message.destroy();
    };
  }, []);

  useEffect(() => {
    if (!automatic) {
      return;
    }
    hideMsgRef.current();
    message.destroy();
    if (!connected) {
      if (!templateId) {
        hideMsgRef.current = Message.loading({ content: t(Strings.long_time_not_editor) });
      }
      setStatus(Network.Offline);
      return;
    }
    if (IOConnecting) {
      if (!templateId) {
        hideMsgRef.current = Message.warning({ content: t(Strings.network_state_disconnection), maxCount: 1 });
      }
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
