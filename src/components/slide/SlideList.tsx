import React, { useState } from 'react';
import SlideVerticalInfinite from './SlideVerticalInfinite';
import { slideItemRender } from '@/utils';
interface Props {
  // props types
  api: (params: Record<string, any>) => Promise<any>;
  active: boolean,
  uniqueId: string
  cbs?: any
}

const SlideList: React.FC<Props> = (props) => {
  const [state, setState] = useState<{
    list: any[],
    totalSize: number,
    pageSize: number,
    index: number,
  }>({
    list: [],
    totalSize: 0,
    pageSize: 1,
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

    if (res.success) {
      setState((prevState) => {
        let list = prevState.list
        if (refresh) {
          list = []
        }

        list = state.list.concat(res.data.list)

        console.log(list, '099999')
        return ({
          ...prevState,
          totalSize: res.data.total,
          list: list
        })
      })
    }
  }

  const render = slideItemRender({ ...props.cbs })
  return (
    <SlideVerticalInfinite
      index={0}
      list={state.list}
      active={props.active}
      virtualTotal={3}
      onLoadMore={loadMore}
      onRefresh={() => getData(true)}
      uniqueId={props.uniqueId}
      render={render}>
    </SlideVerticalInfinite>
  );
};

export default SlideList;