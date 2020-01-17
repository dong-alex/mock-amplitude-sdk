import React, { useState } from "react";
import { withAmplitudeContext } from "mock-amplitude-sdk";

const ExamplePage = props => {
	const {
    apiKey,
    getEvents,
    handleAPIKeyCreate,
    handleLogEvent,
    generateAPIKey
  } = props.context;
  const events = getEvents();

  const [currentKey, setCurrentKey] = useState("");

  const handleSessionClick = () => {
    handleAPIKeyCreate(currentKey);
  };

  const handleLogClickWithProperties = () => {
    handleLogEvent("test event", { user_id: "test user" });
  };

  const handleLogClick = () => {
    handleLogEvent("test event");
  };

  const handleGenerateAPI = () => {
    const newAPI = generateAPIKey();
    setCurrentKey(newAPI);
  };

  return (
    <div data-testid="amplitude-ui">
      <input value={currentKey} readOnly />
      <button data-testid="generate-api-button" onClick={handleGenerateAPI}>
        Generate API Key
      </button>
      <button data-testid="session-button" onClick={handleSessionClick}>
        Start Amplitude Session
      </button>
      {apiKey ? (
        <div data-testid="message">{apiKey}</div>
      ) : (
        <div data-testid="no-api-key-message">
          There is no api-key associated yet
        </div>
      )}
      <button
        data-testid="event-button-properties"
        onClick={handleLogClickWithProperties}
      >
        Log Event with properties
      </button>
      <button data-testid="event-button" onClick={handleLogClick}>
        Log Event
      </button>
      {events.map(event => {
        const id = event.getEventID();
        return (
          <div data-testid={`log-event-${id}`} key={`event-${id}`}>
            <label data-testid={`name-event-${id}`}>
              {event.getEventName()}
            </label>
            <label data-testid={`key-event-${id}`}>
              {JSON.stringify(event.getEventPropertiesKeys())}
            </label>
            <label data-testid={`value-event-${id}`}>
              {JSON.stringify(event.getEventPropertiesValues())}
            </label>
            <label>{JSON.stringify(event.getEventProperties())}</label>
          </div>
        );
      })}
    </div>
  );
};

export default withAmplitudeContext(ExamplePage);
