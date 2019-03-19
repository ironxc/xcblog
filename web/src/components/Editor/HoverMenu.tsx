
import * as React from 'react'
import { createPortal } from 'react-dom'

interface OuterProps {
  value: any
  editor: any
}
type Button = {
  type: string
  icon: string
}
const Buttons: Button[] = [
  { type: 'bold', icon: 'iconfont iconeditor-bold' },
  { type: 'italic', icon: 'iconfont iconeditor-italic' },
  { type: 'underline', icon: 'iconfont iconeditor-underline'},
]
export default class HoverMenu extends React.Component<OuterProps, {}> {
  menu: any
  componentDidUpdate = () => {
    this.updateHoverMenu()
  }
  innerRef = (menu: any) => {
    this.menu = menu
  }
  updateHoverMenu = () => {
    const menu = this.menu
    if (!menu) return

    const { value } = this.props
    const { fragment, selection } = value

    if (selection.isBlurred || selection.isCollapsed || fragment.text === '') {
      menu.removeAttribute('style')
      return
    }

    const native = window.getSelection()
    const range = native.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    menu.style.opacity = 1
    menu.style.top = `${rect.top + window.pageYOffset - menu.offsetHeight}px`

    menu.style.left = `${rect.left +
      window.pageXOffset -
      menu.offsetWidth / 2 +
      rect.width / 2}px`
  }
  render () {
    const root: HTMLElement | null = window.document.getElementById('root')
    if (root) {
      return createPortal(
        <Menu editor={this.props.editor} innerRef={this.innerRef} />,
        root
      )
    }
    return null
  }
}

interface MenuProps {
  innerRef: (menu: any) => any
  editor: any
}
class Menu extends React.Component<MenuProps,{}>{
  onClickMark(event: any, type: any) {
    const { editor } = this.props
    event.preventDefault()
    editor.toggleMark(type)
  }
  renderButton(type: string, icon: string) {
    const { value } = this.props.editor
    const styles = require('./index.scss')
    const isActive = value.activeMarks.some((mark: any) => mark.type == type)
    return (
      <span className={isActive ? styles.active : ''}
        onMouseDown={event => this.onClickMark(event, type)} key={type}>
        <i className={icon} />
      </span>
    )
  }
  render() {
    const styles = require('./index.scss')
    return (
      <div className={styles.editorHoverMenu} ref={this.props.innerRef}>
        {Buttons.map((b: Button) => (this.renderButton(b.type, b.icon)))}
      </div>
    )
  }
}