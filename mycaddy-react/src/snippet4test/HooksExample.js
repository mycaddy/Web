import React, { useState, useEffect } from 'react'

const HooksExample = () => {
  const [value, setValue] = useState(0)
  const [name, setName] = useState('')
  const [nickname, setNickname] = useState('')
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    console.log('useEffect', 'When any state changed', { value, name, nickname, visible })
    return () => {
      console.log('userEffect', 'when before any state changed')
    }
  })

  useEffect(() => {
    console.log('useEffect', 'Only Mounted')
  }, [])
  
  useEffect(() => {
    console.log('useEffect', 'Only name changed', name)
  }, [ name ])



  const onChangeName = e => {
    setName(e.target.value)
  }

  return (
    <div>
      <div>
        <button onClick={ () => {setVisible(!visible)} }>{ visible ? 'HIDE' : 'SHOW' }</button>
      </div>
      {visible && (
      <>  
        <div>
          <input value={name} onChange={onChangeName} />
          <input value={nickname} onChange={ e => setNickname(e.target.value) } />
        </div>
        <div>
          <div><strong>이름:</strong>{name}</div>
          <div><strong>별명:</strong>{nickname}</div>        
        </div>
        <div>
          <p>
            현재 카운터 값은 <b>{value}</b> 입니다.
          </p>
          <button onClick={() => setValue(value + 1)}>+ 1</button> 
          <button onClick={() => setValue(value - 1)}>- 1</button>   
        </div>
      </>
      )}
    </div>
  )
}

export default HooksExample

