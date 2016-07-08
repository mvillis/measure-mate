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
        <span key={tag.id || tag}><Label bsStyle='default' className='label label-primary'>{tag.name || tag.id || tag}</Label> </span>
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
