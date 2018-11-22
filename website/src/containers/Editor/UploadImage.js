import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { Motion, spring } from 'react-motion'
import { connect } from 'react-redux'
import { getImages } from 'src/store/reducers/editor'
import  request from 'src/utils/request'
const springSetting = { stiffness: 600, damping: 34 }
@connect(state => ({
  image: state.editor.image,
}), { getImages })
export default class UploadImage extends React.Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
    image: PropTypes.object.isRequired,
    getImages: PropTypes.func.isRequired,
    insertImg: PropTypes.func.isRequired,
  }
  state = {
    perPage: 12,
  }
  componentDidMount () {
    this.props.getImages({
      page: 1,
      perPage: this.state.perPage,
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
  renderImageList () {
    const styles = require('./index.scss')
    const { image: { list } } = this.props
    return (
      <div className = { styles.list } >
        {
          list.length > 0 
            ? list.map(item => (
              <div className={styles.item} key={item.id}>
                <div>
                  <img src={item.path} alt="logo" />
                  <div className={styles.add} onClick={this.insertImg(item.path)}>
                    <i className="iconfont icon-jia" />
                  </div>
                  <div className={styles.del}><i className="iconfont icon-trash" /></div>
                </div>
              </div>
            ))
            : '暂无图片'
        }
      </div >
    )
  }
  uploadImage = () => {
    document.querySelector('#inputimage').click()
  }
  onImageData = (event) => {
    const data = new FormData()
    data.append('image', event.target.files[0])
    request.post('/api/image', data)
      .then(() => {
        this.props.getImages({
          page: 1,
          perPage: this.state.perPage,
        })
      })
  }
  insertImg = (path) => () => {
    this.props.insertImg(`![](${path})`)
  }
  handlePrePage = () => {
    this.props.getImages({
      page: this.props.image.page - 1,
      perPage: this.state.perPage,
    })
  }
  handleNextPage = () => {
    this.props.getImages({
      page: this.props.image.page + 1,
      perPage: this.state.perPage,
    })
  }
  render () {
    const styles = require('./index.scss')
    const { show, image: { count, page } } = this.props
    const { perPage } = this.state
    return (
      <Motion style={{ top: spring(show ? 20 : 100, springSetting) }}>
        {
          ({ top }) => (
            <div className={classnames(styles.uploadImage)} style={{
              top: `${top}%`,
            }}>
              <h4 onClick={this.uploadImage}>
                <span><i className="iconfont icon-upload"></i></span>
                <input 
                  type="file" accept="image/*" 
                  style={{ display: 'none'}} id="inputimage"
                  onChange={this.onImageData}
                />
              </h4>
              {
                this.renderImageList()
              }
              <div className={styles.imgbtn}>
                {
                  page > 1 && <span onClick={this.handlePrePage}>上一页</span>
                } 
              </div>
              <div className={styles.imgbtn}>
                {
                  page < Math.ceil(count / perPage) && <span onClick={this.handleNextPage}>下一页</span>
                }
              </div>
            </div>
          )
        }
      </Motion>
    )
  }
}