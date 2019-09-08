import React, { Fragment } from 'react'
import { StatusBar} from 'react-native'
import Main from './Views/Main'
import * as keepAwake from './services/keep-awake'

export default App = () => {
  keepAwake.init();

  return (
    <Fragment>
      <StatusBar barStyle="light-content" backgroundColor='#000000'/>
      <Main/>
    </Fragment>
  );
};