// Create reference instance
const myMarked = require('marked')
const hljs = require('highlight.js')

export function ParseMardown (data) {
  const renderer = new myMarked.Renderer()
  let parsedData = null
  let dir = []
  renderer.heading = function (text, level) {
    if(level <= 1 || level >= 5) {
      return ` <h${level}>
        ${text}
      </h${level}>`
    }
    dir.push({
      text,
      level: level - 1,
    })
    return `
      <h${level} id=heading----${dir.length}>
        ${text}
      </h${level}>`
  }
  // Set options
  myMarked.setOptions({
    renderer: renderer,
    highlight: function (code) {
      return hljs.highlightAuto(code).value
    },
  })
  parsedData = myMarked(data)
  return {
    parsedData,
    dir,
  }
}
export function isMobile (userAgent) {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    userAgent || window.navigator.userAgent
  )
}