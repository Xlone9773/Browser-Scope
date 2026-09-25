import React from "react";
import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Tabs, TabItem } from "../components/ui/Tabs";

// jsdom has no scrollIntoView; Tabs uses it to center the active tab.
const scrollIntoViewSpy = vi.fn();
beforeAll(() => {
  Element.prototype.scrollIntoView = scrollIntoViewSpy as unknown as Element["scrollIntoView"];
});

afterEach(() => {
  scrollIntoViewSpy.mockClear();
});

const items: TabItem[] = [
  { id: "one", label: "One" },
  { id: "two", label: "Two", badge: <span>9</span> },
  { id: "three", label: "Three" },
  { id: "four", label: "Four", disabled: true },
];

describe("Tabs UI component tests", () => {
  it("should render all items with tab roles and aria state", () => {
    render(<Tabs items={items} activeTab="one" onChange={() => {}} />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(4);
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(tabs[1]).toHaveAttribute("aria-selected", "false");
    expect(tabs[0]).toHaveAttribute("data-active", "true");
    expect(tabs[0]).toHaveAttribute(
      "aria-controls",
      "tabs-nav-panel-one"
    );
    expect(screen.getByText("9")).toBeInTheDocument(); // badge slot
  });

  it("should call onChange when a tab is clicked", () => {
    const onChange = vi.fn();
    render(<Tabs items={items} activeTab="one" onChange={onChange} />);
    fireEvent.click(screen.getByText("Two"));
    expect(onChange).toHaveBeenCalledWith("two");
  });

  it("should not fire onChange for a disabled tab", () => {
    const onChange = vi.fn();
    render(<Tabs items={items} activeTab="one" onChange={onChange} />);
    fireEvent.click(screen.getByRole("tab", { name: "Four" }));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole("tab", { name: "Four" })).toBeDisabled();
  });

  it("should move right with ArrowRight skipping disabled items and wrapping", () => {
    // Controlled component: needs a stateful harness so activeTab follows
    // onChange between key presses.
    const Harness: React.FC = () => {
      const [active, setActive] = React.useState("one");
      return (
        <Tabs items={items} activeTab={active} onChange={(id) => setActive(id)} />
      );
    };
    render(<Harness />);
    const tablist = screen.getByRole("tablist");

    fireEvent.keyDown(tablist, { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: /Two/ })).toHaveAttribute(
      "aria-selected",
      "true"
    );

    fireEvent.keyDown(tablist, { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: /Three/ })).toHaveAttribute(
      "aria-selected",
      "true"
    );

    // three -> next enabled wraps back to one (four is disabled)
    fireEvent.keyDown(tablist, { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: /^One/ })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("should move left with ArrowLeft wrapping backwards", () => {
    const onChange = vi.fn();
    render(<Tabs items={items} activeTab="one" onChange={onChange} />);
    const tablist = screen.getByRole("tablist");

    // one -> last enabled (three), four skipped
    fireEvent.keyDown(tablist, { key: "ArrowLeft" });
    expect(onChange).toHaveBeenLastCalledWith("three");
  });

  it("should jump to first/last enabled tab with Home/End", () => {
    const onChange = vi.fn();
    render(<Tabs items={items} activeTab="two" onChange={onChange} />);
    const tablist = screen.getByRole("tablist");

    fireEvent.keyDown(tablist, { key: "Home" });
    expect(onChange).toHaveBeenLastCalledWith("one");

    fireEvent.keyDown(tablist, { key: "End" });
    expect(onChange).toHaveBeenLastCalledWith("three"); // four disabled
  });

  it("should ignore keyboard navigation when active tab is disabled", () => {
    const onChange = vi.fn();
    render(<Tabs items={items} activeTab="four" onChange={onChange} />);
    const tablist = screen.getByRole("tablist");

    fireEvent.keyDown(tablist, { key: "ArrowRight" });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("should scroll the active tab into center view", () => {
    render(<Tabs items={items} activeTab="two" onChange={() => {}} />);
    expect(scrollIntoViewSpy).toHaveBeenCalled();
    expect(scrollIntoViewSpy).toHaveBeenCalledWith(
      expect.objectContaining({ inline: "center" })
    );
  });

  it("should not scroll when autoScroll is disabled", () => {
    render(
      <Tabs items={items} activeTab="two" onChange={() => {}} autoScroll={false} />
    );
    expect(scrollIntoViewSpy).not.toHaveBeenCalled();
  });

  it("should render pills and underline variants with the same semantics", () => {
    const onChange = vi.fn();
    const { unmount } = render(
      <Tabs items={items} activeTab="one" onChange={onChange} variant="pills" />
    );
    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(4);
    fireEvent.click(screen.getByText("Two"));
    expect(onChange).toHaveBeenCalledWith("two");
    unmount();

    render(
      <Tabs items={items} activeTab="one" onChange={onChange} variant="underline" />
    );
    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /^One/ })).toHaveAttribute(
      "data-active",
      "true"
    );
  });

  it("should respect a custom id prefix", () => {
    render(
      <Tabs items={items} activeTab="one" onChange={() => {}} id="my-tabs" />
    );
    expect(screen.getByRole("tab", { name: /One/ })).toHaveAttribute(
      "id",
      "my-tabs-tab-one"
    );
  });
});
