import React, { createContext } from "react";
import useAmplitudeSDK from "../hooks/useAmplitudeSDK";
import generateUUID from "../utils/generateUUID";

/**
 * Creates a global context within any target application that will allow usage of the mock SDK
 */
export const AmplitudeContext = createContext();

/**
 * Provider for the amplitude context, this is the access point to all of the functionality that you can
 * use with the mock amplitude SDK. Any adjustments to the SDK and functionality itself will be managed through here.
 * The target application won't be responsible at all for managing this functionality as this will be a seperate library
 * @param {Object} props
 */
export const AmplitudeProvider = props => {
  const {
    apiKey,
    sessionStarted,
    events,
    flushAllEvents,
    initializeAPIKey,
    closeSession,
    logEvent
  } = useAmplitudeSDK();

  const handleAPIKeyCreate = apiKey => {
    initializeAPIKey(apiKey);
    return true;
  };

  const handleEndSession = () => {
    closeSession();
  };

  const handleLogEvent = (eventName, eventProperties) => {
    logEvent(eventName, eventProperties);
  };

  const generateAPIKey = () => {
    return generateUUID();
  };

  const flushEvents = () => {
    flushAllEvents();
  };

  return (
    <AmplitudeContext.Provider
      value={{
        apiKey,
        events,
        flushEvents,
        generateAPIKey,
        handleAPIKeyCreate,
        handleLogEvent,
        handleEndSession,
        sessionStarted
      }}
    >
      {props.children}
    </AmplitudeContext.Provider>
  );
};

/**
 * Utility wrapper function that will wrap any component in a target application to be given the amplitude functionality for logging events
 * Afterwards, the application will only have to pass in the event name and properties after authentication via the api key which is validated
 * to be true without any sort of data storage for managing valid keys.
 * @param {JSXElement} Component
 */
export const withAmplitudeContext = Component => {
  return function WrapperComponent(props) {
    return (
      <AmplitudeContext.Consumer>
        {state => <Component {...props} context={state} />}
      </AmplitudeContext.Consumer>
    );
  };
};
