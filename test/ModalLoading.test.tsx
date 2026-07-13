import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ModalLoading } from "../components/ui/ModalLoading";

describe("ModalLoading UI component tests", () => {
  it("should render default text correctly", () => {
    render(<ModalLoading />);
    expect(screen.getByText("Initializing")).toBeInTheDocument();
    expect(screen.getByText("Loading Module Resource")).toBeInTheDocument();
  });

  it("should render custom text correctly", () => {
    render(
      <ModalLoading 
        initializingText="Starting up" 
        loadingText="Please wait" 
      />
    );
    expect(screen.getByText("Starting up")).toBeInTheDocument();
    expect(screen.getByText("Please wait")).toBeInTheDocument();
  });
});
