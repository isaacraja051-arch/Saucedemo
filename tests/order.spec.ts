import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test('order one product', async ({ page }) => {
  const login = new LoginPage(page);
  const products = new ProductsPage(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);

  await login.goto();
  await login.login('standard_user', 'secret_sauce');

  await products.addFirstProductToCart();
  await cart.checkout();

  await checkout.fillDetails('John', 'Doe', '12345');
  await checkout.finishOrder();

  const confirmationText = await checkout.confirmation.textContent();
await expect(checkout.confirmation).toContainText('Thank you for your order');

});
