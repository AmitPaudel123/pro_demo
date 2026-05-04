import { LoginPage } from "../pages/login";
import { InventoryPage } from "../pages/inventory";
import { CheckoutPage } from "../pages/checkout";
import { test, expect } from "@playwright/test";
import { users } from "../utils/userDetails";

let loginPage: LoginPage;
let inventoryPage: InventoryPage;
let checkoutPage: CheckoutPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  inventoryPage = new InventoryPage(page);
  checkoutPage = new CheckoutPage(page);
  await loginPage.goto();
  await loginPage.login(
    users.standard_user.username,
    users.standard_user.password,
  );
  await inventoryPage.addToCart();
  await inventoryPage.shoppingCart.click();
});

test.describe("Checkout Process", () => {
  test("cart item verification", async ({ page }) => {
    await expect(page).toHaveURL(/.*cart/);
    await expect(page).toHaveTitle(/Swag Labs/);
    await expect(checkoutPage.cartItems).toHaveCount(2);
    await checkoutPage.cartItems
      .first()
      .getByRole("button", { name: "Remove" })
      .click();
    await expect(checkoutPage.cartItems).toHaveCount(1);
  });

  test("checkout information validation", async ({ page }) => {
    await checkoutPage.checkoutBtn.click();
    await expect(page).toHaveURL(/.*checkout-step-one/);

    // Attempt to continue without filling information and verify error handling
    await checkoutPage.clickContinue();
    await expect(page.getByText("Error: First Name is required")).toBeVisible();

    // Fill in only first name and attempt to continue
    await checkoutPage.firstNameInput.fill("John");
    await checkoutPage.clickContinue();
    await expect(page.getByText("Error: Last Name is required")).toBeVisible();

    //fill in random number in name field  and try to continue
    await checkoutPage.firstNameInput.fill("54544");
    await checkoutPage.lastNameInput.fill("123");
    await checkoutPage.postalCodeInput.fill("12345");
    await checkoutPage.clickContinue();
    await expect(page).toHaveURL(/.*checkout-step-two/);

    // Go back and clear fields to verify error handling again
    await page.goBack();
    await checkoutPage.firstNameInput.fill("");

    // Fill in valid information and continue
    await checkoutPage.fillCheckoutInformation("John", "Doe", "12345");
    await expect(page).toHaveURL(/.*checkout-step-two/);

    // Finish checkout
    await checkoutPage.finishButton.click();
    await expect(page).toHaveURL(/.*checkout-complete/);
  });
});
