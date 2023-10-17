import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { memberStash } from 'modules/space/member_stash/member_stash';

export const useGetMemberStash = () => {
  const [loading, setLoading] = useState(false);
  const spaceId = useSelector((state) => state.space.activeId);

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
