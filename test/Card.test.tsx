import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card } from "../components/ui/Card";

describe("Card UI component tests", () => {
  it("should render children correctly", () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText("Card Content")).toBeInTheDocument();
  });

  it("should apply padding by default", () => {
    const { container } = render(<Card>Content</Card>);
    const innerDiv = container.firstChild?.firstChild;
    expect(innerDiv).toHaveClass("p-6");
  });

  it("should not apply padding when noPadding is true", () => {
    const { container } = render(<Card noPadding>Content</Card>);
    const innerDiv = container.firstChild?.firstChild;
    expect(innerDiv).not.toHaveClass("p-6");
  });

  it("should append custom class names", () => {
    const { container } = render(<Card className="custom-card-class">Content</Card>);
    const outerDiv = container.firstChild;
    expect(outerDiv).toHaveClass("custom-card-class");
  });
});
