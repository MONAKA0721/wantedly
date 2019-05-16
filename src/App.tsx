import React, { Fragment, FunctionComponent, useState } from 'react'

interface Todo {
  text: string
  isClosed: boolean
}

const App: FunctionComponent = () => {
  const [isAll, setIsAll] = useState(true)
  const [items, setItems] = useState<Todo[]>([])
  const [text, setText] = useState('')
  const [isDone, setIsDone] = useState(false)
  const onAdd = () => {
    setItems([...items, { text, isClosed: false }])
    setText('')
  }
  const onClose = (text: string) => () => {
    const index = items.findIndex(item => item.text === text)
    const _items = [...items]
    _items[index].isClosed = !_items[index].isClosed
    setItems(_items)
  }
  const onDelete = (text: string) => () => {
    const index = items.findIndex(item => item.text === text)
    const _items = [...items]
    _items.splice(index, 1)
    setItems(_items)
  }



  function showState(){
    if(!isAll && isDone){
      return 'Done';
    }else if(!isAll && !isDone){
      return 'Not Done';
    }else{
      return 'All';
    }
  }
  return (
    <Fragment>
      <div>
        <input onChange={event => setText(event.target.value)} value={text} />
        <button
          disabled={!text || -1 < items.findIndex(item => item.text === text)}
          onClick={onAdd}
        >
          add
        </button>
      </div>
      <div>
        <button onClick={() => {setIsAll(true)}}>ALL</button>
        <button onClick={() => {setIsAll(false);setIsDone(false)}}>Not Done</button>
        <button onClick={() => {setIsAll(false);setIsDone(true)}}>Done</button>
      </div>
      <h1>{showState()}</h1>
      <ul>
        {items
          .filter(item => isAll || (isDone && item.isClosed) || (!isDone && !item.isClosed))
          .map(item => (
            <li key={item.text}>
              <span>{item.isClosed ? <del>{item.text}</del> : item.text}</span>
              <button onClick={onClose(item.text)}>{'done'}</button>
              <button onClick={onDelete(item.text)}>{'x'}</button>
            </li>
          ))}
      </ul>
    </Fragment>
  )
}

export default App
