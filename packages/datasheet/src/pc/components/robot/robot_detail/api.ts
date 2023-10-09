
import { Atom, atom } from 'jotai';
import { loadable } from 'jotai/utils';

interface LoadableWithDefault {
    <Value>(anAtom: Atom<Value>): Atom<Awaited<{
        loading: boolean;
        data:Value
    }>>;
    <Value, Default>(anAtom: Atom<Value>, defaultValue: Default): Atom<Awaited<{
        loading: boolean;
        data:Value| Default
    }>>
}

export const loadableWithDefault = ((anAtom: Atom<unknown>, defaultValue = undefined) => {
  const loadableAtom = loadable(anAtom);

  return atom((get) => {
    const now = get(loadableAtom);

    if (now.state === 'loading') return {
      loading: true,
      data: defaultValue
    };
    if (now.state === 'hasData') return {
      loading: false,
      data: now.data
    };
    return {
      loading: false,
      data: defaultValue
    };
  });
}) as LoadableWithDefault;
