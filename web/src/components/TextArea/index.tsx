import * as React from 'react'
import classnames from 'classnames'
import md5 from 'js-md5'

interface OuterProps {
  value: string
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  error?: string
  label?: string
  placeholder?: string
}
export default class TextArea extends React.Component<OuterProps, {}> {
  static defaultProps: Partial<OuterProps> = {
    error: '',
    placeholder: 'placeholder',
    label: 'placeholder',
  }
  state = {
    focus: false,
  }
  id: string = md5(Date.now() + String(Math.random())).slice(0, 24)
  handleFocus = () => {
    this.setState({
      focus: true,
    })
  }
  handleBlur = () => {
    this.setState({
      focus: false,
    })
  }
  getLabelTxt = () => {
    const { placeholder, label, error, value } = this.props
    const { focus } = this.state
    if( error ){
      return error
    }
    if (focus || value ){
      return label
    }
    return placeholder
  }
  render () {
    const styles = require('./index.scss')
    const { value, error } = this.props
    const { focus } = this.state
    return(
      <div className={classnames(styles.textareaComponent, {
        [styles.focus]: focus,
      })}>
        <label htmlFor={this.id} className={classnames({
          [styles.err]: error,
          [styles.labelTip]: focus || value,
        })}>{this.getLabelTxt()}</label>
        <div className={styles.textareaWrap}>
          <textarea
            id={this.id}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            value={value}
            onChange={this.props.onChange} />
        </div>
      </div>
    )
  }
}
