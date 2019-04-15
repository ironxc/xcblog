import * as React from 'react'
import Editor from 'components/Editor'
import { ValueJSON, Value } from 'slate'
import initialValueAsJson from './init.json'
import { UserInfo } from 'models/Init'
import { match } from 'react-router'
import R from 'utils/request'
import SaveForm, { OuterProps as FormProps } from './SaveForm'
import * as H from 'history'

/** 更新文章要提交的文章数据 */
export interface ArticlePostData {
  name: string
  description: string
  status: number
  content: string
  logo: string
  tags: string[]
}

interface OuterProps {
  match: match<any>
  history: H.History
}
export interface ArticleData extends ArticlePostData{
  author: UserInfo,
  createdAt: string
  updatedAt: string
  id: string
  browseCount: number
}
interface OwnState {
  value: Value
  ready: boolean
  data?: ArticleData
}

export default class EditorPage extends React.Component<OuterProps, OwnState> {
  state: OwnState = {
    value: Value.fromJSON(initialValueAsJson as ValueJSON),
    ready: false,
  }
  componentDidMount() {
    const { match: { params } } = this.props
    if (params.id && params.id !== 'new') {
      this.getArticle(params.id)
    } else {
      this.setState({
        ready: true,
      })
    }
  }
  getArticle = (id: string) => {
    R.get(`/api/article/${id}`)
      .then((data: ArticleData ) => {
        this.setState({
          data,
          value: Value.fromJSON(JSON.parse(data.content)),
          ready: true,
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
    const { data, ready } = this.state
    let FormData: FormProps = {
      id: this.props.match.params.id,
      value: this.state.value,
      history: this.props.history,
    }
    if(data) {
      FormData = {
        ...FormData,
        ...data,
      }
    }
    if (!ready) { return null }
    return <div className={styles.editorPage}>
      <div className={styles.editor}>
        <Editor onChange={this.handleChange} value={this.state.value} />
      </div>
      <div className={styles.form}>
        <SaveForm {...FormData} />
      </div>
    </div>
  }
}
