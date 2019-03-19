import React from 'react'
import * as SlateR from 'slate-react'
import {
  Editor as CoreEditor,
} from 'slate'
import { CONTEXT_MARK_TYPE } from './SuggestionMenu'

export const BoldMark = ({ children, mark: { data } }: any) => (
  <strong>
    {children}
  </strong>
)
export const ItalicMark = ({ children, mark: { data } }: any) => (
  <em>
    {children}
  </em>
)
export const UnderlineMark = ({ children, mark: { data } }: any) => (
  <u>
    {children}
  </u>
)
export const StrikethroughMark = ({ children, mark: { data } }: any) => (
  <del>
    {children}
  </del>
)
export const MentionContext = ({ children, mark: { data } }: any) => (
  <span className={CONTEXT_MARK_TYPE}>
    {children}
  </span>
)
const renderMark = (props: SlateR.RenderMarkProps, editor: CoreEditor, next: () => any) => {
  const { mark } = props
  switch (mark.type) {
    case 'bold':
      return <BoldMark {...props} />
    case 'italic':
      return <ItalicMark {...props} />
    case 'underline':
      return <UnderlineMark {...props} />
    case CONTEXT_MARK_TYPE:
      return <MentionContext {...props}/>
    default:
      return next()
  }
}
export default renderMark