import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { Motion, spring } from 'react-motion'
import TextArea from 'src/components/TextArea'
import Input from 'src/components/Input'
import Select from 'src/components/Select'
const springSetting = { stiffness: 600, damping: 34 }
export default class SaveForm extends React.Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
    title: PropTypes.object.isRequired,
    tags: PropTypes.array.isRequired,
    options: PropTypes.array.isRequired,
    description: PropTypes.object.isRequired,
    logo: PropTypes.object.isRequired,
    onDescription: PropTypes.func.isRequired,
    onTitle: PropTypes.func.isRequired,
    onTagsChange: PropTypes.func.isRequired,
    onLogo: PropTypes.func.isRequired,
  }
  render () {
    const styles = require('./index.scss')
    const { show, title, description, logo, tags,
      onDescription, onTitle, onSubmit, onLogo,
      onTagsChange, options } = this.props
    return (
      <Motion style={{ top: spring(show ? 20 : 100, springSetting)}}>
        {
          ({ top }) => (
            <div className={classnames(styles.saveForm)} style={{
              top: `${top}%`,
            }}>
              <div className={styles.inputWrap}>
                <Input 
                  value={title.value} 
                  label={title.label} 
                  placeholder={title.placeholder}
                  error={title.error}
                  onChange={onTitle}
                  id={title.id}
                />
              </div>
              <div className={styles.inputWrap}>
                <Input
                  value={logo.value}
                  label={logo.label}
                  placeholder={logo.placeholder}
                  error={logo.error}
                  onChange={onLogo}
                  id={logo.id}
                />
              </div>
              <div className={styles.inputWrap} style={{ 
                height: '7em', marginTop: '1rem'}}>
                <TextArea 
                  value={description.value}
                  label={description.label}
                  placeholder={description.placeholder}
                  error={description.error}
                  id={description.id}
                  onChange={onDescription}/>
              </div>
              <div>
                <Select options={options} value={tags} onChange={onTagsChange} placeholder="笔记标签"/>
              </div>
              <div className={styles.btn} onClick={onSubmit}>
                保存
              </div>
            </div>
          )
        }
      </Motion>
    )
  }
}