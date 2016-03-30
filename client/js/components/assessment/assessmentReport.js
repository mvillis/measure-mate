'use strict'

var React = require('react')
var _ = require('lodash')
var PlotlyComponent = require('./plotlyComponent')
var ReactBootstrap = require('react-bootstrap')
var Table = ReactBootstrap.Table

var AssessmentReport = React.createClass({
  propTypes: {
    activeTab: React.PropTypes.number,
    eventKey: React.PropTypes.number,
    assessment: React.PropTypes.object,
    measurements: React.PropTypes.array,
    attributes: React.PropTypes.array,
    template: React.PropTypes.object
  },
  shouldComponentUpdate: function (nextProps, nextState) {
    if (nextProps.activeTab === this.props.eventKey) {
      return true
    }
    return false
  },
  getAttributeForRating: function (queryRating) {
    var matchingAttribute = null
    for (var i = 0; i < this.props.template.attributes.length; i++) {
      for (var ii = 0; ii < this.props.template.attributes[i].ratings.length; ii++) {
        if (queryRating === this.props.template.attributes[i].ratings[ii].id) {
          matchingAttribute = this.props.template.attributes[i].id
          break
        }
      }
    }
    return matchingAttribute
  },
  getMeasurementForAttribute: function (attribute) {
    if (this.props.measurements !== null) {
      for (var i = 0; i < this.props.measurements.length; i++) {
        if (attribute.id === this.getAttributeForRating(this.props.measurements[i].rating)) {
          return this.props.measurements[i]
        }
      }
    } else {
      return null
    }
  },
  render: function () {
    var BLUE = '#337ab7'
    var RED = '#b73333'
    var GREY = '#b7b7b7'

    var labels = []
    var targetSeries = []
    var ratingSeries = []
    var currentColors = BLUE

    // assume that rating names & ranks are the same for all attributes
    var ratings = this.props.template.attributes[0].ratings.map(function (rating) {
      return { 'rank': rating.rank, 'name': rating.name }
    })

    if (!_.find(ratings, function (rating) { return rating.rank === 0 })) {
      ratings.push({ 'rank': 0, 'name': 'N/A' })
      ratings.sort(function (a, b) { return a.rank - b.rank })
    }

    var rankValues = []
    var rankNames = []
    var rankMin = null
    var rankMax = null
    ratings.forEach(function (rating, i) {
      rankValues.push(rating.rank)
      rankNames.push(rating.name)
      rankMin = Math.min(rankMin, rating.rank)
      rankMax = Math.max(rankMax, rating.rank)
    })

    var summaryRows = []

    if (this.props.measurements !== null) {
      (this.props.attributes.map(function (attribute, i) {
        labels.push(attribute.name)

        var measurement = this.getMeasurementForAttribute(attribute)

        var currentRating = (measurement && measurement.rating) ? _.find(attribute.ratings, function (rating) { return measurement.rating === rating.id }) : null
        var targetRating = (measurement && measurement.target_rating) ? _.find(attribute.ratings, function (rating) { return measurement.target_rating === rating.id }) : null

        ratingSeries.push(currentRating ? currentRating.rank : 0)
        targetSeries.push(targetRating ? targetRating.rank : 0)

        var currentStyle = {}
        var currentColour = (currentRating ? currentRating.colour : '')
        if (currentColour) {
          currentStyle = {
            'backgroundColor': currentColour,
            'fontWeight': 'bold',
            'verticalAlign': 'middle',
            'color': (currentColour === 'Yellow') ? 'Black' : 'White'
          }
        }
        var targetStyle = {}
        var targetColour = (targetRating ? targetRating.colour : '')
        if (targetColour) {
          targetStyle = {
            'backgroundColor': targetColour,
            'fontWeight': 'bold',
            'verticalAlign': 'middle',
            'color': (targetColour === 'Yellow') ? 'Black' : 'White'
          }
        }

        summaryRows.push(
          <tr key={attribute.id}>
            <td style={{verticalAlign: 'middle'}}>{attribute.name}</td>
            <td className='text-center' style={currentStyle}>{currentRating ? currentRating.name : '-'}</td>
            <td className='text-center' style={targetStyle}>{targetRating ? targetRating.name : '-'}</td>
            <td>{measurement ? measurement.action : '-'}</td>
          </tr>
        )
      }.bind(this)))
    }

    var summaryTable = (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>Practice/Capability</th>
            <th className='text-center'>Current</th>
            <th className='text-center'>Target</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
        {summaryRows}
        </tbody>
      </Table>
    )

    if (Math.min.apply(Math, ratingSeries) < 0) {
      currentColors = []
      currentColors = ratingSeries.map(function (rank) {
        return (rank < 0 ? RED : BLUE)
      })
    }

    var currentTrace = {
      x: labels,
      y: ratingSeries,
      name: 'Current',
      type: 'bar',
      marker: {
        color: currentColors
      }
    }

    var targetTrace = {
      x: labels,
      y: targetSeries,
      name: 'Target',
      type: 'bar',
      marker: {
        color: GREY,
        line: {
          color: GREY,
          width: 5
        }
      }
    }

    var data = [targetTrace, currentTrace]

    var layout = {
      height: 450,
      width: 600,
      barmode: 'overlay',
      margin: {
        t: 30,
        b: 150
      },
      yaxis: {
        showgrid: true,
        tickmode: 'array',
        tickvals: rankValues,
        ticktext: rankNames,
        range: [rankMin, rankMax]
      },
      xaxis: {
        showgrid: true,
        tickangle: -45
      },
      bargap: 0.50,
      showlegend: true,
      autosize: true
    }

    var config = {
      scrollZoom: false,
      showLink: false
    }

    return (
      <div className='assessment-report'>
        <PlotlyComponent data={data} layout={layout} config={config}/>
        {summaryTable}
      </div>
    )
  }
})

module.exports = AssessmentReport
