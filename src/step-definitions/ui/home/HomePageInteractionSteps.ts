import { expect, Page } from "@playwright/test";
import { When, Then, Fixture } from "playwright-bdd/decorators";
import { HomePage } from "../../../pages/ui/HomePage";
import { AssertionHelper } from "../../../utils/AssertionHelper";

@Fixture("homePageInteractionSteps")
export class HomePageInteractionSteps {
  constructor(
    private page: Page,
    private homePage: HomePage,
    private assertionHelper: AssertionHelper
  ) {}

  @When("I interact with the {string} button")
  async interactWithCtaButton(buttonText: string): Promise<void> {
    await this.homePage.interactWithButton(buttonText);
  }

  @Then("the result should match {string}")
  async checkCtaInteractionResult(expectedOutcome: string): Promise<void> {
    if (expectedOutcome.startsWith("URL contains")) {
      await this.validateUrlContainsResult(expectedOutcome);
    } else if (expectedOutcome.startsWith("Modal is visible")) {
      await this.validateModalVisibility();
    } else {
      await this.validateTextVisibility(expectedOutcome);
    }
  }

  private async validateUrlContainsResult(
    expectedOutcome: string
  ): Promise<void> {
    const expectedPath = expectedOutcome.split("URL contains ")[1].trim();
    await expect(this.page).toHaveURL(new RegExp(expectedPath));
  }

  private async validateModalVisibility(): Promise<void> {
    const modalLocator = this.page
      .locator('[role="dialog"], .modal-overlay')
      .first();
    await expect(modalLocator).toBeVisible();
  }

  private async validateTextVisibility(expectedOutcome: string): Promise<void> {
    await this.assertionHelper.validateBooleanCheck(
      () => this.page.locator(`text=/${expectedOutcome}/i`).isVisible(),
      `Expected result '${expectedOutcome}' is not visible on the page.`
    );
  }
}
