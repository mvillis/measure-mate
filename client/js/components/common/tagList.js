'use strict'

var React = require('react')
var ReactBootstrap = require('react-bootstrap')
var Label = ReactBootstrap.Label

var TagList = React.createClass({
  propTypes: {
    tags: React.PropTypes.array.isRequired
  },
  render: function () {
    var tagNodes = this.props.tags.map(function (tag, i) {
      return (
        <span key={i}><Label ey={tag.id} bsStyle='default' className='label label-primary'>{tag.name}</Label> </span>
      )
    })
    return (
      <span>
      {tagNodes}
      </span>
    )
  }
})

module.exports = TagList
