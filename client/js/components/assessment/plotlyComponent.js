'use strict'

var PropTypes = require('prop-types');

var React = require('react')
var Plotly = require('../common/plotlyCore.js')

var PlotlyComponent = React.createClass({

  displayName: 'Plotly',
  propTypes: {
    data: PropTypes.array,
    layout: PropTypes.object,
    config: PropTypes.object
  },

  componentDidMount () {
    let {data, layout, config} = this.props
    Plotly.plot(this.container, data, layout, config)
  },

  componentDidUpdate () {
    // TODO use minimal update for given changes
    this.container.data = this.props.data
    this.container.layout = this.props.layout
    Plotly.redraw(this.container)
  },

  render: function () {
    var _this = this
    var refValue = function ref (node) {
      var value = _this.container = node
      return value
    }
    return (
      <div ref={refValue} />
    )
  }
})

module.exports = PlotlyComponent
