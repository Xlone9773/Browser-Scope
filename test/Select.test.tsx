import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import { Select } from "../components/ui/Select";

describe("Select UI component tests", () => {
  const options = [
    { id: "opt1", label: "Option 1" },
    { id: "opt2", label: "Option 2" },
  ];

  it("should render the selected label", () => {
    render(<Select value="opt1" options={options} onChange={() => {}} />);
    expect(screen.getByText("Option 1")).toBeInTheDocument();
  });

  it("should open portal when clicked", async () => {
    render(<Select value="opt1" options={options} onChange={() => {}} />);
    const button = screen.getByRole("button");
    
    act(() => {
      fireEvent.click(button);
    });
    
    await waitFor(() => {
      expect(screen.getByText("Option 2")).toBeInTheDocument();
    });
  });

  it("should call onChange when an option is selected", async () => {
    const handleChange = vi.fn();
    render(<Select value="opt1" options={options} onChange={handleChange} />);
    const button = screen.getByRole("button");
    
    act(() => {
      fireEvent.click(button);
    });
    
    await waitFor(() => {
      expect(screen.getByText("Option 2")).toBeInTheDocument();
    });
    
    const opt2 = screen.getByText("Option 2");
    act(() => {
      fireEvent.click(opt2);
    });
    
    expect(handleChange).toHaveBeenCalledWith("opt2");
  });

  it("should not open if disabled", () => {
    render(<Select value="opt1" options={options} onChange={() => {}} disabled />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    
    act(() => {
      fireEvent.click(button);
    });
    
    expect(screen.queryByText("Option 2")).not.toBeInTheDocument();
  });
});
