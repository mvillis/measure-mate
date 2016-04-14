'use strict'

var React = require('react')
var ReactBootstrap = require('react-bootstrap')
var Panel = ReactBootstrap.Panel
var Button = ReactBootstrap.Button
var Modal = ReactBootstrap.Modal

var FinaliseAssessment = React.createClass({
  propTypes: {
    assessment: React.PropTypes.object,
    params: React.PropTypes.object
  },
  getInitialState () {
    return { showModal: false }
  },
  close () {
    this.setState({ showModal: false })
  },
  open () {
    this.setState({ showModal: true })
  },
  render: function () {
    return (
      <div>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Are you sure?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Once you commit you will not be able to make futher changes.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>Close</Button>
            <Button bsStyle='primary' onClick={this.close}>Lock It In</Button>
          </Modal.Footer>
        </Modal>
        <Panel bsStyle="danger">
          <p>Happy how everything looks?</p>
          <Button onClick={this.open} bsStyle='primary'>Lock It In</Button>
        </Panel>
      </div>
    )
  }
})

module.exports = FinaliseAssessment
