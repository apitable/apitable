import { memberStash } from 'modules/space/member_stash/member_stash';
import { useEffect, useState } from 'react';
import { useAppSelector } from 'pc/store/react-redux';

export const useGetMemberStash = () => {
  const [loading, setLoading] = useState(false);
  const spaceId = useAppSelector((state) => state.space.activeId);

  useEffect(() => {
    const getMemberList = async () => {
      if (!spaceId) return;
      if (memberStash.hasCacheId(spaceId)) return;
      setLoading(true);
      await memberStash.loadMemberList(spaceId);
      setLoading(false);
    };

    getMemberList();
  }, [spaceId]);

  return {
    loading,
    memberStashList: memberStash.getMemberStash(),
  };
};
