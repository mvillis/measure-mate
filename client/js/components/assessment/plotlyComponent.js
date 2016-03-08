"use strict";

var React = require('react');
var Plotly = require('../common/plotlyCore.js');

var PlotlyComponent = React.createClass({

  displayName: 'Plotly',
  propTypes: {
    data: React.PropTypes.array,
    layout: React.PropTypes.object,
    config: React.PropTypes.object
  },

  componentDidMount() {
    let {data, layout, config} = this.props;
    Plotly.plot(this.container, data, layout, config);
  },

  componentDidUpdate() {
    //TODO use minimal update for given changes
    this.container.data = this.props.data;
    this.container.layout = this.props.layout;
    Plotly.redraw(this.container);
  },

  render: function () {
    let {data, layout, config} = this.props;
    return <div ref={(node) => this.container=node} />
  }
});

module.exports = PlotlyComponent;
