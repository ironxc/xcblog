import { Value, Mark } from 'slate'
import { CONTEXT_MARK_TYPE } from './SuggestionMenu'

export const getType = (chars: string): string => {
  if (/^[0-9]+.$/.test(chars)) {
    return 'list-ol'
  }
  if (/^-{3,}$/.test(chars)) {
    return 'split-line'
  }
  switch (chars) {
    case '*':
    case '-':
    case '+':
      return 'list-ul'
    case '>':
      return 'block-quote'
    case '#':
      return 'heading-one'
    case '##':
      return 'heading-two'
    case '###':
      return 'heading-three'
    case '####':
      return 'heading-four'
    case '#####':
      return 'heading-five'
    case '######':
      return 'heading-six'
    default:
      return ''
  }
}
export const getInput = (value: Value): string | null => {
  if (value.startText) {
    const { selection } = value
    const startOffset = selection.start.offset
    const inputTxt = value.startText.text.slice(startOffset - 1, startOffset)
    return inputTxt
  }
  return null
}
export const getActiveMark = (value: Value): Mark | undefined => {
  return value.activeMarks.first()
}
export const onKeyDown = (event: any, editor: any, next: () => any) => {
  switch (event.key) {
    case 'Backspace':
      return onBackspace(event, editor, next)
    case 'Enter':
      const type: string = getTriggerType(editor)
      if (Boolean(type)) {
        return onTrigger(event, editor, next, type)
      } else {
        return onEnter(event, editor, next)
      }
    case '@':
      event.preventDefault()
      return editor
        .addMark(CONTEXT_MARK_TYPE)
        .insertText('@')
    default:
      return next()
  }
}
export const getTriggerType = (editor: any) => {
  const { value } = editor
  const { selection } = value
  if (selection.isExpanded) return ''
  const { startBlock } = value
  const { start } = selection
  const str = startBlock.text.slice(0, start.offset)
  if (/^\S+\s{1}$/.test(str)) {
    return getType(str.replace(/\s*/g, ''))
  }
  return ''
}
const onTrigger = (event: any, editor: any, next: () => any, type: string) => {
  const { startBlock } = editor.value
  if (/list-ol|list-ul/.test(type) && startBlock.type == 'list-item') return next()
  event.preventDefault()
  if (/list-ol|list-ul/.test(type)) {
    editor
      .setBlocks('list-item')
      .wrapBlock(type)
      .moveFocusToStartOfNode(startBlock).delete()
  } else if(type === 'split-line') {
    if (Boolean(getType(startBlock.text.replace(/\s*/g, '')))) {
      editor
        .moveFocusToStartOfNode(startBlock)
        .delete()
        .setBlocks(type)
        .insertBlock('paragraph')
        .moveForward(1)
    } else {
      editor
        .moveFocusToStartOfNode(startBlock)
        .delete()
        .insertBlock(type)
        .moveForward(1)
    }
      return 
  } else {
    editor
      .setBlocks(type)
      .moveFocusToStartOfNode(startBlock).delete()
  }
  return
}
export const onBackspace = (event: any, editor: any, next: () => any) => {
  const { value } = editor
  const { selection } = value
  if (selection.isExpanded) return next()
  if (selection.start.offset != 0) return next()

  const { startBlock } = value
  if (startBlock.type == 'paragraph') return next()

  event.preventDefault()
  editor.setBlocks('paragraph')

  if (startBlock.type == 'list-item') {
    editor.unwrapBlock('list-ul')
    editor.unwrapBlock('list-ol')
  }
}
export const onEnter = (event: any, editor: any, next: () => any) => {
  const { value } = editor
  const { selection } = value
  const { start, end, isExpanded } = selection
  if (isExpanded) return next()

  const { startBlock } = value
  if (start.offset == 0 && startBlock.text.length == 0)
    return onBackspace(event, editor, next)
  if (end.offset != startBlock.text.length) return next()

  if (!/heading-one|heading-two|heading-three|heading-four|heading-five|heading-six|block-quote|split-line/.test(startBlock.type)) {
    return next()
  }
  event.preventDefault()
  editor.splitBlock().setBlocks('paragraph')
}