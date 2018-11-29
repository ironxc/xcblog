import React, { Component } from 'react'
import classnames from 'classnames'
import { ParseMardown } from 'src/utils'
import SaveForm from './SaveForm'
import UploadImage from './UploadImage'
import { Motion, spring } from 'react-motion'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selectArticle } from 'src/models/article/selector'
import { selectAllTags } from 'src/models/init/selector'
import { createStructuredSelector } from 'reselect'
const springSetting = { stiffness: 600, damping: 34 }
const iconlist = [
  {
    icon: 'icon-dabiaoti', text: '## ', name: 'h2',
  },
  {
    icon: 'icon-H1', text: '### ', name: 'h3',
  },
  {
    icon: 'icon-H', text: '#### ', name: 'h4',
  },
  {
    icon: 'icon-cuti', text: '****', name: 'bold',
  },
  {
    icon: 'icon-xieti', text: '**', name: 'italic',
  },
  {
    icon: 'icon-yinyong', text: '> ', name: 'quote',
  },
  {
    icon: 'icon-wuxuliebiao', text: '* ', name:'disorderlist',
  },
  {
    icon: 'icon-youxuliebiao', text: '1. ', name:'orderlist',
  },
  {
    icon: 'icon-chaolianjie', text: '[]()', name:'link',
  },
  {
    icon: 'icon-shangchuantupian', text: '', name:'image',
  },
  // {
  //   icon: 'icon-remen-copy', text: '', name: 'directory',
  // },
  {
    icon: 'icon-baocun', text: '', name: 'save',
  },
  {
    icon: 'icon-icon-home', text: '', name: 'home',
  },
]


