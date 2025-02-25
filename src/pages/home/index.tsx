import React from 'react';
import styles from './index.module.less'
interface Props {
  // props types
}

const ComponentName: React.FC<Props> = ({}) => {
  return (
    <div className={styles['test-slide-wrapper']} id="home-index">
      123
    </div>
  );
};

export default ComponentName;