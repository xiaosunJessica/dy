import React,  { Dispatch, SetStateAction, useRef, useState, useEffect }  from 'react';
import styles from './index.module.less'
import { _css } from '@/utils/dom'
interface Props {
  // props types
 index: number,
 onChangeIndex: Dispatch<SetStateAction<number>>;
 tabTexts: string[]
}

const Tabs: React.FC<Props> = ({
  index,
  onChangeIndex,
  tabTexts
}) => {
  const tabsRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)
  const [lefts, setLefts] = useState<number[]>([])
  // const [indicatorSpace, setIndicatorSpace] = useState(0)
  const change = (index: number) => {
    onChangeIndex(index)
    if (indicatorRef.current) {
      _css(indicatorRef.current, 'transition-duration', `300ms`)
      _css(indicatorRef.current, 'left', lefts[index] + 'px')
    }
  }

   // 初始化 Tabs
  const initTabs = () => {
    if (!tabsRef.current || !indicatorRef.current) return;

    const tabs = tabsRef.current;
    const indicator = indicatorRef.current;

    // 获取指示器的宽度
    const indicatorWidth = parseFloat(window.getComputedStyle(indicator).width);

    const leftsArray: number[] = [];
    for (let i = 0; i < tabs.children.length; i++) {
      const item = tabs.children[i] as HTMLElement;
      const tabWidth = parseFloat(window.getComputedStyle(item).width);
      console.log(indicatorWidth, 'itemitemitem')


      // 计算每个 Tab 的 left 值
      const left =
        item.getBoundingClientRect().x -
        tabs.children[0].getBoundingClientRect().x +
        (tabWidth * 0.5 - indicatorWidth / 2);

      leftsArray.push(left);
    }
    console.log(leftsArray, '9999999')

    setLefts(leftsArray); // 更新 lefts
    // setIndicatorSpace(leftsArray[1] - leftsArray[0]); // 更新 indicatorSpace

    // 设置指示器的样式
    indicator.style.transitionDuration = '300ms';
    indicator.style.left = `${leftsArray[index]}px`;
  };

  // 在组件挂载后执行 initTabs
  useEffect(() => {
    initTabs();
  }, []);

  return (
    <div className={styles["tab-ctn"]}>
      <div className={styles["tabs"]} ref={tabsRef}>
        {
          tabTexts.map((text, idx) => {
            return (
              <div
                className={`${styles['tab']} ${index === idx ? styles['active'] : ''}`}
                onClick={() => change(idx)}
              >
                <span>{text}</span>
              </div>
            )
          })
        }
      </div>
      <div className={styles["indicator"]} ref={indicatorRef}></div>
    </div>
  );
};

export default Tabs;