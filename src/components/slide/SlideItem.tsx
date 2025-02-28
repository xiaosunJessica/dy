import React, {ReactNode} from 'react';
import styles from  './SlideHorizontal.module.less'
interface Props {
  // props types
  children: ReactNode
}

const SlideItem: React.FC<Props> = ({children}) => {
  return (
    <div className={styles['slide-item']} onClick={() => console.log('item')}>
      {children}
    </div>
  );
};

export default SlideItem;