# mock-amplitude-sdk

> Amplitude event manager. Simulates the front end implementation of logging events in the front end experience.

[![NPM](https://img.shields.io/npm/v/mock-amplitude-sdk.svg)](https://www.npmjs.com/package/mock-amplitude-sdk) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save mock-amplitude-sdk
```

or

``` bash
yarn add mock-amplitude-sdk
```

## Requirements

Node 10

## Usage

First, wrap the top-most level of your application with the ```AmplitudeProvider```
```jsx
import React, { Component } from "react";
import ExamplePage from "./components/ExamplePage";
import { AmplitudeProvider } from "mock-amplitude-sdk";

class App extends Component {
  render() {
    return (
      <AmplitudeProvider>
        <ExamplePage />
      </AmplitudeProvider>
    );
  }
}

export default App;
```
Any nested component requiring the amplitude context in the application should be wrapper via ```withAmplitudeContext```

Class Components
```jsx
import React, { Component } from 'react'

import { withAmplitudeContext } from 'mock-amplitude-sdk'

class Example extends Component {
  constructor(props) {
    super(props);
    
    this.handleLogEvent = props.context.handleLogEvent
  }
  
  handleLogClick = () => {
    this.handleLogEvent('event_name', {event_user: '1111'})  
  };
  
  render () {
    return (
      <button onClick={handleLogClick}/>
    )
  }
}

export default withAmplitudeContext(Example);
```

Functional Components
```jsx
import React, { Component } from 'react'

import { withAmplitudeContext } from 'mock-amplitude-sdk'

const Example = props => {
    const { handleLogEvent } = props.context;
    
    handleLogClick = () => {
      handleLogEvent('event_name', {event_user: '1111'})  
    };

    return (
      <button onClick={handleLogClick}/>
    )
}
```

## API

The following methods or variables can be used within the context of any component.


### handleAPIKeyCreate(api_key)
```
Initializes the amplitude instance to refer to the api_key. Without a backend instance supporting this mock library, it will be automatically validated to be true and will be lost on the closing of the application. A new api key can always be generated and used later on.
```
### handleLogEvent(eventName, eventProperties)
```
Main function used to track events within the application. All events will require an event name, but not all event will need event properties. These properties are in the form of objects i.e. {'user_id': 111, 'email': email@gmail.com}. All events will then be stored on a queue in the amplitude instance and will be flushed out on an interval of 2 minutes, or when flushEvents() is called.
```

### flushEvents()
```
Flush all events within the amplitude instance within the time interval, printing out the events (compressed to the first and last after 2 events). This function is automatically called every 2 minutes on the start of the amplitude session which can be invoked on startup of any application. The application can also reset the timer and force flush the events before the 2 minutes has passed.
```
### getEvents
```
Returns all events within the amplitude instance at that current time.
```
### generateAPIKey
```
Generates a random API key that will be used to track usage.
```
### apiKey
```
Returns the api key associated to the amplitude instance at that time
```
## License

MIT © [dong-alex](https://github.com/dong-alex)
