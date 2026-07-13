import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Spinner } from "../components/ui/Spinner";

describe("Spinner UI component tests", () => {
  it("should render spinner correctly", () => {
    const { container } = render(<Spinner />);
    const svgEl = container.querySelector("svg");
    expect(svgEl).toBeInTheDocument();
    expect(svgEl).toHaveClass("animate-spin");
  });

  it("should apply custom size and class", () => {
    const { container } = render(<Spinner size={32} className="custom-spin-class" />);
    const svgEl = container.querySelector("svg");
    expect(svgEl).toHaveClass("custom-spin-class");
    expect(svgEl).toHaveAttribute("width", "32");
    expect(svgEl).toHaveAttribute("height", "32");
  });
});
