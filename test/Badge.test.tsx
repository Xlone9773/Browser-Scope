import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "../components/ui/Badge";

describe("Badge UI component tests", () => {
  it("should render children correctly", () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText("Test Badge")).toBeInTheDocument();
  });

  it("should apply default neutral variant styles", () => {
    render(<Badge>Default Badge</Badge>);
    const badgeEl = screen.getByText("Default Badge");
    expect(badgeEl).toHaveClass("bg-slate-100");
  });

  it("should apply custom variant styles", () => {
    render(<Badge variant="success">Success Badge</Badge>);
    const badgeEl = screen.getByText("Success Badge");
    expect(badgeEl).toHaveClass("bg-emerald-50");
  });

  it("should append custom class names", () => {
    render(<Badge className="custom-class">Custom Class</Badge>);
    const badgeEl = screen.getByText("Custom Class");
    expect(badgeEl).toHaveClass("custom-class");
  });

  it("should render icon if provided", () => {
    const TestIcon = <svg data-testid="test-icon" />;
    render(<Badge icon={TestIcon}>With Icon</Badge>);
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });
});
