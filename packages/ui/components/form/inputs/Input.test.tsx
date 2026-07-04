// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PasswordField } from "./Input";

describe("PasswordField visibility toggle", () => {
  it("starts with type=password", () => {
    render(<PasswordField label="Password" />);
    expect(screen.getByPlaceholderText("••••••••••••")).toHaveAttribute("type", "password");
  });

  it("changes to type=text when the toggle is clicked", async () => {
    render(<PasswordField label="Password" />);
    await userEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(screen.getByPlaceholderText("••••••••••••")).toHaveAttribute("type", "text");
  });

  it("returns to type=password when the toggle is clicked again", async () => {
    render(<PasswordField label="Password" />);
    await userEvent.click(screen.getByRole("button", { name: "Show password" }));
    await userEvent.click(screen.getByRole("button", { name: "Hide password" }));
    expect(screen.getByPlaceholderText("••••••••••••")).toHaveAttribute("type", "password");
  });

  it("updates the toggle label", async () => {
    render(<PasswordField label="Password" />);
    expect(screen.getByRole("button", { name: "Show password" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(screen.getByRole("button", { name: "Hide password" })).toBeInTheDocument();
  });
});
