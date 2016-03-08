'use strict'

var React = require('react')
var ReactDOM = require('react-dom')
var ReactRouter = require('react-router')
var hashHistory = ReactRouter.hashHistory
var Router = ReactRouter.Router
var Route = ReactRouter.Route
var Header = require('./components/common/header')
var Home = require('./components/home/home')
var AttributeList = require('./components/assessment/attributeList')
var AssessmentTable = require('./components/assessment/assessmentTable')
var NotFoundPage = require('./components/notFoundPage')

ReactDOM.render(
  <Router history={hashHistory}>
    <Route component={Header}>
      <Route path='/' component={Home}/>
      <Route path='/assessment/list' component={AssessmentTable}/>
      <Route path='/assessment/:id' component={AttributeList}/>
      <Route status={404} path='*' component={NotFoundPage} />
    </Route>
  </Router>,
  document.getElementById('app')
)
