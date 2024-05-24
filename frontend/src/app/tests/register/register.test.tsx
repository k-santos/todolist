import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import RegisterForm from "@/app/register/page";
import MockAdapter from "axios-mock-adapter";
import api from "@/app/api/api";

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    pushMock.mockClear();
  });

  it("should render the register form correctly", async () => {
    const { getByText, getByLabelText } = render(<RegisterForm />);
    expect(getByLabelText("Name")).toBeInTheDocument();
    expect(getByText("Register")).toBeInTheDocument();
    expect(getByLabelText("Username")).toBeInTheDocument();
    expect(getByLabelText("Confirm password")).toBeInTheDocument();
    expect(getByLabelText("Password")).toBeInTheDocument();
  });

  it("should display error message for empty fields", async () => {
    const { getByText } = render(<RegisterForm />);

    fireEvent.click(getByText("Register"));
    await waitFor(() => {
      expect(getByText("Name is required")).toBeInTheDocument();
      expect(getByText("Username is required")).toBeInTheDocument();
      expect(getByText("Password is required")).toBeInTheDocument();
      expect(getByText("Confirm password is required")).toBeInTheDocument();
    });
  });

  it('should display "User registered!" when user is created', async () => {
    const mock = new MockAdapter(api);
    mock.onPost("user/create/").reply(201, {});

    const { getByText, getByLabelText, queryByText } = render(<RegisterForm />);

    fireEvent.change(getByLabelText("Name"), { target: { value: "name" } });
    fireEvent.change(getByLabelText("Username"), {
      target: { value: "username" },
    });
    fireEvent.change(getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(getByLabelText("Confirm password"), {
      target: { value: "password123" },
    });

    fireEvent.click(getByText("Register"));

    await waitFor(() =>
      expect(queryByText("User registered!")).toBeInTheDocument()
    );
  });
});
