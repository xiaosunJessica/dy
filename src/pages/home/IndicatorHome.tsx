import React,  { Dispatch, SetStateAction, useRef, useState, useEffect }  from 'react';
import styles from './IndicatorHome.module.less'
import { Icon } from '@iconify-icon/react';
import { _css } from '@/utils/dom'
interface Props {
  // props types
 index: number,
 onChangeNavIndex: Dispatch<SetStateAction<number>>;
}

const IndicatorHome: React.FC<Props> = ({
  index,
  onChangeNavIndex
}) => {
  const tabsRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)
  const [lefts, setLefts] = useState<number[]>([])
  // const [indicatorSpace, setIndicatorSpace] = useState(0)
  const change = (index: number) => {
    onChangeNavIndex(index)
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
    <div className={styles['indicator-home']}>
      <div className={styles['toolbar']}>
       <Icon
        icon="tabler:menu-deep"
        className="search"
        style={{ transform: 'rotateY(180deg)' }}
        />
        <div className={styles["tab-ctn"]}>
          <div className={styles["tabs"]} ref={tabsRef}>
            <div
              className={`${styles['tab']} ${index === 0 ? styles['active'] : ''}`}
              onClick={() => change(0)}
            >
              <span>热点</span>
            </div>
            <div
              className={`${styles['tab']} ${index === 1 ? styles['active'] : ''}`}
              onClick={() => change(1)}
            >
              <span>长视频</span>
            </div>
            <div
              className={`${styles['tab']} ${index === 2 ? styles['active'] : ''}`}
              onClick={() => change(2)}
            >
              <span>关注</span>
              {/* <img src={liveIcon} alt="live" className="tab2-img" /> */}
            </div>
            <div
              className={`${styles['tab']} ${index === 3 ? styles['active'] : ''}`}
              onClick={() => change(3)}
            >
              <span>经验</span>
            </div>
            <div
              className={`${styles['tab']} ${index === 4 ? styles['active'] : ''}`}
              onClick={() => change(4)}
            >
              <span>推荐</span>
            </div>
          </div>
         <div className={styles["indicator"]} ref={indicatorRef}></div>
        </div>
        <Icon
          icon="ion:search"
          className="search"
        />
      </div>
    </div>
  );
};

export default IndicatorHome;