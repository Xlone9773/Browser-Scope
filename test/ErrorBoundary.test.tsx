import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorBoundary } from "../components/ui/ErrorBoundary";

const Bomb = ({ shouldThrow }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error("Test Error");
  }
  return <div>Safe Content</div>;
};

describe("ErrorBoundary UI component tests", () => {
  let consoleErrorSpy: any;

  beforeEach(() => {
    // Suppress console.error in tests to avoid messy output from the intentional error
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should render children if no error", () => {
    render(
      <ErrorBoundary name="Test">
        <Bomb />
      </ErrorBoundary>
    );
    expect(screen.getByText("Safe Content")).toBeInTheDocument();
  });

  it("should render fallback UI when an error occurs", () => {
    render(
      <ErrorBoundary name="Test">
        <Bomb shouldThrow />
      </ErrorBoundary>
    );
    
    // The fallback UI should be visible
    expect(screen.getByText("Test Error")).toBeInTheDocument();
    expect(screen.queryByText("Safe Content")).not.toBeInTheDocument();
  });
});
