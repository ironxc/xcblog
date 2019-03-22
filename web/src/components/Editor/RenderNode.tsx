import React from 'react'
import * as SlateR from 'slate-react'
import {
  Editor as CoreEditor,
} from 'slate'

export const ParagraphNode = ({ children, node: { data } }: any) => (
  <div className="paragraph" >{children}</div>
)
export const QuoteNode = ({ children, node: { data } }: any) => (
  <blockquote className="block-quote" >{children}</blockquote>
)
export const ListitemNode = ({ children, node: { data } }: any) => (
  <li className="list-item" >{children}</li>
)
export const ListOlNode = ({ children, node: { data } }: any) => (
  <ol className="list-ol">{children}</ol>
)
export const ListUlNode = ({ children, node: { data } }: any) => (
  <ul className="list-ul" >{children}</ul>
)
export const HeadOneNode = ({ children, node: { data } }: any) => (
  <h1 className="heading-one" >{children}</h1>
)
export const HeadTwoNode = ({ children, node: { data } }: any) => (
  <h2 className="heading-two" >{children}</h2>
)
export const HeadThreeNode = ({ children, node: { data } }: any) => (
  <h3 className="heading-three" >{children}</h3>
)
export const HeadFourNode = ({ children, node: { data } }: any) => (
  <h4 className="heading-four" >{children}</h4>
)
export const HeadFiveNode = ({ children, node: { data } }: any) => (
  <h5 className="heading-five" >{children}</h5>
)
export const HeadSixNode = ({ children, node: { data } }: any) => (
  <h6 className="heading-six" >{children}</h6>
)
export const LinkNode = ({ children, node: { data } }: any) => {
  return (
    <a href={data.get('hrefLink')} className="link-a" target={data.get('target')}>
      {children}
    </a>
  )
}
export const SplitLine = ({ children, node: { data } }: any) => {
  return (
    <div className="split-line">{children}</div>
  )
}
export const Image = ({ children, node: { data } }: any) => {
  return (
    <div className="image-block">
      <img src={data.get('src')}/>
    </div>
  )
}
const renderNode = (props: SlateR.RenderNodeProps, editor: CoreEditor, next: () => any) => {
  const { node } = props
  switch (node.type) {
    case 'paragraph':
      return <ParagraphNode {...props} />
    case 'block-quote':
      return <QuoteNode {...props} />
    case 'list-item':
      return <ListitemNode {...props} />
    case 'list-ol':
      return <ListOlNode {...props} />
    case 'list-ul':
      return <ListUlNode {...props} />
    case 'heading-one':
      return <HeadOneNode {...props} />
    case 'heading-two':
      return <HeadTwoNode {...props} />
    case 'heading-three':
      return <HeadThreeNode {...props} />
    case 'heading-four':
      return <HeadFourNode {...props} />
    case 'heading-five':
      return <HeadFiveNode {...props} />
    case 'heading-six':
      return <HeadSixNode {...props} />
    case 'link-tag':
      return <LinkNode {...props} />
    case 'split-line':
      return <SplitLine {...props} />
    case 'image-block':
      return <Image {...props} />
    default:
      return next()
  }
}
export default renderNode
