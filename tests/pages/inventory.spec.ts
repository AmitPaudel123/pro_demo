import { Locator, Page } from "@playwright/test";
export class InventoryPage {
  readonly page: Page;
  readonly firstItem: Locator;
  readonly lastItem: Locator;
  readonly shoppingCart: Locator;
  readonly addToCartButton: Locator;
  readonly removeButton: Locator;
  readonly inventoryItems: Locator;
  readonly sortingDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryItems = page.locator(
      "#inventory_container .inventory_list .inventory_item",
    );
    this.firstItem = this.inventoryItems.first();
    this.lastItem = this.inventoryItems.last();
    this.shoppingCart = page.locator("#shopping_cart_container");
    this.addToCartButton = page.getByRole("button", { name: "Add to cart" });
    this.removeButton = page.getByRole("button", { name: "Remove" });
    this.sortingDropdown = page.locator(".product_sort_container");
  }

  async addToCart() {
    await this.firstItem.getByRole("button", { name: "Add to cart" }).click();
    await this.lastItem.getByRole("button", { name: "Add to cart" }).click();
  }

  async removeFromCart() {
    await this.firstItem.getByRole("button", { name: "Remove" }).click();
    await this.lastItem.getByRole("button", { name: "Remove" }).click();
  }

  async sortItems(option: string) {
    await this.sortingDropdown.selectOption(option);
  }
}
