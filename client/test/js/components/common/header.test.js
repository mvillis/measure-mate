/* eslint-env jasmine */
'use strict'

var React = require('react')
var ReactBootstrap = require('react-bootstrap')
var Navbar = ReactBootstrap.Navbar
var expect = require('chai').expect
var shallow = require('enzyme').shallow
var Header = require('../../../../js/components/common/header')

describe('Header Component', function () {
  const wrapper = shallow(<Header />)

  it('contains a Navbar', function () {
    expect(wrapper.find(Navbar))
      .to
      .have
      .length(1)
  })
})

