'use strict'

var React = require('react')
var ReactDOM = require('react-dom')
var ReactRouter = require('react-router')
var browserHistory = ReactRouter.browserHistory
var Router = ReactRouter.Router
var Route = ReactRouter.Route
var IndexRoute = ReactRouter.IndexRoute
var IndexRedirect = ReactRouter.IndexRedirect
var Header = require('./components/common/header')
var Home = require('./components/home/home')
var Assessment = require('./components/assessment/assessment')
var Attribute = require('./components/assessment/attribute')
var Summary = require('./components/assessment/summary')
var Intro = require('./components/assessment/intro')
var AssessmentTable = require('./components/assessment/assessmentTable')
var Team = require('./components/team/team')
var TeamTable = require('./components/team/teamTable')
var NotFoundPage = require('./components/notFoundPage')
var About = require('./components/common/about')

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path='/' component={Header}>
      <IndexRoute component={Home} />
      <Route path='about' component={About} />
      <Route path='assessment'>
        <IndexRedirect to='list' />
        <Route path='list' component={AssessmentTable} />
        <Route path=':assessmentId' component={Assessment}>
          <IndexRedirect to='intro' />
          <Route path='intro' component={Intro} />
          <Route path='summary' component={Summary} />
          <Route path=':attribute' component={Attribute} />
        </Route>
      </Route>
      <Route path='team'>
        <IndexRedirect to='list' />
        <Route path='list' component={TeamTable} />
        <Route path=':teamId' component={Team} />
      </Route>
      <Route status={404} path='*' component={NotFoundPage} />
    </Route>
  </Router>,
  document.getElementById('app')
)
