import React, { useState } from 'react';
import SlideVerticalInfinite from './SlideVerticalInfinite';
interface Props {
  // props types
  api: (params: Record<string, any>) => Promise<any>;
  active: boolean
}

const SlideList: React.FC<Props> = (props) => {
  const [state, setState] = useState({
    list: [],
    totalSize: 0,
    pageSize: 10,
    index: 0,
  })

  const loadMore = () => {
    getData()
  }

  const getData = async (refresh = false) => {
    if (!refresh && state.totalSize === state.list.length) return

    let res = await props.api({
      start: refresh ? 0 : state.list.length,
      pageSize: state.pageSize
    })

    console.log(res, '000000')

    if (res.success) {
      setState((prevState) => ({
        ...prevState,
        totalSize: res.data.total,
        list: refresh ? [] : prevState.list.concat(res.data.list)
      }))
    }
  }
  return (
    <SlideVerticalInfinite
      index={0}
      list={[]}
      active={props.active}
      virtualTotal={3}
      onLoadMore={loadMore}
      onRefresh={() => getData(true)}>
    </SlideVerticalInfinite>
  );
};

export default SlideList;