import React from 'react'
import classnames from 'classnames'
import TextArea from 'components/TextArea'
import Input, { OuterProps as InputOuterProps} from 'components/Input'
import Select from 'components/Select'
import R from 'utils/request'
import { valueType } from 'rc-select/lib/PropTypes'
import { Subscribe } from 'unstated'
import Init, { Tag } from 'models/Init'
import { ArticlePostData, ArticleData } from './index'
import { Value } from 'slate'
import * as H from 'history'

export interface OuterProps extends Partial<ArticleData> {
  id: string
  value: Value
  history: H.History
}
interface OwnProps extends OuterProps {
  options: string[]
  getAllTags: () => void
}
interface OwnState {
  browseCount: number
  status: number
  logo: string
  name: Partial<InputOuterProps>
  description: Partial<InputOuterProps>
  tags: string[]
  options: string[]
}
class SaveForm extends React.Component<OwnProps, OwnState> {
  constructor(props: OwnProps) {
    super(props)
    this.state = {
      name: {
        value: props.name ? props.name : '',
        label: '笔记名',
        error: '',
        placeholder: '请输入笔记名'
      },
      description: {
        value: props.description ? props.description : '',
        label: '笔记描述',
        error: '',
        placeholder: '请输入笔记描述'
      },
      browseCount: 0,
      status: 1,
      logo: props.logo ? props.logo : '',
      tags: props.tags ? props.tags : [],
      options: props.options ? props.options : []
    }
  }
  componentWillReceiveProps(nextProps: OwnProps) {
    this.state = {
      name: {
        value: nextProps.name ? nextProps.name : '',
        label: '笔记名',
        error: '',
        placeholder: '请输入笔记名'
      },
      description: {
        value: nextProps.description ? nextProps.description : '',
        label: '笔记描述',
        error: '',
        placeholder: '请输入笔记描述'
      },
      browseCount: 0,
      status: 1,
      logo: nextProps.logo ? nextProps.logo : '',
      tags: nextProps.tags ? nextProps.tags : [],
      options: nextProps.options ? nextProps.options : []
    }
  }
  updateArticle = (data: ArticlePostData) => {
    R.put(`/api/article/${this.props.id}`, data)
      .then(res => {
        this.props.getAllTags()
        this.props.history.push(`/article/${res}`)
      })
  }
  createArticle = (data: ArticlePostData) => {
    R.post(`/api/article/${this.props.id}`, data)
      .then(res => {
        this.props.getAllTags()
        this.props.history.push(`/article/${res}`)
      })
  }
  onName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      name: {
        ...this.state.name,
        value: event.target.value,
        error: event.target.value.length < 3 ? "怎么也得3个字吧" : ''
      }
    })
  }
  onDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({
      description: {
        ...this.state.description,
        value: event.target.value,
        error: event.target.value.length < 3 ? "8个字不多吧" : ''
      }
    })
  }
  onTagsChange = (val: valueType) => {
    this.setState({
      tags: val as string[]
    })
  }
  onSubmit = () => {
    const { name, description, status, browseCount, logo, tags } = this.state
    if(name.error || description.error) { return }
    if(this.props.id === 'new') {
      this.createArticle({
        name: name.value as string,
        description: description.value as string,
        browseCount: browseCount,
        status: status,
        content: JSON.stringify(this.props.value.toJSON()),
        logo: logo,
        tags: tags,
      })
    } else {
      this.updateArticle({
        name: name.value as string,
        description: description.value as string,
        browseCount: browseCount,
        status: status,
        content: JSON.stringify(this.props.value.toJSON()),
        logo: logo,
        tags: tags,
      })
    }
  }
  render () {
    const styles = require('./index.scss')
    const { name, description, options, tags } = this.state
    return (
      <div className={classnames(styles.saveForm)} style={{
        top: `${top}%`,
      }}>
        <div className={styles.inputWrap}>
          <Input
            value={name.value}
            label={name.label}
            placeholder={name.placeholder}
            error={name.error}
            onChange={this.onName}
          />
        </div>
        <div className={styles.inputWrap} style={{
          height: '7em', marginTop: '1rem'
        }}>
          <TextArea
            value={description.value}
            label={description.label}
            placeholder={description.placeholder}
            error={description.error}
            onChange={this.onDescription} />
        </div>
        <div>
          <Select options={options} value={tags} onChange={this.onTagsChange} placeholder="标签" />
        </div>
        <div className={styles.btn} onClick={this.onSubmit}>保存</div>
      </div>
    )
  }
}
export default class WrapSaveForm extends React.Component<OuterProps, {}> {
  render() {
    return (<Subscribe to={[Init]}>{
      (init: any) => (
        <SaveForm
          {...this.props}
          getAllTags={init.getAllTags}
          options={init.state.tags.map((t: Tag) => (t.value))}
        />
      )
    }</Subscribe>)
  }
}