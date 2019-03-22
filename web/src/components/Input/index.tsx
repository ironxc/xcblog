import * as React from 'react'
import classnames from 'classnames'
import md5 from 'js-md5'
export interface OuterProps {
  value: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  error?: string,
  label?: string,
  placeholder?: string,
  type?: string
}
interface OwnState {
  focus: boolean
}
const defaultProps = {
  error: '',
  placeholder: 'placeholder',
  label: 'placeholder',
  type: 'text',
}
export default class Input extends React.Component<OuterProps, OwnState>{
  static defaultProps: Partial<OuterProps> = {
    error: '',
    placeholder: 'placeholder',
    label: 'placeholder',
    type: 'text',
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
    if (error) {
      return error
    }
    if (focus || value) {
      return label
    }
    return placeholder
  }
  render () {
    const styles = require('./index.scss')
    const { value, type, error } = this.props
    const { focus } = this.state
    return(
      <div className={classnames(styles.input,{
        [styles.focus]: focus  || error,
      })}>
        <label htmlFor={this.id} className={classnames({
          [styles.err]: error,
          [styles.labelTrasnform]: value || focus || error,
        })}>{this.getLabelTxt()}</label>
        <div>
          <input
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            id={this.id}
            type={type}
            value={value}
            onChange={this.props.onChange}/>
        </div>
      </div>
    )
  }
}
