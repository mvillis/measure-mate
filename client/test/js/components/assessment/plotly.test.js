'use strict'

require('../../jsdom.setup.js')

var React = require('react')
var expect = require('chai').expect
var enzyme = require('enzyme')
var render = enzyme.render
var mount = enzyme.mount
var PlotlyComponent = require('../../../../js/components/assessment/plotlyComponent')

const mockedData = [
  {
    x: ['one', 'two', 'three'],
    y: [1, 2, 3],
    name: 'Current',
    type: 'bar',
    marker: {
      color: '#337ab7'
    }
  },
  {
    x: ['one', 'two', 'three'],
    y: [2, 4, 6],
    name: 'Target',
    type: 'bar',
    marker: {
      color: '#b7b7b7',
      line: {
        color: '#b7b7b7',
        width: 5
      }
    }
  }
]

const mockedLayout = {}
const mockedConfig = {}

describe('Plotly component', function () {
  it('plotly render', function () {
    const wrapper = render(<PlotlyComponent data={mockedData} layout={mockedLayout} config={mockedConfig} />)

    expect(wrapper.find('div'))
      .to
      .have
      .length(1)
  })

  it.skip('plotly mount', function () {
    // TODO: shim enough of D3 to get this to run
    // See also: https://gist.github.com/etpinard/bee7d62b43b6bb286950

    const wrapper = mount(<PlotlyComponent data={mockedData} layout={mockedLayout} config={mockedConfig} />)

    expect(wrapper.find('.plotly'))
      .to
      .have
      .length(1)
  })
})
