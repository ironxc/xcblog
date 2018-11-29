import * as React from 'react'
import XSS from 'xss'
function xssfilter (html) {
  const whitelist = Object.assign({},
    XSS.whiteList, {
      a: ['class', 'name', 'href'], //href文章编辑器锚点要用，暂时不过滤
    })
  const xss = new XSS.FilterXSS({
    whiteList: whitelist,
    onIgnoreTagAttr: function (tag, name, value) { // eslint-disable-line
      if (name === 'class' || name === 'style') {
        return name + '="' + XSS.escapeAttrValue(value) + '"'
      }
    },
    onTag: function (tag) { // eslint-disable-line
      if (tag === 'script') {
        return ''
      }
    },
  })
  return xss.process(html)
}

const InnerHtmlXssFilter = (props) => {
  const { children, ...other } = props
  return (
    <div {...other} dangerouslySetInnerHTML={{ __html: xssfilter(children || '') }} />
  )
}

export default InnerHtmlXssFilter
