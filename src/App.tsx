import React, { Fragment, FunctionComponent, useState } from 'react'

interface Todo {
  text: string
  isClosed: boolean
  isPinned: boolean
  // action: string
}

const App: FunctionComponent = () => {
  const [isAll, setIsAll] = useState(true)
  const [items, setItems] = useState<Todo[]>([])
  const [text, setText] = useState('')
  const [isDone, setIsDone] = useState(false)
  const onAdd = () => {
    setItems([...items, { text, isClosed: false , isPinned: false}])
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
  const onPin = (text: string) => () => {
    const index = items.findIndex(item => item.text === text)
    const _items = [...items]
    _items[index].isPinned = !_items[index].isPinned
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
      <div className='title'>
        <h1>TODO</h1>
      </div>
      <div className='input'>
        <input onChange={event => setText(event.target.value)} value={text} />
        <button
          disabled={!text || -1 < items.findIndex(item => item.text === text)}
          onClick={onAdd}
        >
          add
        </button>
      </div>
      <div className='item'>
      <div className='filter'>
        <input type='radio' id='all' name='state' onClick={() => {setIsAll(true)}}></input>
        <label htmlFor="all" className='tab'>all</label>
        <input type='radio' name='state' id='notDone' onClick={() => {setIsAll(false);setIsDone(false)}}></input>
        <label htmlFor="notDone" className='tab'>not Done</label>
        <input type='radio' name='state' id='done' onClick={() => {setIsAll(false);setIsDone(true)}}></input>
        <label htmlFor="done" className='tab'>Done</label>
      </div>
      <h2 className='state'>State:{showState()}</h2>

        <h3 className='item_kind'>Pinned Item</h3>
        <ul>
          {items
            .filter(item => (isAll || (isDone && item.isClosed) || (!isDone && !item.isClosed))&& item.isPinned)
            .map(item => (
              <li key={item.text}>
                <span>{item.isClosed ? <del>{item.text}</del> : item.text}</span>
                <button onClick={onClose(item.text)}>{item.isClosed? 'undo': 'done'}</button>
                <button onClick={onDelete(item.text)}>{'x'}</button>
                <button onClick={onPin(item.text)}>{'unPin'}</button>
              </li>
            ))
          }
        </ul>
        <h3 className='item_kind'>Normal Item</h3>
        <ul>
          {items
            .filter(item => (isAll || (isDone && item.isClosed) || (!isDone && !item.isClosed)) && !item.isPinned)
            .map(item => (
              <li key={item.text}>
                <span>{item.isClosed ? <del>{item.text}</del> : item.text}</span>
                <button onClick={onClose(item.text)}>{item.isClosed? 'undo': 'done'}</button>
                <button onClick={onDelete(item.text)}>{'x'}</button>
                <button onClick={onPin(item.text)}>{'Pin'}</button>
              </li>
            ))}
        </ul>
      </div>
    </Fragment>
  )
}

export default App
