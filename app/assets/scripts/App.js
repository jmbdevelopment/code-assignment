import React from 'react'
import ReactDOM from 'react-dom'

import Header from './modules/Header'
import Footer from './modules/Footer'
import DashboardView from './modules/DashboardView'

import "../styles/styles.css"
import "lazysizes"

class App extends React.Component {
  render() {
    return (
      <>
        <Header />
        <DashboardView />
        <Footer />
      </>
      )
  }
}

ReactDOM.render(<App />, document.getElementById("app"))

if (module.hot) {
  module.hot.accept()
}