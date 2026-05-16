import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';

test('valid login', async ({ page }) => {
  const login = new LoginPage(page);
  const products = new ProductsPage(page);

  await login.goto();
  await login.login('standard_user', 'secret_sauce');
  await expect(products.title).toHaveText('Products');
});

test('invalid login', async ({ page }) => {
  const login = new LoginPage(page);

  await login.goto();
  await login.login('wrong_user', 'wrong_pass');
  await expect(login.errorMessage).toContainText('Username and password do not match');
});

test('locked out user', async ({ page }) => {
  const login = new LoginPage(page);

  await login.goto();
  await login.login('locked_out_user', 'secret_sauce');
  await expect(login.errorMessage).toContainText('Sorry, this user has been locked out.');
});
