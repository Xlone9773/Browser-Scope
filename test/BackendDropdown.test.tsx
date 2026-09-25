import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { BackendDropdown } from "../components/ui/BackendDropdown";

const options = [
  { id: "gpt", name: "GPT" },
  { id: "claude", name: "Claude" },
];

describe("BackendDropdown UI component tests", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // The trigger button lives inside the render container; portal options are
  // appended to document.body and would make role/text queries ambiguous.
  let trigger: HTMLElement;
  const renderDropdown = (props?: Partial<React.ComponentProps<typeof BackendDropdown>>) => {
    const view = render(
      <BackendDropdown
        value="gpt"
        options={options}
        onChange={() => {}}
        colorClass="indigo"
        {...props}
      />
    );
    trigger = view.container.querySelector("button")!;
    return view;
  };

  const portal = () => document.getElementById("dropdown-portal-container");
  const portalOption = (name: string) =>
    [...portal()!.querySelectorAll("button span")].find(
      (sp) => sp.textContent === name
    );

  it("should render the selected option name", () => {
    renderDropdown();
    expect(screen.getByText("GPT")).toBeInTheDocument();
  });

  it("should open the portal on click", () => {
    renderDropdown();
    act(() => {
      fireEvent.click(trigger);
    });
    expect(portal()).toBeInTheDocument();
    expect(portalOption("Claude")).toBeTruthy();
  });

  it("should call onChange and close after the 200ms exit animation", () => {
    const onChange = vi.fn();
    renderDropdown({ onChange });
    act(() => {
      fireEvent.click(trigger);
    });
    act(() => {
      fireEvent.click(portalOption("Claude")!);
    });
    expect(onChange).toHaveBeenCalledWith("claude");

    // Exit animation window: still mounted before 200ms, gone after.
    act(() => {
      vi.advanceTimersByTime(199);
    });
    expect(portal()).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(portal()).not.toBeInTheDocument();
  });

  it("should defer outside-click closing by 50ms", () => {
    renderDropdown();
    act(() => {
      fireEvent.click(trigger);
    });
    expect(portal()).toBeInTheDocument();

    // Listener not yet attached: outside click is ignored.
    act(() => {
      fireEvent.mouseDown(document.body);
    });
    expect(portal()).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(50);
    });
    act(() => {
      fireEvent.mouseDown(document.body);
    });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(portal()).not.toBeInTheDocument();
  });

  it("should not close when clicking inside the portal", () => {
    renderDropdown();
    act(() => {
      fireEvent.click(trigger);
    });
    act(() => {
      vi.advanceTimersByTime(50);
    });
    act(() => {
      fireEvent.mouseDown(portal()!);
    });
    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(portal()).toBeInTheDocument();
  });

  it("should close on window resize", () => {
    renderDropdown();
    act(() => {
      fireEvent.click(trigger);
    });
    act(() => {
      fireEvent(window, new Event("resize"));
    });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(portal()).not.toBeInTheDocument();
  });

  it("should mark the active option", () => {
    renderDropdown();
    act(() => {
      fireEvent.click(trigger);
    });
    const check = document.querySelector(".lucide-check");
    expect(check).not.toBeNull();
    // The active option (GPT) hosts the check icon as a sibling of its label.
    expect(portalOption("GPT")!.parentElement).toContainElement(
      check as HTMLElement
    );
  });

  it("should clear the pending close timer on unmount (regression)", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { unmount } = renderDropdown();
    act(() => {
      fireEvent.click(trigger);
    });
    // Begin closing (starts the 200ms timer) then unmount mid-animation.
    act(() => {
      fireEvent.click(trigger);
    });
    unmount();

    // If the orphan timer survived, it would fire after teardown and
    // produce an "act(...)" warning via console.error.
    act(() => {
      vi.advanceTimersByTime(500);
    });

    const actWarning = errorSpy.mock.calls.find(
      (args) =>
        typeof args[0] === "string" && args[0].includes("not wrapped in act")
    );
    expect(actWarning).toBeUndefined();
    errorSpy.mockRestore();
  });
});
