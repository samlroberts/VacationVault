import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VacationTracker from "~/app/vacations/new/page";
import { api } from "~/trpc/react";

// Mock the tRPC hooks
jest.mock("~/trpc/react", () => ({
  api: {
    vacation: {
      create: {
        useMutation: jest.fn(() => ({
          mutate: jest.fn(),
          isLoading: false,
        })),
      },
    },
  },
}));

// Mock the router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

describe("VacationTracker", () => {
  it("renders the vacation form", () => {
    render(<VacationTracker />);

    expect(screen.getByText("Vacation Tracker")).toBeInTheDocument();
    expect(screen.getByLabelText("Trip Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Destination")).toBeInTheDocument();
    expect(screen.getByLabelText("Date Range")).toBeInTheDocument();
    expect(screen.getByLabelText("Trip Description")).toBeInTheDocument();
  });

  it("handles form submission", async () => {
    const user = userEvent.setup();
    render(<VacationTracker />);

    // Fill out the form
    await user.type(screen.getByLabelText("Trip Name"), "Summer Vacation");
    await user.type(screen.getByLabelText("Destination"), "Hawaii");
    await user.type(
      screen.getByLabelText("Trip Description"),
      "Beach vacation",
    );

    // Submit the form
    await user.click(screen.getByText("Add Vacation"));

    // Verify that the mutation was called
    expect(api.vacation.create.useMutation).toHaveBeenCalled();
  });
});
