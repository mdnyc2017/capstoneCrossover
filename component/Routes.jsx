import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Stories from './Stories'

const Routes = (props) =>(
   <Switch>
       <Route exact path='/stories' render={(routeProps)=> <Stories user={props.user} />} />
        
    </Switch>



)
   

export default Routes