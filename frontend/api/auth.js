// src/api/auth.js

export async function signUpUser({ name, email, password, confirmPassword }) {
  const response = await fetch("http://localhost:6543/api/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
      confirm_password: confirmPassword, // match backend key
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Signup failed.");
  }

  return data;
}
