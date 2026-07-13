import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { SectionGroup } from "../components/ui/SectionGroup";

describe("SectionGroup UI component tests", () => {
  it("should render title and children", () => {
    render(
      <SectionGroup title="Test Title" icon={<span data-testid="icon" />}>
        <div>Child content</div>
      </SectionGroup>
    );
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });

  it("should collapse and expand when clicked", () => {
    render(
      <SectionGroup title="Test Title" icon={<span />} defaultExpanded={true}>
        <div>Child content</div>
      </SectionGroup>
    );
    
    // Initially expanded
    const expandButton = screen.getByRole("button");
    expect(expandButton).toHaveAttribute("aria-label", "Collapse section");
    
    // Click to collapse
    act(() => {
      fireEvent.click(expandButton);
    });
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Expand section");
    
    // Click header to expand
    act(() => {
      fireEvent.click(screen.getByText("Test Title"));
    });
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Collapse section");
  });

  it("should be collapsed initially if defaultExpanded is false", () => {
    render(
      <SectionGroup title="Test Title" icon={<span />} defaultExpanded={false}>
        <div>Child content</div>
      </SectionGroup>
    );
    const expandButton = screen.getByRole("button");
    expect(expandButton).toHaveAttribute("aria-label", "Expand section");
  });
});
