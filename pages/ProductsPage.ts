import { Page, Locator } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly title: Locator;
  readonly addToCartButton: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('.title');
    this.addToCartButton = page.locator('text=Add to cart').first();
    this.cartLink = page.locator('.shopping_cart_link');
  }

  async addFirstProductToCart() {
    await this.addToCartButton.click();
    await this.cartLink.click();
  }
}
