import { useToggle } from 'ahooks';

// To be compatible with ahooks-v2.
// - see: https://ahooks.js.org/hooks/use-toggle
// - toggle no longer accepts parameters
// - Added set

export default function useToggleOrSet(
  defaultValue: boolean = false
): [boolean, { toggle: (defaultValue?: boolean) => void }] {
  const [state, { toggle, set }] = useToggle(defaultValue);

  function toggleOrSet(value?: boolean): void {
    if (value === undefined) {
      toggle();
    } else {
      set(value);
    }
  }

  return [state, { toggle: toggleOrSet }];
}
