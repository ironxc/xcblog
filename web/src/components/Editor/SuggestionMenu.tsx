import React, { ChangeEvent } from 'react'
import { createPortal } from 'react-dom'
// import { getActiveMark } from './editorAction'
import R from 'utils/request'
interface OuterProps {
  value: any
  editor: any
}
export const CONTEXT_MARK_TYPE = 'mention-context'

const ANCHOR = `.${CONTEXT_MARK_TYPE}`
export default class SuggestionMenu extends React.Component<OuterProps, {}> {
  menu: any
  componentDidUpdate = () => {
    this.updateMenu()
  }
  componentDidMount = () => {
    this.updateMenu()
  }
  updateMenu() {
    const anchor = document.querySelector(ANCHOR)
    if(!this.menu){ return }
    if (!anchor ) {
      this.menu.style.display = 'none'
      return
    }
    const anchorRect = anchor.getBoundingClientRect()
    this.menu.style.display = 'block'
    this.menu.style.left = `${anchorRect.left}px`
    this.menu.style.top = `${anchorRect.bottom}px`
  }
  innerRef = (menu: any) => {
    this.menu = menu
  }
  render() {
    const root: HTMLElement | null = window.document.getElementById('root')
    if (root) {
      return createPortal(
        <Menu
          editor={this.props.editor}
          innerRef={this.innerRef}
          />,
        root
      )
    }
    return null
  }
}

interface MenuProps {
  innerRef: (menu: any) => void
  editor: any
}
class Menu extends React.Component<MenuProps, {} >{
  inputDom?: HTMLInputElement
  upload = (event: ChangeEvent<HTMLInputElement>) => {
    const data = new FormData()
    if (event.target && event.target.files) {
      data.append('image', event.target.files[0])
      R.post('/api/image', data)
        .then(res => {
          this.insertImage(res)
        })
    }
  }
  insertImage = (src: string) => {
    const { editor } = this.props
    const { startBlock } = this.props.editor.value
    if (startBlock.text !== '@') {
      editor
        .moveFocusBackward(1)
        .delete()
        .insertBlock({
          type: 'image-block',
          data: {
            src,
          }
        })
    } else {
      editor
        .moveFocusBackward(1)
        .delete()
        .setBlocks({
          type: 'image-block',
          data: {
            src,
          }
        })
        .insertBlock('paragraph')
    }
  }
  uploadImage = () => {
    if(this.inputDom){ this.inputDom.click()}
  }
  bindInput = (dom: HTMLInputElement) => {
    this.inputDom = dom
  }
  render() {
    const styles = require('./index.scss')
    return (
      <div
        ref={this.props.innerRef}
        className={styles.suggestionMenu}
      >
        <div className={styles.suggestion} onClick={this.uploadImage}>
          插入图片
        </div>
        <input
          type="file" accept="image/*"
          style={{ display: 'none' }}
          onChange={this.upload}
          ref={this.bindInput}
        />
      </div>
    )
  }
}