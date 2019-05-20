import React, { Fragment, FunctionComponent, useState } from 'react'

interface Todo {
  text: string
  isClosed: boolean
  isPinned: boolean
  deadline: number
  deadlineDate : string
  deadlineTime : string
  addedTime: number
}

const App: FunctionComponent = () => {
  const [isAll, setIsAll] = useState(true)
  const [items, setItems] = useState<Todo[]>([])
  const [text, setText] = useState('')
  const [isDone, setIsDone] = useState(false)
  const [isSorted, setIsSorted] = useState(false)
  const [deadlineDate, setDeadlineDate] = useState(todayDate())
  const [deadlineTime, setDeadlineTime] = useState('')

  /* アイテム追加時の動作 */
  const onAdd = () => {
    var addedTime = (new Date()).getTime()
    var time = '23:59';
    var date = '2100-12-31'; //日時が入力されなかった場合、ソート時に後ろに持ってくるようにしたいため
    if(deadlineTime === '' && deadlineDate !== undefined){
      date = deadlineDate
    }else if(deadlineTime !== '' && deadlineDate === undefined){
      time = deadlineTime
    }else if(deadlineTime !== '' && deadlineDate !== undefined){
      time = deadlineTime
      date = deadlineDate
    }
    var deadlineString = date.replace(/-/g, '/') + ' ' + time + ':00';
    var deadlineNumber = (new Date(deadlineString)).getTime();
    setItems([...items, { text, isClosed: false , isPinned: false,
                            deadline: deadlineNumber,
                            deadlineDate: deadlineDate,
                            deadlineTime: deadlineTime,
                            addedTime: addedTime}])
    setText('')
    setDeadlineTime('')
    setDeadlineDate(todayDate())
  }

  /* TODO完了時の動作 */
  const onClose = (text: string) => () => {
    const index = items.findIndex(item => item.text === text)
    const _items = [...items]
    _items[index].isClosed = !_items[index].isClosed
    setItems(_items)
  }

  /* TODO削除時の動作 */
  const onDelete = (text: string) => () => {
    const index = items.findIndex(item => item.text === text)
    const _items = [...items]
    _items.splice(index, 1)
    setItems(_items)
  }

  /* ピン追加時の動作 */
  const onPin = (text: string) => () => {
    const index = items.findIndex(item => item.text === text)
    const _items = [...items]
    _items[index].isPinned = !_items[index].isPinned
    setItems(_items)
  }

  /* ソート時の動作 */
  const dateSort = (factor:string) => () => {
    if(factor === 'oldest'){
      items.sort(
        function(a,b) {
          if (a.addedTime > b.addedTime){
             return 1;
          }else if (a.addedTime < b.addedTime){
             return -1;
          }else{
             return 0;
          }
        }
      )
    }else if(factor === 'newest'){
      items.sort(
        function(a,b) {
          if (a.addedTime < b.addedTime){
             return 1;
          }else if (a.addedTime > b.addedTime){
             return -1;
          }else{
             return 0;
          }
        }
      )
    }else if(factor === 'deadline'){
      items.sort(
        function(a,b) {
          if (a.deadline > b.deadline){
             return 1;
          }else if (a.deadline < b.deadline){
             return -1;
          }else{
             return 0;
          }
        }
      )
    }
    setIsSorted(!isSorted);
  }

  /* 現在の状態の取得(不使用) */
  // function showState(){
  //   if(!isAll && isDone){
  //     return 'Done';
  //   }else if(!isAll && !isDone){
  //     return 'Not Done';
  //   }else{
  //     return 'All';
  //   }
  // };

  //今日の日付の取得
  function todayDate(){
    var today = new Date();
    today.setDate(today.getDate());
    var yyyy = today.getFullYear();
    var mm = ("0"+(today.getMonth()+1)).slice(-2);
    var dd = ("0"+today.getDate()).slice(-2);
    return (yyyy + '-' + mm +'-'+ dd);
  }

  return (
    <Fragment>
      <div className='title'>
        <h1>TODO</h1>
      </div>
      <div id='container'>
        <div className='item'>
          <div className='filter'>
            <input type='radio' id='all' name='state' onClick={() => {setIsAll(true)}} checked={isAll}></input>
            <label htmlFor="all" className='tab'>all</label>
            <input type='radio' name='state' id='notDone' onClick={() => {setIsAll(false);setIsDone(false)}}></input>
            <label htmlFor="notDone" className='tab'>not Done</label>
            <input type='radio' name='state' id='done' onClick={() => {setIsAll(false);setIsDone(true)}}></input>
            <label htmlFor="done" className='tab'>Done</label>
          </div>
          <div id='sort'>
            <span>Sort by : </span>
            <button onClick={dateSort('deadline')}>{'deadline'}</button>
            <button onClick={dateSort('newest')}>{'newest'}</button>
            <button onClick={dateSort('oldest')}>{'oldest'}</button>
            <h3 className='item_kind'>Pinned Item</h3>
          </div>
            <ul>
              {items
                .filter(item => (isAll || (isDone && item.isClosed) || (!isDone && !item.isClosed))&& item.isPinned)
                .map(item => (
                  <li key={item.text} className='todo_item'>
                    <span>{item.isClosed ? <del>{item.text}</del> : item.text}</span>
                    {(item.deadlineDate==='' && item.deadlineTime==='')? '': <span><br/>BY:</span>}
                    <span className='marginRight'>{item.deadlineDate}</span>
                    <span>{item.deadlineTime}</span>
                    <br/>

                    <button onClick={onClose(item.text)}>{item.isClosed? 'undo': 'done'}</button>
                    <button onClick={onPin(item.text)}>{'unPin'}</button>
                    <button onClick={onDelete(item.text)} className='deleteButton'>{'x'}</button>
                  </li>
                ))
              }
            </ul>
            <h3 className='item_kind'>Normal Item</h3>
            <ul>
              {items
                .filter(item => (isAll || (isDone && item.isClosed) || (!isDone && !item.isClosed)) && !item.isPinned)
                .map(item => (
                  <li key={item.text} className={item.isClosed ? 'done_item' : 'todo_item'} >
                    <span>{item.isClosed ? <del>{item.text}</del> : item.text}</span>
                    {(item.deadlineDate==='' && item.deadlineTime==='')? '': <span><br/>BY:</span>}
                    <span className='marginRight'>{item.deadlineDate}</span>
                    <span>{item.deadlineTime}</span>
                    <br/>
                    <button onClick={onClose(item.text)}>{item.isClosed? 'undo': 'done'}</button>
                    <button onClick={onPin(item.text)}>{'Pin'}</button>
                    <button onClick={onDelete(item.text)} className='deleteButton'>{'x'}</button>
                  </li>
                ))}
            </ul>
          </div>
          <div className='input'>
            <label>What you should do<br/>
              <input onChange={event => setText(event.target.value)} value={text} id='inputForm'/>
            </label>
            <br/><br/>
            <label>Deadline<br/>
              <input onChange={event => setDeadlineDate(event.target.value)} type='date' value={deadlineDate}/>
              <input onChange={event => setDeadlineTime(event.target.value)} type='time' value={deadlineTime}/>
            </label>
            <br/>
            <button
              disabled={!text || -1 < items.findIndex(item => item.text === text)}
              onClick={onAdd}
              id='addButton'
              className='btn-brackets'
            >
              add
            </button>
          </div>
        </div>
    </Fragment>
  )
}

export default App
