import React from "react";
import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { FloatingWindow } from "../components/ui/FloatingWindow";

// jsdom has no pointer capture; FloatingWindow relies on it for dragging.
beforeAll(() => {
  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.releasePointerCapture = vi.fn();
});

// jsdom always reports an empty rect; give the window a known geometry so
// drag/resize math is deterministic.
const RECT = {
  left: 100, top: 100, width: 600, height: 400,
  right: 700, bottom: 500, x: 100, y: 100,
} as DOMRect;

beforeEach(() => {
  vi.stubGlobal("innerWidth", 1200);
  vi.stubGlobal("innerHeight", 800);
});

const style = () => {
  const el = document.querySelector<HTMLElement>('[class*="bg-slate-900/95"]');
  expect(el).not.toBeNull();
  return el!.style;
};

const header = () => document.querySelector<HTMLElement>(".cursor-move")!;

const resizeHandle = (corner: "nw" | "se") => {
  const all = document.querySelectorAll<HTMLElement>('[class*="cursor-nwse-resize"]');
  // nw is first (w-4 h-4), se is last (contains the grip svg)
  return corner === "nw" ? all[0] : all[all.length - 1];
};

const startDrag = (target: Element, clientX: number, clientY: number) => {
  // The component reads the RECT from the root window element (windowRef),
  // not from the pointer-down target — mock the root.
  const root = document.querySelector<HTMLElement>('[class*="bg-slate-900/95"]')!;
  vi.spyOn(root, "getBoundingClientRect").mockReturnValue(RECT);
  act(() => {
    fireEvent.pointerDown(target, { pointerId: 1, clientX, clientY });
  });
};

const move = (clientX: number, clientY: number) => {
  act(() => {
    fireEvent.pointerMove(window, { pointerId: 1, clientX, clientY });
  });
};

const end = () => {
  act(() => {
    fireEvent.pointerUp(window, { pointerId: 1 });
  });
};

describe("FloatingWindow UI component tests", () => {
  beforeEach(() => {
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
  });

  it("should render title and content", () => {
    render(<FloatingWindow title="Debug" onClose={() => {}}>content-here</FloatingWindow>);
    expect(screen.getByText("Debug")).toBeInTheDocument();
    expect(screen.getByText("content-here")).toBeInTheDocument();
  });

  it("should start centered on the viewport", () => {
    render(<FloatingWindow title="T" onClose={() => {}}>body</FloatingWindow>);
    // 1200/2 - 600/2 = 300, 800/2 - 400/2 = 200
    expect(style().left).toBe("300px");
    expect(style().top).toBe("200px");
    expect(style().width).toBe("600px");
    expect(style().height).toBe("400px");
  });

  it("should call onClose when the dock button is clicked", () => {
    const onClose = vi.fn();
    render(<FloatingWindow title="T" onClose={onClose}>body</FloatingWindow>);
    fireEvent.click(screen.getByTitle("Dock back to settings"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should drag by pointermove delta", () => {
    render(<FloatingWindow title="T" onClose={() => {}}>body</FloatingWindow>);
    startDrag(header(), 100, 100);
    expect(document.body.style.userSelect).toBe("none");

    move(150, 130);
    expect(style().left).toBe("150px");
    expect(style().top).toBe("130px");

    end();
    expect(document.body.style.userSelect).toBe("");
    // pointerup commits the DOM style back into state (same values persist)
    expect(style().left).toBe("150px");
    expect(style().top).toBe("130px");
  });

  it("should grow from the south-east corner", () => {
    render(<FloatingWindow title="T" onClose={() => {}}>body</FloatingWindow>);
    startDrag(resizeHandle("se"), 700, 500);
    move(740, 520);
    expect(style().width).toBe("640px");
    expect(style().height).toBe("420px");
    // position untouched by se resize
    expect(style().left).toBe("100px");
    end();
  });

  it("should clamp resize to the 300px minimum", () => {
    render(<FloatingWindow title="T" onClose={() => {}}>body</FloatingWindow>);
    startDrag(resizeHandle("se"), 700, 500);
    move(700 - 1000, 500 - 1000);
    expect(style().width).toBe("300px");
    expect(style().height).toBe("300px");
    end();
  });

  it("should shrink from the north-west corner keeping the opposite edge anchored", () => {
    render(<FloatingWindow title="T" onClose={() => {}}>body</FloatingWindow>);
    startDrag(resizeHandle("nw"), 100, 100);
    move(200, 200); // drag in by 100/100
    expect(style().width).toBe("500px"); // 600 - 100
    expect(style().height).toBe("300px"); // 400 - 100
    expect(style().left).toBe("200px"); // 100 + 100 (edge follows)
    expect(style().top).toBe("200px");
    end();
  });

  it("should ignore pointermove without an active drag", () => {
    render(<FloatingWindow title="T" onClose={() => {}}>body</FloatingWindow>);
    const before = style().left;
    move(999, 999);
    expect(style().left).toBe(before);
  });
});
