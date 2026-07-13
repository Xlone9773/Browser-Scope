import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Slider } from "../components/ui/Slider";

describe("Slider UI component tests", () => {
  it("should render slider with label and correct value", () => {
    render(<Slider value={50} onChange={() => {}} label="Volume" min={0} max={100} />);
    expect(screen.getByText("Volume")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
  });

  it("should display formatted value if formatValue is provided", () => {
    render(
      <Slider 
        value={50} 
        onChange={() => {}} 
        formatValue={(val) => `${val}%`} 
      />
    );
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("should call onChange when input value changes", () => {
    const handleChange = vi.fn();
    render(<Slider value={50} onChange={handleChange} min={0} max={100} />);
    const inputEl = screen.getByRole("slider");
    
    fireEvent.change(inputEl, { target: { value: "75" } });
    expect(handleChange).toHaveBeenCalledWith(75);
  });

  it("should render subLabel if provided", () => {
    render(<Slider value={50} onChange={() => {}} subLabel="Audio level" />);
    expect(screen.getByText("Audio level")).toBeInTheDocument();
  });

  it("should disable input when disabled prop is true", () => {
    render(<Slider value={50} onChange={() => {}} disabled />);
    const inputEl = screen.getByRole("slider");
    expect(inputEl).toBeDisabled();
  });
});
