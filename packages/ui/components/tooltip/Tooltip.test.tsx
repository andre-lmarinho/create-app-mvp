// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
  it("renders content when open is controlled", () => {
    render(
      <Tooltip content="Context help" open>
        <button type="button">Help</button>
      </Tooltip>
    );

    expect(screen.getByRole("button", { name: "Help" })).toBeInTheDocument();
    expect(screen.getByText("Context help")).toBeInTheDocument();
  });

  it("applies a custom class to the popup", () => {
    render(
      <Tooltip content="Context help" open className="custom-tooltip">
        <button type="button">Help</button>
      </Tooltip>
    );

    expect(screen.getByText("Context help")).toHaveClass("custom-tooltip");
  });
});
