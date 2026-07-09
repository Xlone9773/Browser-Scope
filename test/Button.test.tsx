import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../components/ui/Button";

describe("Button UI component tests", () => {
  it("should render children correctly", () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  it("should call onClick handler when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    
    fireEvent.click(screen.getByText("Click Me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should be disabled and not call onClick when disabled prop is true", () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled>
        Click Me
      </Button>
    );
    
    const buttonEl = screen.getByRole("button");
    expect(buttonEl).toBeDisabled();

    fireEvent.click(buttonEl);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("should show a loading spinner and disable the button when isLoading is true", () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} isLoading>
        Click Me
      </Button>
    );

    const buttonEl = screen.getByRole("button");
    expect(buttonEl).toBeDisabled();

    // Spinner should be visible (we look for a svg or element inside representing the spinner)
    const spinner = buttonEl.querySelector("svg");
    expect(spinner).toBeInTheDocument();

    fireEvent.click(buttonEl);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("should render left and right icons when provided", () => {
    const leftIcon = <span data-testid="left-icon">👈</span>;
    const rightIcon = <span data-testid="right-icon">👉</span>;

    render(
      <Button leftIcon={leftIcon} rightIcon={rightIcon}>
        My Button
      </Button>
    );

    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
  });
});
