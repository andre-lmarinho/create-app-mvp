// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Input, InputField } from "./TextField";

describe("Input", () => {
  it("passes native props and refs through to the input", () => {
    const ref = createRef<HTMLInputElement>();

    render(<Input ref={ref} aria-label="Name" defaultValue="Ana" name="name" />);

    expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue("Ana");
    expect(screen.getByRole("textbox", { name: "Name" })).toHaveAttribute("name", "name");
    expect(ref.current).toBe(screen.getByRole("textbox", { name: "Name" }));
  });

  it("can render without full width", () => {
    render(<Input aria-label="Name" isFullWidth={false} />);

    expect(screen.getByRole("textbox", { name: "Name" })).not.toHaveClass("w-full");
  });
});

describe("InputField", () => {
  it("links the label and input by id", () => {
    render(<InputField id="email" label="Email" />);

    expect(screen.getByLabelText("Email")).toHaveAttribute("id", "email");
  });

  it("passes name, required, and dataTestid through", () => {
    render(<InputField label="Name" name="full_name" required dataTestid="name" />);

    const input = screen.getByTestId("name-input");
    expect(input).toHaveAttribute("name", "full_name");
    expect(input).toBeRequired();
  });

  it("shows the required marker only when requested", () => {
    const { rerender } = render(<InputField label="Name" required />);

    expect(screen.getByText("Name")).not.toHaveTextContent("*");

    rerender(<InputField label="Name" required showAsteriskIndicator />);
    expect(screen.getByText("Name")).toHaveTextContent("*");
  });

  it("visually hides the label with labelSrOnly", () => {
    render(<InputField label="Search" labelSrOnly />);

    expect(screen.getByText("Search")).toHaveClass("sr-only");
    expect(screen.getByLabelText("Search")).toBeInTheDocument();
  });

  it("does not render the label when noLabel is enabled", () => {
    render(<InputField label="Search" noLabel aria-label="Direct search" />);

    expect(screen.queryByText("Search")).not.toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Direct search" })).toBeInTheDocument();
  });

  it("prefers the error over the hint", () => {
    render(<InputField label="Name" error="Required field" hint="Helpful hint" />);

    expect(screen.getByTestId("field-error")).toHaveTextContent("Required field");
    expect(screen.queryByText("Helpful hint")).not.toBeInTheDocument();
  });

  it("renders addons while keeping the input accessible", () => {
    render(
      <InputField
        label="Search"
        addOnLeading={<span data-testid="leading">R$</span>}
        addOnSuffix={<span data-testid="suffix">USD</span>}
      />
    );

    expect(screen.getByLabelText("Search")).toBeInTheDocument();
    expect(screen.getByTestId("leading")).toBeInTheDocument();
    expect(screen.getByTestId("suffix")).toBeInTheDocument();
  });
});
