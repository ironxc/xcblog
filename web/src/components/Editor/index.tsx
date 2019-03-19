import * as React from 'react'
import classnames from 'classnames'
import * as SlateR from 'slate-react'
import { Value, SchemaProperties } from 'slate'
import renderNode from './RenderNode'
import renderMark from './RenderMark'
import HoverMenu from './HoverMenu'
import SuggestionMenu from './SuggestionMenu'
import { onKeyDown } from './editorAction'

const schema: SchemaProperties = {
  blocks: {
    'split-line': {
      isVoid: true,
    },
    'image-block': {
      isVoid: true,
    },
  },
}
interface OuterProps {
  onChange: (val: Value) => void
  value: Value
}
class Edit extends React.Component<OuterProps, {}>{
  editor: any
  onChange = ({ value }: { value: Value }) => {
    this.props.onChange(value)
  }
  renderEditor = (props: any, editor: any, next: () => any) => {
    const children = next()
    return (
      <React.Fragment>
        {children}
        <HoverMenu editor={editor} value={this.props.value} />
        <SuggestionMenu editor={editor} value={this.props.value} />
      </React.Fragment>
    )
  }
  innerRef = (editor: any) => {
    this.editor = editor
  }
  render() {
    const { value } = this.props
    const styles = require('./index.scss')
    return (
      <div className={classnames('markdown-body', styles.editor)}>
        <SlateR.Editor
          placeholder="Write Something..."
          value={value}
          onKeyDown={onKeyDown}
          renderNode={renderNode}
          renderMark={renderMark}
          onChange={this.onChange}
          renderEditor={this.renderEditor}
          ref={this.innerRef}
          schema={schema}
        />
      </div>
    )
  }
}

export default Edit