import { LoginPage } from "../pages/login";
import { test as setup, expect } from "@playwright/test";
import { users } from "../utils/userDetails";

setup("Authenticate login setup", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(
    users.standard_user.username,
    users.standard_user.password,
  );
  await expect(page).toHaveURL(/inventory/);
  await page.context().storageState({ path: "playwright/.auth/user.json" });
});
