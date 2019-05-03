import React from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import CreateContainer from './containers/CreateContainer'
import CoderBot from './components/CoderBot/CoderBot'



class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route path="/forms/:templateId/:status?" component={CreateContainer} />
        <Route path="/error" render={() => <CoderBot code={500}/>} />
        <Route path="/404" render={() => <CoderBot code={404}/>} />
        <Route render={() => <CoderBot code={404}/>} />
      </Switch>
    )
  }
}

export default withRouter(Routes)
