import { test, expect } from "@playwright/test";
import { InventoryPage } from "../pages/inventory";

test.describe("Inventory Page Tests", () => {
  let inventoryPage: InventoryPage;
  const zToAOption = "za";
  const lowToHighOption = "lohi";
  const highToLowOption = "hilo";

  test.beforeEach(async ({ page }) => {
    inventoryPage = new InventoryPage(page);
    await page.goto("https://www.saucedemo.com/inventory.html");
  });

  //test to verify that user succssfully logged in and inventory page is displayed
  test("should display inventory items after successful login", async () => {
    await expect(inventoryPage.page).toHaveURL(
      "https://www.saucedemo.com/inventory.html",
    );
    await expect(inventoryPage.firstItem).toContainText("Sauce Labs Backpack");
    await expect(inventoryPage.lastItem).toContainText(
      "Test.allTheThings() T-Shirt (Red)",
    );
  });

  //test to verify that user can add and remove items from the cart
  test("should add and remove items from the cart", async () => {
    //add to cart
    await inventoryPage.addToCart();
    await expect(inventoryPage.shoppingCart).toHaveText("2");

    //remove from cart
    await inventoryPage.removeFromCart();
    await expect(inventoryPage.shoppingCart).toHaveText("");
  });

  //test to verify that user can sort items by different options
  test("should sort items by different options", async () => {
    //sort Z to A
    await inventoryPage.sortItems(zToAOption);
    await expect(inventoryPage.firstItem).toContainText(
      "Test.allTheThings() T-Shirt (Red)",
    );
    await expect(inventoryPage.lastItem).toContainText("Sauce Labs Backpack");

    //sort low to high
    await inventoryPage.sortItems(lowToHighOption);
    await expect(inventoryPage.firstItem).toContainText("Sauce Labs Onesie");
    await expect(inventoryPage.lastItem).toContainText(
      "Sauce Labs Fleece Jacket",
    );
    await expect(inventoryPage.firstItem.locator(".pricebar")).toContainText(
      "$7.99",
    );
    await expect(inventoryPage.lastItem.locator(".pricebar")).toContainText(
      "$49.99",
    );

    //sort high to low
    await inventoryPage.sortItems(highToLowOption);
    await expect(inventoryPage.firstItem).toContainText(
      "Sauce Labs Fleece Jacket",
    );
    await expect(inventoryPage.lastItem).toContainText("Sauce Labs Onesie");
    await expect(inventoryPage.firstItem.locator(".pricebar")).toContainText(
      "$49.99",
    );
    await expect(inventoryPage.lastItem.locator(".pricebar")).toContainText(
      "$7.99",
    );
  });
});
