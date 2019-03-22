import * as React from 'react'
import { Link } from 'react-router-dom'
import HomeLink from 'components/HomeLink'
import { Subscribe } from 'unstated'
import Init, { OwnState as InitState, Tag } from 'models/Init'

interface OuterProps {
  tags: InitState['tags']
}
class TagsPage extends React.Component<OuterProps> {
  render () {
    const { tags } = this.props
    const styles = require('./index.scss')
    return (
      <div className={styles.tags}>
        <div className={styles.homelink}>
          <HomeLink />
        </div>
        <div className={styles.content}>
          {
            tags.map((t: Tag) => (<span style={{
              fontSize: `${12 + t.num * 2}px`,
            }} key={t.value}><Link to={`/home?tag=${t.value}`}>{t.value}</Link></span>))
          }
        </div>
      </div>
    )
  }
}
export default class Wrap extends React.Component {
  render() {
    return (<Subscribe to={[Init]}>{
      (init: { state: InitState }) => (
        <TagsPage tags={init.state.tags} />
      )
    }</Subscribe>)
  }
}
