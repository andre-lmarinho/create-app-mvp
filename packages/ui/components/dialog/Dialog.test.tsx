// @vitest-environment jsdom
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Dialog } from "./Dialog";

describe("Dialog", () => {
  it("renders title and content when open", () => {
    render(
      <Dialog title="New customer" open>
        <p>Modal content</p>
      </Dialog>
    );

    expect(screen.getByRole("dialog", { name: "New customer" })).toBeInTheDocument();
    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("exposes the marker used by selects inside dialogs", () => {
    render(
      <Dialog title="New customer" open>
        <p>Modal content</p>
      </Dialog>
    );

    expect(screen.getByRole("dialog", { name: "New customer" })).toHaveAttribute("data-repo-dialog-popup");
  });

  it("opens from the trigger and closes from the close button", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Dialog
        title="New customer"
        onOpenChange={onOpenChange}
        trigger={<button type="button">Open modal</button>}>
        <p>Modal content</p>
      </Dialog>
    );

    await user.click(screen.getByRole("button", { name: "Open modal" }));
    expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything());

    await user.click(within(screen.getByRole("dialog", { name: "New customer" })).getByRole("button"));
    expect(onOpenChange).toHaveBeenLastCalledWith(false, expect.anything());
  });

  it("applies the full size variant to the popup", () => {
    render(
      <Dialog title="Proposal" open size="full">
        <p>Content</p>
      </Dialog>
    );

    expect(screen.getByRole("dialog", { name: "Proposal" })).toHaveClass("lg:max-w-[80vw]");
  });
});
