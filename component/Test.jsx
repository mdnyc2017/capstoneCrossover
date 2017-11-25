import React, { Component } from "react";
import { db } from "~/fire";

export default class extends Component {
  state = {
    messages: null
  };

  componentDidMount() {
    db
      .collection("test")
      .onSnapshot(snapshot => this.setState({ messages: snapshot.docs }));
  }

  render() {
    if (!this.state.messages) return "Loading...";
    return this.state.messages.map(snapshot => (
      <Message data={snapshot.data()} />
    ));
  }
}

function Message(props) {
  return <pre>{JSON.stringify(props.data, 0, 2)}</pre>;
}
