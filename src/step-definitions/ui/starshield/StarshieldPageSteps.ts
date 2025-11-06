import { expect, Page } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { StarshieldPage } from "../../../services/ui/StarshieldPage";
import { SharedPageSteps } from "../SharedPageSteps";
import { SharedContext } from "../../../utils/types/Types";
import { AssertionHelper } from "../../../utils/AssertionHelper";

@Fixture("starshieldPageSteps")
export class StarshieldPageSteps {
  constructor(
    private page: Page,
    private starshieldPage: StarshieldPage,
    private sharedContext: SharedContext,
    private sharedPageSteps: SharedPageSteps,
    private assertionHelper: AssertionHelper
  ) {}

  @Given("the page contains call-to-action buttons or links")
  async pageContainsCTAs() {
    await this.assertionHelper.validateBooleanCheck(
      () => this.starshieldPage.checkInteractiveElements(),
      "Page must contain interactive CTA elements."
    );
  }

  @When("the user hovers over or focuses on CTAs")
  async userHoversOrFocusesOnCTAs() {
    await this.starshieldPage.allCTAs.first().hover();
  }

  @Then("the CTA purpose should be clear from the text")
  async ctaPurposeShouldBeClear() {
    const ctaText = await this.starshieldPage.allCTAs.first().textContent();
    expect(ctaText).toMatch(/contact|learn more|inquire|explore/i);
  }

  @Then("clicking should lead to the expected destination or action")
  async clickingShouldLeadToExpectedDestination() {
    const href = await this.starshieldPage.allCTAs.first().getAttribute("href");
    this.assertionHelper.assertValuePresent(
      href,
      "CTA link must have an 'href' attribute (destination)."
    );
  }

  @Given("the page contains interactive elements")
  async pageContainsInteractiveElements() {
    await expect(this.starshieldPage.allCTAs.first()).toBeVisible();
  }

  @When("the user hovers over an interactive element")
  async userHoversOverAnInteractiveElement() {
    this.sharedContext.initialCursor = await this.starshieldPage.page.evaluate(
      () => document.body.style.cursor
    );
    await this.starshieldPage.allCTAs.first().hover();
  }

  @Then("the cursor should change to a pointer")
  async cursorShouldChangeToAPointer() {
    const cursorStyle = await this.starshieldPage.allCTAs
      .first()
      .evaluate((el) => window.getComputedStyle(el).cursor);
    expect(cursorStyle).toBe("pointer");
  }

  @Then("a visual feedback (e.g., color change) should be provided")
  async visualFeedbackShouldBeProvided() {
    const cta = this.starshieldPage.allCTAs.first();
    const hasHoverEffect = await cta.evaluate((el) => {
      const initialBg = window.getComputedStyle(el).backgroundColor;
      el.dispatchEvent(new Event("mouseover"));
      const hoverBg = window.getComputedStyle(el).backgroundColor;
      return initialBg !== hoverBg || el.classList.contains("hover-effect");
    });
    expect(hasHoverEffect).toBeTruthy();
  }
}
