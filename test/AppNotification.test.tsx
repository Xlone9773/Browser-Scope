import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AppNotification } from "../components/ui/AppNotification";

describe("AppNotification UI component tests", () => {
  it("should render title and message correctly", () => {
    render(<AppNotification type="info" title="Test Title" message="Test message" />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test message")).toBeInTheDocument();
  });

  it("should apply different styles for different types", () => {
    const { container: warningContainer } = render(
      <AppNotification type="warning" message="Warning msg" />
    );
    expect(warningContainer.firstChild).toHaveClass("bg-amber-50");

    const { container: errorContainer } = render(
      <AppNotification type="error" message="Error msg" />
    );
    expect(errorContainer.firstChild).toHaveClass("bg-rose-50");
  });

  it("should display action button if action prop is provided and trigger callback", () => {
    const handleAction = vi.fn();
    render(
      <AppNotification 
        type="info" 
        message="Msg" 
        action={{ label: "Do Something", onClick: handleAction }} 
      />
    );
    
    const actionBtn = screen.getByText("Do Something");
    expect(actionBtn).toBeInTheDocument();
    
    fireEvent.click(actionBtn);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it("should display close button if onClose prop is provided and trigger callback", () => {
    const handleClose = vi.fn();
    // Use container query to find close button inside notification
    const { container } = render(
      <AppNotification type="info" message="Msg" onClose={handleClose} />
    );
    
    // Find button containing an svg element (the lucide icon) with no text
    const buttons = container.querySelectorAll("button");
    const closeBtn = Array.from(buttons).find(btn => btn.innerHTML.includes("<svg"));
    expect(closeBtn).toBeInTheDocument();
    
    if (closeBtn) {
      fireEvent.click(closeBtn);
    }
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
