"use strict";

var React = require('react');
var _ = require('underscore');
var PlotlyComponent = require('./plotlyComponent');
var ReactBootstrap = require('react-bootstrap');
var Table = ReactBootstrap.Table;

var AssessmentReport = React.createClass({
  propTypes: {
    active_tab: React.PropTypes.number,
    eventKey: React.PropTypes.number,
    assessment: React.PropTypes.object,
    measurements: React.PropTypes.array,
    attributes: React.PropTypes.array,
    template: React.PropTypes.object
  },
  shouldComponentUpdate: function (nextProps, nextState) {
    if (nextProps.active_tab === this.props.eventKey) {
      return true
    }
    return false;
  },
  getAttributeForRating: function(query_rating) {
    var matching_attribute = null
    for (var i = 0; i<this.props.template.attributes.length; i++) {
      for (var ii = 0; ii<this.props.template.attributes[i].ratings.length; ii++) {
        if (query_rating == this.props.template.attributes[i].ratings[ii].id) {
          matching_attribute = this.props.template.attributes[i].id;
          break;
        }
      }
    }
    return matching_attribute;
  },
  getMeasurementForAttribute: function(attribute) {
    if (this.props.measurements != null) {
      for (var i=0; i < this.props.measurements.length; i++) {
        if (attribute.id == this.getAttributeForRating(this.props.measurements[i].rating)) {
          return this.props.measurements[i];
          break;
        }
      };
    } else {
      return null;
    }
  },
  render: function() {
    var BLUE = "#0000CC";
    var RED = "#CC0000";
    var GREY = "#CCCCCC";

    var labels = [];
    var target_series = [];
    var rating_series = [];
    var current_colors = BLUE;

    // assume that rating names & ranks are the same for all attributes
    var ratings = this.props.template.attributes[0].ratings.map( function (rating) {
      return { "rank": rating.rank, "name": rating.name };
    });

    if ( ! _.find(ratings, function(rating){ return rating.rank == 0; })) {
      ratings.push( { "rank":  0, "name": "N/A", } );
      ratings.sort(function (a, b) { return a.rank - b.rank; })
    }

    var rank_values = [];
    var rank_names = [];
    var rank_min = null;
    var rank_max = null;
    ratings.forEach(function (rating, i) {
      rank_values.push(rating.rank);
      rank_names.push(rating.name);
      rank_min = Math.min(rank_min, rating.rank);
      rank_max = Math.max(rank_max, rating.rank);
    });

    var summaryRows = [];

    if (this.props.measurements != null) {
      (this.props.attributes.map(function (attribute, i) {
        labels.push(attribute.name);

        var measurement = this.getMeasurementForAttribute(attribute);

        var current_rating = (measurement && measurement.rating) ? _.find(attribute.ratings, function(rating){ return measurement.rating == rating.id; }) : null;
        var target_rating = (measurement && measurement.target_rating) ? _.find(attribute.ratings, function(rating){ return measurement.target_rating == rating.id; }) : null;

        rating_series.push(current_rating ? current_rating.rank : 0);
        target_series.push(target_rating ? target_rating.rank : 0);

        summaryRows.push(
          <tr key={attribute.id}>
            <td>{attribute.name}</td>
      <td className={ "text-center" + (current_rating ? " rating-" + current_rating.name : "") }>{current_rating ? current_rating.name : '-'}</td>
            <td className={ "text-center" + (target_rating ? " rating-" + target_rating.name : "") }>{target_rating ? target_rating.name : '-'}</td>
          </tr>
        )
      }.bind(this)));
    }

    var summaryTable = (
      <Table striped bordered condensed hover className="assessment-report">
        <thead>
          <tr>
            <th>Practice/Capability</th>
            <th className="text-center">Current</th>
            <th className="text-center">Target</th>
          </tr>
        </thead>
        <tbody>
        {summaryRows}
        </tbody>
      </Table>
    );

    if (Math.min.apply(Math, rating_series) < 0) {
      current_colors = [];
      current_colors = rating_series.map(function (rank) {
        return (rank < 0 ? RED : BLUE);
      });
    }

    var current_trace = {
      x: labels,
      y: rating_series,
      name: 'Current',
      type: 'bar',
      marker: {
        color: current_colors,
      }
    };

    var target_trace = {
      x: labels,
      y: target_series,
      name: 'Target',
      type: 'bar',
      marker: {
        color: GREY,
        line: {
          color: GREY,
          width: 5
        }
      }
    };

    var data = [target_trace, current_trace];

    var layout = {
      height: 450,
      width: 600,
      barmode: 'overlay',
      margin: {
        t: 30,
        b: 150,
      },
      yaxis: {
        showgrid: true,
        tickmode: 'array',
        tickvals: rank_values,
        ticktext: rank_names,
        range: [rank_min, rank_max],
      },
      xaxis: {
        showgrid: true,
        tickangle: -45
      },
      bargap: 0.50,
      showlegend: true,
      autosize: true,
    };

    var config = {
      scrollZoom: false,
      showLink: false
    }

    return (
      <div className="assessment-report">
        <PlotlyComponent data={data} layout={layout} config={config}/>
        {summaryTable}
      </div>
    );
  }
});

module.exports = AssessmentReport;
