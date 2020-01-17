import React, { Component } from "react";
import ExamplePage from "./components/ExamplePage";
import { AmplitudeProvider, withAmplitudeContext } from "mock-amplitude-sdk";

class App extends Component {
  render() {
    return (
      <AmplitudeProvider>
        <ExamplePage />
      </AmplitudeProvider>
    );
  }
}

export default withAmplitudeContext(App);
