import * as React from 'react'
import * as SlateR from 'slate-react'
import * as Slate from 'slate'
import renderNode from './RenderNode'
import renderMark from './RenderMark'
import classnames from 'classnames'

interface OuterProps {
  value: string
  style?: React.CSSProperties
}
export default class View extends React.Component<OuterProps, {}> {
  stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation()
  }
  render() {
    const styles = require('./index.scss')
    let { value, style } = this.props
    return (<div className={classnames('markdown-body', styles.editor)} onClick={this.stopPropagation} style={style}>
      <SlateR.Editor
        readOnly
        renderNode={renderNode}
        renderMark={renderMark}
        value={Slate.Value.fromJSON(JSON.parse(value))}
      />
    </div>)
  }
}
