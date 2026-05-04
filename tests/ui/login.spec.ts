import { expect, test } from "@playwright/test";
import { LoginPage } from "../pages/login";
import { users } from "../utils/userDetails.ts";

test.describe("Login Tests", () => {
  let loginPage: LoginPage;
  const username = users.standard_user.username;
  const password = users.standard_user.password;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test("should not login with empty username and password", async () => {
    await loginPage.login("", "");
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(/Username is required/i);
  });

  test("should not login without username", async () => {
    await loginPage.login("", password);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(/Username is required/i);
  });

  test("should not login without password", async () => {
    await loginPage.login(username, "");
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(/Password is required/i);
  });

  test("should not login with wrong credentials", async () => {
    await loginPage.login(username, "wrongpassword");
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(
      /Username and password do not match any user in this service/i,
    );
  });

  test("should login successfully with valid credentials", async () => {
    await loginPage.login(username, password);
    await expect(loginPage.page).toHaveURL(/inventory/i);
  });
});
