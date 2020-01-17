import React from "react";
import { render, fireEvent, act, cleanup } from "@testing-library/react";
import { AmplitudeProvider } from "../api/AmplitudeAPI";
import TestComponent from "./TestComponent";

jest.useFakeTimers();

describe("AmplitudeProvider Test", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    cleanup();
  });

  it("should render a component with AmplitudeProvider information", () => {
    const { container } = render(
      <AmplitudeProvider>
        <TestComponent />
      </AmplitudeProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it("should render the message where there is an api key associated", async () => {
    const { getByTestId } = render(
      <AmplitudeProvider>
        <TestComponent />
      </AmplitudeProvider>
    );

    const generateButton = getByTestId("generate-api-button");
    const sessionButton = getByTestId("session-button");

    act(() => {
      fireEvent.click(generateButton);
    });

    act(() => {
      fireEvent.click(sessionButton);
    });

    const apiMessage = getByTestId("message");
    expect(apiMessage.textContent).not.toEqual("");
  });

  it("should flush out events after the time limit of 1 minute has passed", () => {
    const { getByTestId } = render(
      <AmplitudeProvider>
        <TestComponent />
      </AmplitudeProvider>
    );

    const generateButton = getByTestId("generate-api-button");
    const sessionButton = getByTestId("session-button");
    const eventButton = getByTestId("event-button");
    const eventButtonWithProperties = getByTestId("event-button-properties");

    act(() => {
      fireEvent.click(generateButton);
    });

    act(() => {
      fireEvent.click(sessionButton);
    });

    act(() => {
      fireEvent.click(eventButton);
    });

    act(() => {
      fireEvent.click(eventButtonWithProperties);
    });

    act(() => {
      jest.runTimersToTime(60 * 1000);
    });
  });

  it("should load any previous events that were stored locally when the application was last killed", async () => {
    const event1 = new Event("testEvent1");
    const event2 = new Event("testEvent2", { user_id: "11111" });

    localStorage.setItem("amplitude_events", JSON.stringify([event1, event2]));

    const { findAllByTestId } = render(
      <AmplitudeProvider>
        <TestComponent />
      </AmplitudeProvider>
    );

    const allEvents = await findAllByTestId(/log-event-/i);

    expect(allEvents).toHaveLength(2);
  });

  it("should remove all events within the time frame when you exceeded 50 events", () => {
    const { getByTestId } = render(
      <AmplitudeProvider>
        <TestComponent />
      </AmplitudeProvider>
    );

    const generateButton = getByTestId("generate-api-button");
    const sessionButton = getByTestId("session-button");
    const eventButton = getByTestId("event-button");

    act(() => {
      fireEvent.click(generateButton);
    });
    act(() => {
      fireEvent.click(sessionButton);
    });

    for (var i = 0; i < 50; i++) {
      act(() => {
        fireEvent.click(eventButton);
      });
    }
  });
});
