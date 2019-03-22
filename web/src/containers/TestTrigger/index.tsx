import * as React from 'react'
import { findDOMNode, createPortal } from 'react-dom'
export default class T extends React.Component {
  render() {
    return (
      <div>
        <Trigger>
          <div style={{ width: 400, height: 400, backgroundColor: 'red' }} />
        </Trigger>
      </div>
    )
  }
}
interface TriggerProps {
  children?: any
}
interface TriggerState {
  visible: boolean
  bodyStyle: React.CSSProperties
}
class Trigger extends React.Component<TriggerProps, TriggerState> {
  state: TriggerState = {
    visible: false,
    bodyStyle: { position: 'fixed', width: 100, height: 100, top: 200, left: 200, backgroundColor: 'blue' },
  }
  onClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    if(this.state.visible) {
      return this.setState({
        visible: false,
      })
    }
    this.setState({
      visible: true,
      bodyStyle: {
        ...this.state.bodyStyle,
        left: event.pageX,
        top: event.pageY,
      },
    })
  }
  onDocumentClick = (event: Event) => {
    const target = event.target
    const root = findDOMNode(this)
    if (!include(root, target)) {
      this.setState({
        visible: false,
      })
    }
  }
  componentDidMount() {
    document.addEventListener('click', this.onDocumentClick)
  }
  render () {
    const { children } = this.props
    const { visible, bodyStyle } = this.state
    return <React.Fragment>
      <div onClick={this.onClick} style={{ display: 'inline-block' }}>
        {children}
      </div>
      {visible && createPortal(<TriggerBody style={bodyStyle} />, document.body)}
    </React.Fragment>
  }
}
interface BodyProps {
  style: React.CSSProperties
}
class TriggerBody extends React.Component<BodyProps, {}> {
  render() {
    return (
      <div style={this.props.style}>
        弹出
      </div>
    )
  }
}
export function include(root: any, n: any) {
  let node = n
  while (node) {
    if (node === root) {
      return true
    }
    node = node.parentNode
  }

  return false
}