const mapStateToProps = createStructuredSelector({
  data: selectArticle,
  allTags: selectAllTags,
})
@connect(mapStateToProps)
export default class Editor extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  }
  constructor (props){
    super(props)
    this.state = {
      focuse: false,
      markdown: this.props.data ? this.props.data.content : '',
      parsedData: '',
      popups: '',
      fullScreen: false,
      preview: false,
      title: {
        value: this.props.data ? this.props.data.name : '',
        error: '',
        placeholder: '请输入笔记标题',
        label: '标题',
        id: 'asas',
      },
      description: {
        value: this.props.data ? this.props.data.description : '',
        error: '',
        placeholder: '请输入笔记描述',
        label: '描述',
        id: 'asdfasdf',
      },
      logo: {
        value: this.props.data ? this.props.data.logo : '',
        error: '',
        placeholder: '请输入笔记logo图片地址',
        label: 'logo地址',
        id: 'asdddffasdf',
      },
      options: this.props.allTags ? this.props.allTags.map(t => (t.value)) : [],
      tags: this.props.data ? this.props.data.tags : [],
    }
  }
  componentDidMount () {
    if (this.props.allTags.length <= 0) {
      this.props.dispatch({
        type: 'init/getAllTags',
      })
    }
    if(this.props.match.params.id !== 'new'){
      this.props.dispatch({
        type: 'article/get',
        payload: {
          id: this.props.match.params.id,
        },
      })
    }
  }
  componentWillReceiveProps (nextProps) {
    console.log(nextProps)
    this.setState({
      focuse: false,
      markdown: nextProps.data ? nextProps.data.content : '',
      parsedData: nextProps.data ?  ParseMardown(nextProps.data.content).parsedData : '',
      popups: '',
      fullScreen: false,
      preview: false,
      title: {
        value: nextProps.data ? nextProps.data.name : '',
        error: '',
        placeholder: '请输入笔记标题',
        label: '标题',
        id: 'asas',
      },
      description: {
        value: nextProps.data ? nextProps.data.description : '',
        error: '',
        placeholder: '请输入笔记描述',
        label: '描述',
        id: 'asdfasdf',
      },
      logo: {
        value: nextProps.data ? nextProps.data.logo : '',
        error: '',
        placeholder: '请输入笔记logo图片地址',
        label: 'logo地址',
        id: 'asdddffasdf',
      },
      options: nextProps.allTags ? nextProps.allTags.map(t => (t.value)) : [],
      tags: nextProps.data ? nextProps.data.tags : [],
    })
  }
  setPopus = (name) => {
    this.setState({
      popups: this.state.popups === name ? '' : name,
    })
  }
  closePopups = (e) => {
    e.stopPropagation()
    this.setState({
      popups: '',
    })
  }
  insert = (item) => () => {
    switch(item.name){
      case 'h2':
      case 'h3':
      case 'h4':
      case 'quote':
      case 'disorderlist':
      case 'orderlist':
        this.insertHead(item)
        break
      case 'bold':
      case 'italic':
      case 'link':
        this.insertTxt(item)
        break
      case 'save':
        this.setPopus('saveForm')
        break
      case 'home':
        this.props.history.push('/home')
        break
      case 'image':
        this.setPopus('uploadImage')
        break
      default:
        break
    }
  }
  insertHead = (item) => {
    const { markdown } = this.state
    const index = markdown.lastIndexOf('\n')
    let newMarkdown
    if( index < 0) {  
      newMarkdown = item.text + markdown
    } else {
      newMarkdown = markdown.substring(0, index + 1) + item.text + markdown.substring(index + 1)
    }
    const data = ParseMardown(newMarkdown).parsedData
    
    this.setState({
      markdown: newMarkdown,
      parsedData: data,
    }, () => {
      // this.textarea.selectionStart = 3
      // this.textarea.selectionEnd = 3
      this.textarea.focus()
    })
  }
  insertTxt = (item) => {
    const { markdown } = this.state
    const isEnd = this.textarea.selectionStart === markdown.length
    let newMarkdown
    if(isEnd) {
      newMarkdown = markdown + item.text
      const data = ParseMardown(newMarkdown).parsedData
      this.setState({
        markdown: newMarkdown,
        parsedData: data,
      }, () => {
        const selectionIndex = item.name === 'link' 
          ? markdown.length + item.text.length / 2 - 1 
          : markdown.length + item.text.length / 2
        this.textarea.selectionStart = selectionIndex
        this.textarea.selectionEnd = selectionIndex
        this.textarea.focus()
      })
    } else {
      const start = this.textarea.selectionStart
      const end = this.textarea.selectionEnd
      newMarkdown = markdown.substring(0, start) 
        + item.text.substring(0, item.name === 'link' ?  1 : item.text.length / 2) 
        + markdown.substring(start, end) 
        + item.text.substring(item.name === 'link' ? 1 : 0,
          item.name === 'link' ? item.text.length : item.text.length / 2) 
        + markdown.substring(end) 
      const data = ParseMardown(newMarkdown).parsedData
      this.setState({
        markdown: newMarkdown,
        parsedData: data,        
      }, () => {
        if(item.name === 'link') {
          this.textarea.selectionStart = end + item.text.length / 2 + 1
          this.textarea.selectionEnd = end + item.text.length / 2 + 1
        } else {
          this.textarea.selectionStart = end + item.text.length / 2
          this.textarea.selectionEnd = end + item.text.length / 2
        }
        this.textarea.focus()
      })
    }
  }
  insertImg = (text) => {
    const { markdown } = this.state
    let newMarkdown
    newMarkdown = markdown + text
    const data = ParseMardown(newMarkdown).parsedData
    this.setState({
      markdown: newMarkdown,
      parsedData: data,
    }, () => {
      const selectionIndex = markdown.length + 2
      this.textarea.selectionStart = selectionIndex
      this.textarea.selectionEnd = selectionIndex
      this.textarea.focus()
    })
  }
  bindDom = (dom) => {
    this.textarea = dom
  }
  handleChange = (e) => {
    const data = ParseMardown(e.target.value).parsedData
    this.setState({
      markdown: e.target.value,
      parsedData: data,    
    })
  }
  handleBlur = () => {
    this.setState({
      focuse: false,
    })
  }
  handleFocuse = () => {
    this.setState({
      focuse: true,
    })
  }
  handleFullscreen = () => {
    this.setState({
      fullScreen: !this.state.fullScreen,
    })
  }
  handlePreview = () => {
    this.setState({
      preview: !this.state.preview,
    })
  }
  onDescription = (value) => {
    this.setState({
      description: {
        ...this.state.description,
        value,
      },
    })
  }
  onTitle = (value) => {
    this.setState({
      title: {
        ...this.state.title,
        value,
      },
    })
  }
  onLogo = (value) => {
    this.setState({
      logo: {
        ...this.state.logo,
        value,
      },
    })
  }
  onTagsChange = (value) => {
    this.setState({
      tags: value,
    })
  }
  onSubmit = () => {
    this.props.dispatch({
      type: this.props.match.params.id !== 'new' ? 'article/update' : 'article/create',
      payload: {
        id: this.props.match.params.id,
        data: {
          logo: this.state.logo.value,
          tags: this.state.tags,
          name: this.state.title.value,
          description: this.state.description.value,
          content: this.state.markdown,
          status: 1,
          browseCount: 0,
        },
      },
    })
  }
  render () {
    const styles = require('./index.scss')
    const { focuse, markdown, parsedData, 
      popups, fullScreen, preview, 
      title, description, logo,
      tags, options} = this.state
    return (
      <div className={styles.editor}>
        <Motion style={{ width: spring(fullScreen ? 100 : 50, springSetting) }}>
          {
            ({ width }) => (
              <div className={styles.editSpace} style={{width: `${width}%`}}>
                <header>
                  <div>
                    {
                      iconlist.map(icon => {
                        return (
                          <span onClick={this.insert(icon)} key={icon.icon}>
                            <i className={`iconfont ${icon.icon}`} ></i>
                          </span>
                        )
                      })
                    }
                    {
                      fullScreen && <span onClick={this.handlePreview}><i className="iconfont icon-yanjing"></i></span>
                    }
                    {
                      fullScreen
                        ? <span onClick={this.handleFullscreen}>
                          <i className="iconfont icon-msnui-zoom-finger"></i></span>
                        : <span onClick={this.handleFullscreen}><i className="iconfont icon-quanping"></i></span>
                    }
                  </div>
                </header>
                <div className={classnames(styles.textareaWrap, {
                  [styles.textareaWrapFocus]: focuse,
                })}>
                  <textarea
                    value={markdown}
                    onFocus={this.handleFocuse}
                    onBlur={this.handleBlur}
                    onChange={this.handleChange}
                    ref={this.bindDom}
                  ></textarea>
                </div>
              </div>
            )
          }
        </Motion>
        <Motion style={{ top: spring((preview && fullScreen) ? 0 : 100, springSetting) }}>
          {
            ({ top }) => (
              <div className={classnames(styles.preview, {
                [styles.fixedPreview]: fullScreen,
              })} style={{ top: `${top}%`}}>
                <div dangerouslySetInnerHTML={{ __html: parsedData }} className="markdown-body"></div>
                {fullScreen && preview && <span className={styles.btn} onClick={this.handlePreview}>
                  <i className="iconfont icon-jia"></i></span>}
              </div>
            )
          }
        </Motion>
        
        {popups && <div className={styles.mask} onClick={this.closePopups}></div> }
        <SaveForm show={popups === 'saveForm' }  
          title={title} 
          description={description}
          logo={logo}
          tags={tags}
          options={options}
          onDescription={this.onDescription}
          onTitle={this.onTitle}
          onLogo={this.onLogo}
          onSubmit={this.onSubmit}
          onTagsChange={this.onTagsChange}
        />
        <UploadImage show={popups === 'uploadImage'} insertImg={this.insertImg}/>
      </div>
    )
  }
}