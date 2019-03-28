import React, { useState, useEffect } from 'react'
const styles = require('./index.scss')
const na: string = 'aaa'
const co: number = 0
const Test = () => {
  const [count, setCount] = useState(co)
  const [name, setName] = useState(na)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }
  useEffect(() => {
    document.title = name
  })
  return (
    <div className={styles.test} key="aa">
      <p>You clicked {count} times</p>
      <button onClick={() => setCount((c: number) => (c + 1))}>
        Click me
      </button>
      <h1>{name}</h1>
      <input onChange={handleChange} />
    </div>
  )
}
export default Test
