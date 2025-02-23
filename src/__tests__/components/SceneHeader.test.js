/* globals describe it expect */
/* eslint-disable flowtype/require-valid-file-annotation */

import * as React from 'react'
import ShallowRenderer from 'react-test-renderer/shallow'

import { getTheme } from '../../components/services/ThemeContext.js'
import { SceneHeaderComponent } from '../../components/themed/SceneHeader.js'

describe('SceneHeader', () => {
  it('should render with loading props', () => {
    const renderer = new ShallowRenderer()

    const props = {
      title: 'string',
      children: 'hello',
      underline: true,
      withTopMargin: true,
      theme: getTheme()
    }
    const actual = renderer.render(<SceneHeaderComponent {...props} />)

    expect(actual).toMatchSnapshot()
  })
})
