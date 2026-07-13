import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FloatingWindow } from "../components/ui/FloatingWindow";

describe("FloatingWindow UI component tests", () => {
  it("should render correctly in portal", () => {
    render(
      <FloatingWindow title="Draggable Window" onClose={() => {}}>
        <div>Window Content</div>
      </FloatingWindow>
    );
    expect(screen.getByText(/Draggable Window/i)).toBeInTheDocument();
    expect(screen.getByText("Window Content")).toBeInTheDocument();
  });

  it("should call onClose when close button is clicked", () => {
    const handleClose = vi.fn();
    render(
      <FloatingWindow title="Window" onClose={handleClose}>
        <div>Content</div>
      </FloatingWindow>
    );
    
    const closeBtn = screen.getByTitle("Dock back to settings");
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
