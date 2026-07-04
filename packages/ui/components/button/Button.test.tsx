// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./Button";

describe("Button default variant", () => {
  it("renders a button by default", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("uses type=button by default", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("accepts explicit type=submit", () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("passes disabled to the native element", () => {
    render(<Button disabled>Save</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});

describe("Button link variant", () => {
  it("renders an anchor when href is provided", () => {
    render(<Button href="/dashboard">Open dashboard</Button>);
    const link = screen.getByRole("link", { name: "Open dashboard" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/dashboard");
  });

  it("does not render a button when href is provided", () => {
    render(<Button href="/dashboard">Open dashboard</Button>);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});

describe("Button icon variant", () => {
  it("renders a button with aria-label", () => {
    render(<Button variant="icon" icon="x" label="Close" />);
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("uses type=button by default for icon buttons", () => {
    render(<Button variant="icon" icon="x" label="Close" />);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("passes disabled to the icon button", () => {
    render(<Button variant="icon" icon="x" label="Close" disabled />);
    expect(screen.getByRole("button", { name: "Close" })).toBeDisabled();
  });
});

describe("Button color resolution", () => {
  it("applies primary color to default buttons", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-primary-main");
  });

  it("applies minimal color to icon buttons", () => {
    render(<Button variant="icon" icon="x" label="Close" />);
    expect(screen.getByRole("button", { name: "Close" })).toHaveClass("bg-transparent");
  });

  it("respects explicit icon button color", () => {
    render(<Button variant="icon" icon="x" label="Close" color="danger" />);
    expect(screen.getByRole("button", { name: "Close" })).toHaveClass("bg-error-strong");
  });
});
