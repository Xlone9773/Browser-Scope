import React, { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Switch } from "../components/ui/Switch";

describe("Switch UI component tests", () => {
  it("should render switch correctly", () => {
    render(<Switch checked={false} onChange={() => {}} label="Test Switch" />);
    const switchEl = screen.getByRole("switch");
    expect(switchEl).toBeInTheDocument();
    expect(switchEl).toHaveAttribute("aria-checked", "false");
  });

  it("should display checked state correctly", () => {
    render(<Switch checked={true} onChange={() => {}} label="Test Switch" />);
    const switchEl = screen.getByRole("switch");
    expect(switchEl).toHaveAttribute("aria-checked", "true");
  });

  it("should toggle state on click", () => {
    const handleChange = vi.fn();
    render(<Switch checked={false} onChange={handleChange} label="Test Switch" />);
    const switchEl = screen.getByRole("switch");
    
    fireEvent.click(switchEl);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it("should not toggle when disabled", () => {
    const handleChange = vi.fn();
    render(<Switch checked={false} onChange={handleChange} disabled label="Test Switch" />);
    const switchEl = screen.getByRole("switch");
    
    expect(switchEl).toBeDisabled();
    fireEvent.click(switchEl);
    expect(handleChange).not.toHaveBeenCalled();
  });
});
