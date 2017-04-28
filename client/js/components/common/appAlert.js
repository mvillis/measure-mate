'use strict'

var PropTypes = require('prop-types')

var React = require('react')
var ReactBootrap = require('react-bootstrap')
var Modal = ReactBootrap.Modal
var Button = ReactBootrap.Button

var AppAlert = React.createClass({
  propTypes: {
    showAlert: PropTypes.bool.isRequired,
    alertType: PropTypes.string.isRequired,
    alertDetail: PropTypes.string.isRequired,
    handleHide: PropTypes.func.isRequired
  },
  render: function render () {
    return (
      <Modal show={this.props.showAlert} onHide={this.props.handleHide}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.alertType}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{this.props.alertDetail}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle='primary' onClick={this.props.handleHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    )
  }
})

module.exports = AppAlert
