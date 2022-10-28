import { IUseSelectProps } from '../../hooks/use_select_index';
import { useSelectIndex } from 'pc/hooks';
interface IUseListInteractive {
  activeItemClass: string;
}

type IUnionProps = IUseSelectProps & IUseListInteractive;

export const useListInteractive = (options: IUnionProps) => {
  const { activeItemClass } = options;
  const { index: activeIndex, setIndex: setActiveIndex } = useSelectIndex({ ...options, activeItemClass: `.${activeItemClass}` });

  // TODO: Consider how to combine Hover and keyboard events, and combine the two classes into one
  // const onHoverListItem = (e: React.MouseEvent) => {
  //   const element = e.currentTarget;
  //   const classList = element.classList;
  //   if (!classList.contains(activeItemClass)) {
  //     classList.add(activeItemClass);
  //     const index = (e.currentTarget as HTMLElement).dataset.tabIndex;
  //     index && setActiveIndex(parseInt(index, 10));
  //   }
  // };

  // const onOutListItem = (e: React.MouseEvent) => {
  //   const element = e.currentTarget;
  //   const classList = element.classList;
  //   if (classList.contains(activeItemClass)) {
  //     classList.remove(activeItemClass);
  //     const index = (e.currentTarget as HTMLElement).dataset.tabIndex;
  //     index && setActiveIndex(parseInt(index, 10));
  //   }
  // };

  return {
    activeIndex: activeIndex,
    setActiveIndex: setActiveIndex,
    // onHoverListItem: onHoverListItem,
    // onOutListItem: onOutListItem,
  };
};