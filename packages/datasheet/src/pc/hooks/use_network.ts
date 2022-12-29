import { ResourceType, Selectors, Strings, t } from '@apitable/core';
import { Message } from 'pc/components/common';
import { Network } from 'pc/components/network_status';
import { useEffect, useRef, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

export const useNetwork = (automatic = true, resourceId: string, resourceType: ResourceType) => {
  const [status, setStatus] = useState<Network>(Network.Online);
  const { templateId, nodeId } = useSelector(state => state.pageParams);
  const { syncing, connected } = useSelector(state => {
    const resourceNetwork = Selectors.getResourceNetworking(state, resourceId, resourceType);
    if (!resourceNetwork) {
      return {
        syncing: false, connected: false,
      };
    }
    return {
      syncing: resourceNetwork.syncing,
      connected: resourceNetwork.connected,
    };
  }, shallowEqual);
  const { reconnecting: IOConnecting } = useSelector(state => state.space);
  const hideMsgRef = useRef<() => void>(() => { return; });

  useEffect(() => {
    window.parent.postMessage({
      message: 'socketStatus', data: {
        roomId: nodeId,
        status: status
      }
    }, '*');
  }, [status, nodeId]);

  useEffect(() => {
    return () => {
      hideMsgRef.current();
    };
  }, []);

  useEffect(() => {
    if (!automatic) {
      return;
    }
    hideMsgRef.current();
    if (!connected) {
      if (!templateId) {
        hideMsgRef.current = Message.loading({ content: t(Strings.long_time_not_editor), duration: 0 });
      }
      setStatus(Network.Offline);
      return;
    }
    if (IOConnecting) {
      if (!templateId) {
        hideMsgRef.current = Message.warning({ content: t(Strings.network_state_disconnection), duration: 0, maxCount: 1 });
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
