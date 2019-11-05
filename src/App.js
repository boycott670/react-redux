import React, {Component} from 'react';
import Provider, {connect} from './Provider';
import './App.css';

const store = (function () {
  let state = [1, 2, 3];

  let inc = 0;
  let subscribers = {};

  return {
    getState: () => state,
    dispatch: ({type = 'UNKNOWN', payload} = {}) => {
      if (type === 'ADD') {
        state = [...state, 1];
        for (let subscriber in subscribers) subscribers[subscriber]();
      }
    },
    subscribe: (cb) => {
      inc = inc + 1;
      subscribers[inc] = cb;
      return () => {
        subscribers = {...subscribers, [inc]: () => {}};
      };
    }
  };
})();

class Child extends Component {
  render() {
    return <button onClick={() => this.props.call()}>{this.props.size}</button>;
  }
}

Child = connect(
  state => ({size: (state || []).length}),
  dispatch => ({call: () => dispatch({type: 'ADD', payload: 1})})
)(Child);

function App() {
  return (
    <Provider store={store}>
      <Child/>
    </Provider>
  );
}

export default App;
