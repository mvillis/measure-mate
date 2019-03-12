'use strict'

var React = require('react')
var createReactClass = require('create-react-class')
var ReactBootstrap = require('react-bootstrap')
var Button = ReactBootstrap.Button
var ReactRouterBootstrap = require('react-router-bootstrap')
var LinkContainer = ReactRouterBootstrap.LinkContainer

var NotFoundPage = createReactClass({
  displayName: 'NotFoundPage',

  render: function () {
    return (
      <div>
        <div className='container-fluid'>
          <div className='jumbotron'>
            <h1>Whoops!</h1>
            <p>Sorry, there is nothing to see here.</p>
            <p>
              <LinkContainer to={{ pathname: '/' }}>
                <Button>Back to Home</Button>
              </LinkContainer>
            </p>
          </div>
        </div>
      </div>
    )
  }
})

module.exports = NotFoundPage
