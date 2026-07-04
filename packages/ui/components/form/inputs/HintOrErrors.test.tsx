// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HintsOrErrors } from "./HintOrErrors";

describe("HintsOrErrors priority: error > hintErrors > hint", () => {
  it("renders error when every field is present", () => {
    render(
      <HintsOrErrors
        error="Required field"
        hint="Helper text"
        hintErrors={[{ label: "minimum 8 chars", valid: false }]}
      />
    );
    expect(screen.getByTestId("field-error")).toBeInTheDocument();
    expect(screen.getByText("Required field")).toBeInTheDocument();
    expect(screen.queryByText("Helper text")).not.toBeInTheDocument();
    expect(screen.queryByText("minimum 8 chars")).not.toBeInTheDocument();
  });

  it("renders hintErrors when there is no error", () => {
    render(
      <HintsOrErrors
        hint="Helper text"
        hintErrors={[
          { label: "minimum 8 chars", valid: false },
          { label: "has uppercase", valid: true },
        ]}
      />
    );
    expect(screen.queryByTestId("field-error")).not.toBeInTheDocument();
    expect(screen.getByText("minimum 8 chars")).toBeInTheDocument();
    expect(screen.getByText("has uppercase")).toBeInTheDocument();
    expect(screen.queryByText("Helper text")).not.toBeInTheDocument();
  });

  it("renders hint when there is no error or hintErrors", () => {
    render(<HintsOrErrors hint="Use letters and numbers" />);
    expect(screen.getByText("Use letters and numbers")).toBeInTheDocument();
    expect(screen.queryByTestId("field-error")).not.toBeInTheDocument();
  });

  it("renders nothing when no props are provided", () => {
    const { container } = render(<HintsOrErrors />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when hintErrors is empty", () => {
    const { container } = render(<HintsOrErrors hintErrors={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("uses hint when hintErrors is empty", () => {
    render(<HintsOrErrors hint="Helper text" hintErrors={[]} />);
    expect(screen.getByText("Helper text")).toBeInTheDocument();
  });
});

describe("HintsOrErrors validity states", () => {
  it("applies the success class to valid items", () => {
    render(<HintsOrErrors hintErrors={[{ label: "ok", valid: true }]} />);
    const item = screen.getByText("ok").closest("li");
    expect(item).toHaveClass("text-green-700");
  });

  it("does not apply the success class to invalid items", () => {
    render(<HintsOrErrors hintErrors={[{ label: "failed", valid: false }]} />);
    const item = screen.getByText("failed").closest("li");
    expect(item).not.toHaveClass("text-green-700");
  });

  it("does not apply the success class to items without state", () => {
    render(<HintsOrErrors hintErrors={[{ label: "neutral" }]} />);
    const item = screen.getByText("neutral").closest("li");
    expect(item).not.toHaveClass("text-green-700");
  });

  it("renders mixed validity states", () => {
    render(
      <HintsOrErrors
        hintErrors={[
          { id: "a", label: "valid", valid: true },
          { id: "b", label: "invalid", valid: false },
        ]}
      />
    );
    expect(screen.getByText("valid").closest("li")).toHaveClass("text-green-700");
    expect(screen.getByText("invalid").closest("li")).not.toHaveClass("text-green-700");
  });
});
