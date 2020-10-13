import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import './styles/index.scss'

import AppCanvas from './js/components/AppCanvas'

render(
  <AppContainer>
    <AppCanvas />
  </AppContainer>,
  document.querySelector('#root')
);