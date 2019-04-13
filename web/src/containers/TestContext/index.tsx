import * as React from 'react'

const ThemeContext = React.createContext({
  theme: 'green',
  toggleTheme: () => {},
})
interface ContextState {
  theme: string
  toggleTheme: () => void
}
export default class TestContext extends React.Component<{}, ContextState> {
  myRef: any
  aRef: any
  constructor(props: any) {
    super(props)
    this.state = {
      theme: 'red',
      toggleTheme: this.toggleTheme,
    }
    this.myRef = React.createRef()
    this.aRef = React.createRef()
    console.log(this.myRef.current)
  }
  componentWillMount(){
    console.log('componentWillMount', this.myRef.current, '\n', this.aRef)
  }
  componentDidMount(){
    console.log('componentDidMount', this.myRef.current, '\n', this.aRef)
  }
  toggleTheme = () => {
    this.setState({
      theme: this.state.theme === 'red' ? 'blue' : 'red',
    })
  }
  render(){
    return (
      <div>
        <h1>上层</h1>
        <ThemeContext.Provider value={this.state}>
          <Tip ref={this.myRef}/>
          <ThemeContext.Consumer>
            {
              value => (
                <div style={{
                  color: value.theme,
                }} ref={this.aRef}>
                  consumer组件
              </div>
              )
            }
          </ThemeContext.Consumer>
        </ThemeContext.Provider>
      </div>
    )
  }
}

interface TipState {
  text: string
}
class Tip extends React.Component<{}, TipState>{
  static contextType = ThemeContext
  state = {
    text: 'tip组件',
  }
  render() {
    return (
      <div style={{
        color: this.context.theme,
      }} onClick={this.context.toggleTheme}>
        {this.state.text}
      </div>
    )
  }
}
