'use strict'

var PropTypes = require('prop-types')

var React = require('react')
var createReactClass = require('create-react-class')
var _ = require('lodash')
var PlotlyComponent = require('./plotlyComponent')
var ReactBootstrap = require('react-bootstrap')
var Table = ReactBootstrap.Table
var ReactMarkdown = require('react-markdown')

var AssessmentReport = createReactClass({
  displayName: 'AssessmentReport',

  propTypes: {
    activeTab: PropTypes.number,
    eventKey: PropTypes.number,
    assessment: PropTypes.object,
    measurements: PropTypes.array,
    attributes: PropTypes.array,
    template: PropTypes.object
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

    rankMin -= 0.1
    rankMax += 0.1

    var summaryRows = []

    if (this.props.measurements !== null) {
      (this.props.attributes.map(function (attribute, i) {
        labels.push(attribute.name)

        var measurement = this.getMeasurementForAttribute(attribute)

        var currentRating = (measurement && measurement.rating) ? _.find(attribute.ratings, function (rating) { return measurement.rating === rating.id }) : null
        var targetRating = (measurement && measurement.target_rating) ? _.find(attribute.ratings, function (rating) { return measurement.target_rating === rating.id }) : null

        ratingSeries.push(currentRating ? currentRating.rank : 0)
        targetSeries.push(targetRating ? targetRating.rank : 0)

        var currentStyle = {
          'fontWeight': 'bold',
          'verticalAlign': 'middle'
        }
        var currentColour = (currentRating ? currentRating.colour : '')
        if (currentColour) {
          currentStyle['backgroundColor'] = currentColour
          currentStyle['color'] = (currentColour === 'Yellow') ? 'Black' : 'White'
        }
        var targetStyle = {
          'fontWeight': 'bold',
          'verticalAlign': 'middle'
        }
        var targetColour = (targetRating ? targetRating.colour : '')
        if (targetColour) {
          targetStyle['backgroundColor'] = targetColour
          targetStyle['color'] = (targetColour === 'Yellow') ? 'Black' : 'White'
        }

        summaryRows.push(
          <tr key={attribute.id}>
            <td style={{verticalAlign: 'middle', fontWeight: 'bold'}}>{attribute.name}</td>
            <td className='text-center' style={currentStyle}>{currentRating ? currentRating.name : '-'}</td>
            <td className='text-center' style={targetStyle}>{targetRating ? targetRating.name : '-'}</td>
            <td>
              {measurement && measurement.action
                ? <ReactMarkdown escapeHtml source={measurement.action} />
                : '-'}
            </td>
          </tr>
        )
      }, this))
    }

    var summaryTable = (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>Practice/Capability</th>
            <th className='text-center'>Current</th>
            <th className='text-center'>Target</th>
            <th>Actions</th>
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
      title: this.props.assessment.team.name + ' — ' + this.props.assessment.template.name,
      height: 480,
      width: 600,
      barmode: 'overlay',
      autosizable: true,
      margin: {
        l: 90,
        r: 10,
        t: 85,
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
      autosize: true,
      legend: {
        orientation: 'h',
        x: 0.65,
        y: 1.15
      }
    }

    var config = {
      scrollZoom: false,
      showLink: false,
      displaylogo: false,
      modeBarButtonsToRemove: [
        'zoom2d',
        'pan2d',
        'select2d',
        'lasso2d',
        'zoomIn2d',
        'zoomOut2d',
        'hoverClosestCartesian',
        'hoverCompareCartesian'
      ]
    }

    return (
      <div className='assessment-report'>
        <PlotlyComponent data={data} layout={layout} config={config} />
        {summaryTable}
      </div>
    )
  }
})

module.exports = AssessmentReport
