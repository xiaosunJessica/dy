import React, {ReactNode} from 'react';
import './SlideHorizontal.module.less'
interface Props {
  // props types
  children: ReactNode
  dataIndex?: number
}

const SlideItem: React.FC<Props> = ({children, dataIndex}) => {
  return (
    <div
      className={'slide-item'}
      data-index={dataIndex}>
      {children}
    </div>
  );
};

export default SlideItem;