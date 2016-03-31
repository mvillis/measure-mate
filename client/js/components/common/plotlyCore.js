var PlotlyCore = require('plotly.js/lib/core')
window.$ = require('jquery')

// Load in the trace types for pie, and choropleth
PlotlyCore.register([
  require('plotly.js/lib/bar')
])

module.exports = PlotlyCore
