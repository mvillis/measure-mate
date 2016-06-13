'use strict'

var React = require('react')
var Select = require('react-select')
var ReactBootstrap = require('react-bootstrap')
var FormGroup = ReactBootstrap.FormGroup
var HelpBlock = ReactBootstrap.HelpBlock
var Col = ReactBootstrap.Col
var ControlLabel = ReactBootstrap.ControlLabel
var $ = require('jquery')

var TagSelect = React.createClass({
  propTypes: {
    label: React.PropTypes.string.isRequired,
    value: React.PropTypes.any,
    onChange: React.PropTypes.func.isRequired
  },
  displayName: 'TagSelect',

  loadOptions: function loadOptions (input, callback) {
    setTimeout(function () {
      $.ajax({
        url: '/api/tags/?search=' + input,
        dataType: 'json',
        cache: false,
        success: function (data) {
          var options = data.map(function (item) {
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
          <Select.Async {...this.props}
            delimeter=','
            multi
            options={[]}
            loadOptions={this.loadOptions}
            allowCreate
            name='tags'
            placeholder='Type to find existing tags or create new ones'
          />
          <HelpBlock>
            Tags are used to drive reporting. Use them to uniquely identify your area as well as group areas together.
          </HelpBlock>
        </Col>
      </FormGroup>
    )
  }
})

module.exports = TagSelect
