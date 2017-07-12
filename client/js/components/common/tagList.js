'use strict'

var PropTypes = require('prop-types')

var React = require('react')
var createReactClass = require('create-react-class')
var ReactBootstrap = require('react-bootstrap')
var Label = ReactBootstrap.Label

var Tag = createReactClass({
  displayName: 'Tag',

  propTypes: {
    tagName: PropTypes.string.isRequired
  },

  render: function () {
    return <span><Label bsStyle='primary'>{this.props.tagName}</Label> </span>
  }
})

var TagList = createReactClass({
  displayName: 'TagList',

  propTypes: {
    tags: PropTypes.array.isRequired
  },

  render: function () {
    return (
      <span>
        {this.props.tags.map(function (tag, i) {
          return <Tag key={tag.id} tagName={tag.name} />
        })}
      </span>
    )
  }
})

module.exports = TagList
