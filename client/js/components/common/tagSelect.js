'use strict'

var PropTypes = require('prop-types')

var React = require('react')
var createReactClass = require('create-react-class')
var Select = require('react-select')
var ReactBootstrap = require('react-bootstrap')
var HelpBlock = ReactBootstrap.HelpBlock
var $ = require('jquery')

var TagSelect = createReactClass({
  propTypes: {
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired
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
      <div>
        <Select.Async {...this.props}
          delimeter=','
          multi
          options={[]}
          loadOptions={this.loadOptions}
          allowCreate
          name='tags'
          placeholder='Type to find existing tags or create new ones'
          cache={{}}
        />
        <HelpBlock>
          Tags are used to drive reporting. Use them to uniquely identify your area as well as group areas together.
        </HelpBlock>
      </div>
    )
  }
})

module.exports = TagSelect
