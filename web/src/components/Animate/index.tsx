import * as React from 'react'

interface OupterProps {
  children: (style: React.CSSProperties) => any
  duration?: number
}
interface OwnState {
  show: boolean
}
export default class Aninmate extends React.Component<OupterProps, OwnState> {
  static defaultProps = {
    duration: 100,
  }
  state: OwnState = {
    show: false,
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        show: true,
      })
    }, this.props.duration)
  }
  render() {
    const { show } = this.state
    const style = {
      transform: show ? 'translateY(0)' : 'translateY(20px)',
      opacity: show ? 1 : 0,
      transition: 'all 1s cubic-bezier(0.075, 0.82, 0.165, 1)',
    }
    return <React.Fragment>
      {this.props.children(style)}
    </React.Fragment>
  }
}
