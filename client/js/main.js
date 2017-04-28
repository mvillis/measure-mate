'use strict'

var OpbeatReact = require('opbeat-react')

OpbeatReact.configure({
  orgId: 'd7dba82e5f3c4f57b6ccda5c1f876bc6',
  appId: '708c8739c2'
})

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
var ReactRedirect = require('react-redirect')

const OpbeatRouter = OpbeatReact.wrapRouter(Router)

var Admin = React.createClass({
  render: function () {
    return (
      <ReactRedirect location='/admin/' />
    )
  }
})

var Export = React.createClass({
  render: function () {
    return (
      <ReactRedirect location='/export/' />
    )
  }
})

ReactDOM.render(
  <OpbeatRouter history={browserHistory}>
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
      <Route path='admin' component={Admin} />
      <Route path='export' component={Export} />
      <Route status={404} path='*' component={NotFoundPage} />
    </Route>
  </OpbeatRouter>,
  document.getElementById('app')
)
