import { test, expect } from "@playwright/test";

test("Uživatel dokončí objednávku s 2 položkami", async ({ page }) => {
  // test data
  const formData = {
    username: "standard_user",
    password: "secret_sauce",
    firstName: "Better",
    lastName: "Work",
    postalCode: "42069",
  };

  // navigace na stránku
  await page.goto("https://www.saucedemo.com/");

  // přihlášení
  await page.locator('[data-test="username"]').fill(formData.username);
  await page.locator('[data-test="password"]').fill(formData.password);
  await page.locator('[data-test="login-button"]').click();

  // ověření přesměrování na stránku s produkty
  await expect(page).toHaveURL(/inventory.html/);

  // přidání do košíku a dokončení objednávky
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

  // otevření košíku
  await page.locator('[data-test="shopping-cart-link"]').click();

  // ověření počtu položek v košíku
  await expect(page.locator(".cart_item")).toHaveCount(2);

  // pokračování k pokladně
  await page.locator('[data-test="checkout"]').click();
  await page.locator('[data-test="firstName"]').fill(formData.firstName);
  await page.locator('[data-test="lastName"]').fill(formData.lastName);
  await page.locator('[data-test="postalCode"]').fill(formData.postalCode);
  await page.locator('[data-test="continue"]').click();
  await page.locator('[data-test="finish"]').click();

  // ověření dokončení objednávky
  await expect(page.locator(".complete-header")).toHaveText(
    "Thank you for your order!",
  );

  // návrat na hlavní stránku
  await page.locator('[data-test="back-to-products"]').click();
  await expect(page).toHaveURL(/inventory.html/);
});
