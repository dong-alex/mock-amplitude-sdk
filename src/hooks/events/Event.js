import generateUUID from "../../utils/generateUUID";

// Generic class for events being tracked via AmplitudeSDK
export default class Event {
  constructor(eventName, eventProperties) {
    this.event_id = generateUUID();
    this.event_name = eventName;
    this.event_properties = eventProperties;
  }

  getEventID() {
    return this.event_id;
  }

  getEventName() {
    return this.event_name;
  }

  getEventPropertiesKeys() {
    return this.event_properties ? Object.keys(this.event_properties) : null;
  }

  getEventPropertiesValues() {
    return this.event_properties ? Object.values(this.event_properties) : null;
  }

  getEventProperties() {
    return this.event_properties;
  }
}
