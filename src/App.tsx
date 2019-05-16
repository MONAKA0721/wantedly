import React, { Fragment, FunctionComponent, useState } from 'react'

interface Todo {
  text: string
  isClosed: boolean
}

const App: FunctionComponent = () => {
  const [isAll, setIsAll] = useState(true)
  const [items, setItems] = useState<Todo[]>([])
  const [text, setText] = useState('')
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
        <button onClick={() => setIsAll(true)}>ALL</button>
        <button onClick={() => setIsAll(false)}>Not Done</button>
      </div>
      <ul>
        {items
          .filter(item => isAll || !item.isClosed)
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
