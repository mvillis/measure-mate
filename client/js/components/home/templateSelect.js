'use strict'

var React = require('react')
var Select = require('react-select')
var ReactBootstrap = require('react-bootstrap')
var FormGroup = ReactBootstrap.FormGroup
var HelpBlock = ReactBootstrap.HelpBlock
var Col = ReactBootstrap.Col
var ControlLabel = ReactBootstrap.ControlLabel
var $ = require('jquery')

var TemplateSelect = React.createClass({
  propTypes: {
    label: React.PropTypes.string.isRequired,
    value: React.PropTypes.any,
    onChange: React.PropTypes.func.isRequired
  },
  displayName: 'TemplateSelect',

  loadOptions: function loadOptions (input, callback) {
    setTimeout(function () {
      $.ajax({
        url: '/api/templates/',
        dataType: 'json',
        cache: true,
        success: function (output) {
          var options = output.map(function (item) {
            return (
              { value: item.id, label: item.name }
            )
          })
          callback(null, {
            options: options,
            complete: false
          })
        },
        error: function (xhr, status, err) {
          console.error(window.location, status, err.toString())
        }
      })
    }, 500)
  },

  render: function render () {
    return (
      <FormGroup>
        <Col xs={2}>
          <ControlLabel>{this.props.label}</ControlLabel>
        </Col>
        <Col xs={10}>
          <Select.Async delimeter=','
            multi={false}
            loadOptions={this.loadOptions}
            {...this.props}
            allowCreate={false}
            name='tags'
            placeholder='Type to filter templates'
            />
          <HelpBlock>Each template includes a unique set of attributes to measure.</HelpBlock>
        </Col>
      </FormGroup>
    )
  }
})

module.exports = TemplateSelect
