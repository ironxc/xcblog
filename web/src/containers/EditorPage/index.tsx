import * as React from 'react'
import Editor from 'components/Editor'
import { ValueJSON, Value } from 'slate'
import initialValueAsJson from './init.json'
import { UserInfo } from 'models/Init'
import { match } from 'react-router'
import R from 'utils/request'
import SaveForm, { OuterProps as FormProps } from './SaveForm'

/** 请求要提交的文章数据 */
export interface ArticlePostData {
  name: string
  description: string
  browseCount: number
  status: number
  content: string
  logo: string
  tags: string[]
}


interface OuterProps {
  match: match<any>
}
export interface ArticleData extends ArticlePostData{
  author: UserInfo,
  createdAt: string
  updatedAt: string
  id: string
}
interface OwnState {
  value: Value
  data?: ArticleData
}

export default class EditorPage extends React.Component<OuterProps, OwnState> {
  state: OwnState = {
    value: Value.fromJSON(initialValueAsJson as ValueJSON),
  }
  componentDidMount() {
    const { match: { params } } = this.props
    if (params.id && params.id !== 'new') {
      this.getArticle(params.id)
    }
  }
  getArticle = (id: string) => {
    R.get(`/api/article/${id}`)
      .then((data: ArticleData ) => {
        this.setState({
          data,
          value: Value.fromJSON(JSON.parse(data.content)),
        })
      })
  }
  handleChange = (value: Value) => {
    this.setState({
      value,
    })
  }
  render() {
    const styles = require('./index.scss')
    const { data } = this.state
    let FormData: FormProps = {
      id: this.props.match.params.id,
      value: this.state.value
    }
    if(data) {
      FormData = {
        ...FormData,
        ...data,
      }
    }
    return <div className={styles.editorPage}>
      <div className={styles.editor}>
        <Editor onChange={this.handleChange} value={this.state.value} />
      </div>
      <div className={styles.form}>
        <SaveForm {...FormData}/>
      </div>
    </div>
  }
}