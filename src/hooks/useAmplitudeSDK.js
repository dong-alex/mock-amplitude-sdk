import { useEffect, useState } from "react";
import Event from "./events/Event";

const FLUSH_INTERVAL = 60 * 1000;
const OMITTED_EVENT_THRESHOLD = 2;

/**
 * NOTE - localStorage is used for caching and if there was instance of a backend used that would store the flushed events,
 * an API would also be used to handle API validation and generation. So far, there would be no reliable way of storing API keys
 * for each customer. Therefore, any API key string can be acted as a validated key for the mock SDK
 */

/**
 * Creates the API for the mock amplitude SDK. This custom hook will only live within the amplitude provider.
 * Applications will utilize the providers and their functions which will track the events when logEvents is called anywhere
 * in the application
 */
const useAmplitudeSDK = () => {
  /**
   * automated timer used to flush the events at a set interval. Given a real backend server, these events would be flushed out into
   * the database and stored there
   */
  const eventTimer = () => {
    return setInterval(() => {
      flushAllEvents();
    }, FLUSH_INTERVAL);
  };

  /**
   * initializes the SDK's state and the associated user's information that will be used for logging events
   */
  const [events, setEvents] = useState([]);
  const [flush, setFlush] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [timer, setTimer] = useState(null);

  /**
   * restores any past events that were previously queued up when the application was terminated. The events
   * were stored into the local storage as a cached version
   */
  useEffect(() => {
    let loadEvents = localStorage.getItem("amplitude_events");
    if (loadEvents !== null) {
      serializeEvents(JSON.parse(loadEvents));
    }
  }, []);

  /**
   * initialization with an api key that gets validated will issue the amplitude SDK to start recording
   * events and flushing them out based on a time interval
   */
  useEffect(() => {
    if (apiKey) {
      setTimer(eventTimer());
    } else {
      clearInterval(timer);
    }
  }, [apiKey]);

  /**
   * effect that causes the events to be flushed out within the SDK. This will also trigger the local storage to remove
   * the cached version.
   */
  useEffect(() => {
    if (flush && events.length != 0) {
      displayFlushedEvents();
      setFlush(false);
      localStorage.removeItem("amplitude_events");
      setEvents([]);

      // resets the interval if flushed - so we do not have an extra flush event at max capacity and then time exceeds
      clearInterval(timer);
      setTimer(eventTimer());
    }
  }, [flush]);

  /**
   * monitors the queue to determine if we have reached the limit of our queue, where we will then force the queue to flush
   * out the events that were stored inside.
   */
  useEffect(() => {
    if (events.length == 50) {
      setFlush(true);
    }
  }, [events]);

  const initializeAPIKey = key => {
    if (checkValidKey(key)) {
      setApiKey(key);
    }
  };

  /**
   * Given an input of an event name and event properties, creates an Event object that will be queued up and flushed
   * out every minute
   * @param {String} eventName
   * @param {Object} eventProperties
   */
  const logEvent = (eventName, eventProperties) => {
    const event = new Event(eventName, eventProperties);
    const newEvents = [...events, event];
    setEvents(newEvents);
    localStorage.setItem("amplitude_events", JSON.stringify(newEvents));
  };

  /**
   * triggers an effect that causes the events queued up to be flushed out
   */
  const flushAllEvents = () => {
    setFlush(true);
  };

  /**
   * loaded events from the local sotrage are parsed into regular objects, this function ensures they are reinitialized
   * back into proper Event objects
   * @param {Object} loadEvents
   */
  const serializeEvents = loadEvents => {
    const eventObjects = [];
    loadEvents.forEach(eventObject => {
      eventObjects.push(
        new Event(eventObject.event_name, eventObject.event_properties)
      );
    });
    setEvents([...eventObjects]);
  };

  /**
   * utility function to help print out the flushed events in the proper format. There will be 2 formats:
   * let OET be the OMITTED_EVENT_THRESHOLD (default to 2)
   * 1. Flush event with only OET events queued
   * 2. Flush event with more than OEt events queued
   */
  const displayFlushedEvents = () => {
    console.log(`${events.length.toString()} events are flushed`);

    if (events.length <= OMITTED_EVENT_THRESHOLD) {
      events.forEach((event, index) => {
        console.log(`Event ${(index + 1).toString()}`);
        console.log(event);
      });
    } else {
      const firstEvent = events[0];
      const lastEvent = events[events.length - 1];

      console.log("Event 1");
      console.log(firstEvent);

      console.log(
        `${(
          events.length - OMITTED_EVENT_THRESHOLD
        ).toString()} events were omitted to print ......`
      );

      console.log(`Event ${events.length.toString()}`);
      console.log(lastEvent);
    }
    setEvents([]);
  };

  /**
   * helper function to determine if an API key generated will be unique, and valid for use. Without some storage system in the backend server, we can't
   * store important credentials properly
   * @param {String} key
   */
  const checkValidKey = key => {
    return true;
  };
  return {
    apiKey,
    events,
    initializeAPIKey,
    logEvent,
    flushAllEvents
  };
};

export default useAmplitudeSDK;
