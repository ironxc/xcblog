import * as React from 'react'

// export default class TestDecorator extends React.Component{
//   @f()
//   @g()
//   render(){
//     return (
//       <h1>Decorator</h1>
//     )
//   }
// }

// function f() {
//   console.log('f(): evaluated')
//   return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//     console.log(target)
//     console.log('f(): called')
//   }
// }

// function g() {
//   console.log('g(): evaluated')
//   return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//     console.log('g(): called')
//   }
// }
@classDecorator
export default class TestDecorator extends React.Component {
  render() {
    return (
      <h1>Decorator</h1>
    )
  }
}

function classDecorator<T extends { new(...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    render() {
      return (
        <h1>classDecorator</h1>
      )
    }
  }
}
