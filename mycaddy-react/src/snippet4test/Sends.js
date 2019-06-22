import React, { Component } from 'react'
import { SampleConsumer } from '../snippet4test/context/sample'

class Sends extends Component {
 
  state = {
    input: ''
  }

  handleChange = (e) => {
    this.setState({ input: e.target.value })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.setValue(this.state.input)
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input value={this.state.input} onChange={this.handleChange} />
        <button type="submit">설정</button>
      </form>
    )
  }
}

const SendsContainer = () => (
  <SampleConsumer>
    {
      ({state, actions}) => (
        <Sends value={state.value} setValue={actions.setValue} /> 
      )
    }
  </SampleConsumer>
)
 
export default SendsContainer