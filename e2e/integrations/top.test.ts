import { expect, test } from "../fixtures";
import { createUser } from "../helpers/createUser";
import { reset } from "../helpers/reset";
import { user1 } from "../mockedUsers";
import { TopPage } from "../models/TopPage";

test.beforeEach(async ({ browser, page }) => {
  await page.reload();
  await createUser(browser);

  const topPage = new TopPage(page);

  await topPage.init();
  await topPage.goTo();
});

test.afterEach(async ({ context }) => {
  await reset(context);
});

test("should create an item and then delete all items", async ({ page }) => {
  const topPage = new TopPage(page);

  await topPage.expectHeaderUI("signIn", user1);
  await topPage.expectUI("signIn");

  await topPage.addItem("hello!");

  expect(await topPage.getItems()).toMatchObject([
    {
      img: user1.image,
      title: "hello!",
    },
  ]);

  await topPage.deleteAllItems();

  expect(await topPage.getItems()).toMatchObject([]);
});

test("should hide all UI related to sign in", async ({ page, context }) => {
  await context.clearCookies();
  await page.reload();

  const topPage = new TopPage(page);

  await topPage.expectHeaderUI("signOut", user1);
  await topPage.expectUI("signOut");
});
