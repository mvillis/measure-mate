'use strict'

var React = require('react')
var expect = require('chai').expect
var render = require('enzyme').render
var About = require('../../../../js/components/common/about')

describe('About Component', function () {
  const wrapper = render(<About />)

  it('contains project link', function () {
    const node = wrapper.find('.logo-text')

    expect(node.attr('href'))
      .to
      .contain('https://github.com/mvillis/measure-mate')

    expect(node.text())
      .to
      .contain('Measure Mate')
  })

  it('contains slogan text', function () {
    expect(wrapper.find('.logo-slogan-text').text())
      .to
      .contain('A tool to track maturity assessments for your team')
  })
})

