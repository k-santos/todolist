import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "@/app/components/login";
import { AuthContext } from "@/app/context/authContext";

const pushMock = jest.fn();
const signInMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

const authMock = { signIn: signInMock, isAuthenticated: true, user: null };

describe("LoginForm", () => {
  beforeEach(() => {
    pushMock.mockClear();
    signInMock.mockClear();
  });

  it("should render the login form correctly", () => {
    const { getByLabelText, getByText } = render(
      <AuthContext.Provider value={authMock}>
        <LoginForm />
      </AuthContext.Provider>
    );

    expect(getByLabelText("Username")).toBeInTheDocument();
    expect(getByLabelText("Password")).toBeInTheDocument();
    expect(getByText("Login")).toBeInTheDocument();
    expect(getByText("Not registered yet?")).toBeInTheDocument();
    expect(getByText("Register")).toBeInTheDocument();
  });

  it("should display error message for empty fields", async () => {
    const { getByText } = render(
      <AuthContext.Provider value={authMock}>
        <LoginForm />
      </AuthContext.Provider>
    );

    fireEvent.click(getByText("Login"));

    await waitFor(() => {
      expect(getByText("Username is required")).toBeInTheDocument();
      expect(getByText("Password is required")).toBeInTheDocument();
    });
  });

  it("should call router push on successful login", async () => {
    const { getByLabelText, getByText } = render(
      <AuthContext.Provider value={authMock}>
        <LoginForm />
      </AuthContext.Provider>
    );

    const usernameInput = getByLabelText("Username");
    const passwordInput = getByLabelText("Password");
    const loginButton = getByText("Login");

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(signInMock).toHaveBeenCalledWith({
        username: "testuser",
        password: "password123",
      });
    });

    expect(pushMock).toHaveBeenCalledWith("dashboard");
  });

  it("should go to the register page", async () => {
    const { getByLabelText, getByText } = render(
      <AuthContext.Provider value={authMock}>
        <LoginForm />
      </AuthContext.Provider>
    );

    const usernameInput = getByLabelText("Username");
    const passwordInput = getByLabelText("Password");
    const loginButton = getByText("Login");

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(signInMock).toHaveBeenCalledWith({
        username: "testuser",
        password: "password123",
      });
    });

    expect(pushMock).toHaveBeenCalledWith("dashboard");
  });
});
