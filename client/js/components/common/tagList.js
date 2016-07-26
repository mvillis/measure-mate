'use strict'

var React = require('react')
var ReactBootstrap = require('react-bootstrap')
var Label = ReactBootstrap.Label

var Tag = React.createClass({
  propTypes: {
    tagName: React.PropTypes.string.isRequired
  },
  render: function () {
    return <span><Label bsStyle='primary'>{this.props.tagName}</Label> </span>
  }
})

var TagList = React.createClass({
  propTypes: {
    tags: React.PropTypes.array.isRequired
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
