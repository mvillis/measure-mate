'use strict'

import initOpbeat from 'opbeat-react'

import { Router } from 'react-router'
import { wrapRouter } from 'opbeat-react'

const OpbeatRouter = wrapRouter(Router)

initOpbeat({
  orgId: 'd7dba82e5f3c4f57b6ccda5c1f876bc6',
  appId: '708c8739c2'
})

import React from 'react'
import ReactDOM from 'react-dom'
import ReactRedirect from 'react-redirect'
import { browserHistory, Route, IndexRoute, IndexRedirect } from 'react-router'

import Header from './components/common/header'
import Home from './components/home/home'
import Assessment from './components/assessment/assessment'
import Attribute from './components/assessment/attribute'
import Summary from './components/assessment/summary'
import Intro from './components/assessment/intro'
import AssessmentTable from './components/assessment/assessmentTable'
import Team from './components/team/team'
import TeamTable from './components/team/teamTable'
import NotFoundPage from './components/notFoundPage'
import About from './components/common/about'

const Admin = React.createClass({
  render: function () {
    return (
      <ReactRedirect location='/admin/' />
    )
  }
})

const Export = React.createClass({
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
