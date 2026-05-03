import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.spec";
import { InventoryPage } from "../pages/inventory.spec";
import { CheckoutPage } from "../pages/checkout.spec";
import { users } from "../utils/userDetails";

test.describe("Checkout Flow", async () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let checkoutPage: CheckoutPage;

  const username = users.standard_user.username;
  const password = users.standard_user.password;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.login(username, password);
    await inventoryPage.addToCart();
    await inventoryPage.shoppingCart.click();
  });

  test("cart and checkout flow", async ({ page }) => {
    await expect(page).toHaveURL(/.*cart/);
    await checkoutPage.cartItems
      .first()
      .getByRole("button", { name: "Remove" })
      .click();
    await expect(checkoutPage.cartItems).toHaveCount(1);

    //checkout page
    await checkoutPage.checkoutBtn.click();
    await expect(page).toHaveURL(/.*checkout-step-one/);
    // try to continue without filling the form and verify error message
    await checkoutPage.fillCheckoutInformation("", "", "");
    await expect(page.getByTestId("error-first-name")).toHaveText(
      "Error: First Name is required",
    );

    //enter random number in first name field and verify error message
    await checkoutPage.fillCheckoutInformation("23456", "Paudel", "194684");
    await expect(page.getByTestId("error-first-name")).toHaveText(
      "Error: First Name is not valid",
    );
    await expect(page.getByTestId("error-first-name")).toBeVisible();

    //enter valid first name and verify error message for last name
    await checkoutPage.fillCheckoutInformation("Amit", "23456", "194684");
    await expect(page.getByTestId("error-last-name")).toHaveText(
      "Error: Last Name is not valid",
    );
    await expect(page.getByTestId("error-last-name")).toBeVisible();

    //enter valid last name and verify error message for postal code
    await checkoutPage.fillCheckoutInformation("Amit", "Paudel", "abcde");
    await expect(page.getByTestId("error-postal-code")).toBeVisible();

    //enter valid postal code and continue to next step
    await checkoutPage.fillCheckoutInformation("Amit", "Paudel", "194684");
    await checkoutPage.clickContinue();
    await expect(page).toHaveURL(/.*checkout-step-two/);
  });
});
8;
