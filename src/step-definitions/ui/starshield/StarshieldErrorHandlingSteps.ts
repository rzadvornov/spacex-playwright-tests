import { expect, Page } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { StarshieldPage } from "../../../services/ui/StarshieldPage";
import { SharedContext } from "../../../utils/types/Types";
import { AssertionHelper } from "../../../utils/AssertionHelper";
import StatusCode from "status-code-enum";

@Fixture("starshieldErrorHandlingSteps")
export class StarshieldErrorHandlingSteps {
  constructor(
    protected page: Page,
    protected starshieldPage: StarshieldPage,
    protected sharedContext: SharedContext,
    protected assertionHelper: AssertionHelper
  ) {}

  @Given("a network interruption occurs during page load")
  async aNetworkInterruptionOccursDuringPageLoad() {
    await this.page.route("**", (route) => {
      route.abort("failed");
    });
  }

  @When("assets fail to load")
  async assetsFailToLoad() {
    try {
      await this.starshieldPage.page.goto(
        this.starshieldPage.baseURL + "/starshield",
        { timeout: 5000, waitUntil: "domcontentloaded" }
      );
    } catch (error) {}
  }

  @Then("appropriate fallbacks should be in place")
  async appropriateFallbacksShouldBeInPlace() {
    const bodyText = await this.starshieldPage.page
      .locator("body")
      .textContent();
    expect(bodyText?.length).toBeGreaterThan(10);
    const altText = await this.starshieldPage.hero.heroImage.getAttribute(
      "alt"
    );
    this.assertionHelper.assertValuePresent(
      altText,
      "Alt text must be present as a fallback for the hero image."
    );
  }

  @Then("the user should be notified of loading issues")
  async userShouldBeNotifiedOfLoadingIssues() {
    const networkError = this.starshieldPage.page.locator(
      ".network-error-banner, .connection-failed-message"
    );
    await expect(networkError).toBeVisible();
  }

  @Then("retry mechanisms should be available where appropriate")
  async retryMechanismsShouldBeAvailableWhereAppropriate() {
    const retryButton = this.starshieldPage.page.locator("button, a", {
      hasText: /retry|reload|try again/i,
    });
    await expect(retryButton).toBeVisible();
  }

  @Given("JavaScript fails to load or is disabled")
  async javaScriptFailsToLoadOrIsDisabled() {
    await (this.page.context() as any).setJavaScriptEnabled(false);
    await this.page.reload({ waitUntil: "domcontentloaded" });
  }

  @When("the user views the page")
  async userViewsThePage() {
    await this.starshieldPage.page.waitForLoadState("domcontentloaded");
  }

  @Then("core content should still be accessible")
  async coreContentShouldStillBeAccessible() {
    const coreSections = this.starshieldPage.page.locator("h1, h2, h3");
    expect(await coreSections.count()).toBeGreaterThanOrEqual(5);
  }

  @Then("basic navigation should remain functional")
  async basicNavigationShouldRemainFunctional() {
    await expect(
      this.starshieldPage.mainNavigationMenu.locator("a").first()
    ).toBeEnabled();
  }

  @Then("critical information should be visible without JavaScript")
  async criticalInformationShouldBeVisibleWithoutJavaScript() {
    const heroText = await this.starshieldPage.hero.heroSection.textContent();
    this.assertionHelper.assertValuePresent(
      heroText,
      "Hero text content must be present even without JavaScript."
    );
    expect(heroText?.length).toBeGreaterThan(50);
  }

  @Given("the page relies on API calls for dynamic content")
  async pageReliesOnApiCallsForDynamicContent() {
    await expect(this.starshieldPage.testimonialsSection).toBeVisible();
  }

  @When("an API call fails or times out")
  async anApiCallFailsOrTimesOut() {
    await this.page.route("**/api/v1/dynamic-content*", (route) => {
      route.fulfill({
        status: StatusCode.ServerErrorGatewayTimeout,
        body: "API service unavailable",
      });
    });
    await this.starshieldPage.page.reload({ waitUntil: "domcontentloaded" });
  }

  @Then("cached or default content should be displayed where possible")
  async cachedOrDefaultContentShouldBeDisplayedWherePossible() {
    const testimonialText =
      await this.starshieldPage.testimonialsSection.textContent();
    expect(testimonialText?.toLowerCase()).toMatch(
      /default content|case study coming soon|fallback data/i
    );
  }

  @Then("an appropriate error message should inform the user")
  async appropriateErrorMessageShouldInformTheUser() {
    const apiError = this.starshieldPage.testimonialsSection.locator(
      ".api-error-message, .data-load-failed"
    );
    await expect(apiError).toBeVisible();
  }

  @Then("the page should allow retry or refresh actions")
  async pageShouldAllowRetryOrRefreshActions() {
    const retryOrRefreshButton = this.starshieldPage.page.locator("button, a", {
      hasText: /retry|refresh|reload/i,
    });
    await expect(retryOrRefreshButton).toBeVisible();
  }

  @Given("the page attempts to display content")
  async pageAttemptsToDisplayContent() {
    await expect(this.starshieldPage.videoPlayer).toBeVisible();
  }

  @When("the content format is not supported by the browser")
  async theContentFormatIsNotSupportedByTheBrowser() {
    await this.page.route("**/*.mp4", (route) => {
      route.fulfill({
        status: 200,
        contentType: "video/unsupported",
        body: "Invalid video stream data",
      });
    });
    await this.starshieldPage.page.reload();
  }

  @Then("an appropriate fallback or alternative should be provided")
  async appropriateFallbackOrAlternativeShouldBeProvided() {
    const fallback = this.starshieldPage.videoPlayer
      .locator("a", {
        hasText: /transcript|download|alternative format/i,
      })
      .or(this.starshieldPage.videoPlayer.locator(".video-poster"));

    await expect(fallback).toBeVisible();
  }

  @Then("the user should be notified of the limitation")
  async theUserShouldBeNotifiedOfTheLimitation() {
    const notification =
      this.starshieldPage.videoPlayer.locator(".error-message");
    await expect(notification).toBeVisible();
    const notificationText = await notification.textContent();
    expect(notificationText?.toLowerCase()).toMatch(
      /format not supported|codec not found/i
    );
  }

  @Then("a download option should be offered if applicable")
  async downloadOptionShouldBeOfferedIfApplicable() {
    const downloadLink = this.starshieldPage.videoPlayer.locator("a", {
      hasText: /download/i,
    });
    await expect(downloadLink).toBeVisible();
  }

  @Given("the page loads content dynamically")
  async pageLoadsContentDynamically() {
    await expect(this.starshieldPage.testimonialsSection).toBeVisible();
  }

  @When("dynamic content fails to load")
  async dynamicContentFailsToLoad() {
    await this.page.route("**/api/v1/dynamic-content*", (route) => {
      route.fulfill({
        status: StatusCode.ServerErrorGatewayTimeout,
        body: "API service unavailable",
      });
    });
    await this.starshieldPage.page.reload({ waitUntil: "domcontentloaded" });
  }

  @Then("static fallback content should be displayed")
  async staticFallbackContentShouldBeDisplayed() {
    const staticFallback = this.starshieldPage.testimonialsSection.locator(
      ".static-fallback-content, .default-message"
    );
    await expect(staticFallback).toBeVisible();
  }

  @Then("the failure should not affect other page sections")
  async theFailureShouldNotAffectOtherPageSections() {
    await expect(this.starshieldPage.mainNavigationMenu).toBeVisible();
    await expect(this.starshieldPage.footer.footer).toBeVisible();
    await expect(
      this.starshieldPage.mainNavigationMenu.locator("a").first()
    ).toBeEnabled();
  }

  @Given("the page contains images")
  async pageContainsImages() {
    const images = this.starshieldPage.page.locator("img");
    expect(await images.count()).toBeGreaterThan(0);
  }

  @When("an image fails to load")
  async imageFailsToLoad() {
    await this.page.route("**/*.jpg", (route) => {
      route.abort();
    });
    await this.page.route("**/*.png", (route) => {
      route.abort();
    });
    await this.starshieldPage.page.reload();
  }

  @Then("a placeholder or fallback image should be displayed")
  async placeholderOrFallbackImageShouldBeDisplayed() {
    const failedImages = this.starshieldPage.page.locator(
      "img[alt]:not([src])"
    );
    const placeholders = this.starshieldPage.page.locator(
      ".image-placeholder, [data-testid='image-fallback']"
    );

    const hasFallback =
      (await failedImages.count()) > 0 || (await placeholders.count()) > 0;
    expect(hasFallback).toBeTruthy();
  }

  @Then("the page layout should not be broken")
  async pageLayoutShouldNotBeBroken() {
    await expect(this.starshieldPage.mainNavigationMenu).toBeVisible();
    await expect(this.starshieldPage.footer.footer).toBeVisible();

    const heroBox = await this.starshieldPage.hero.heroSection.boundingBox();
    const navBox = await this.starshieldPage.mainNavigationMenu.boundingBox();

    expect(heroBox?.y).toBeGreaterThan(navBox?.y || 0);
  }

  @Then("alt text should be visible if supported")
  async altTextShouldBeVisibleIfSupported() {
    const imagesWithAlt = this.starshieldPage.page.locator("img[alt]");
    const count = await imagesWithAlt.count();
    expect(count).toBeGreaterThan(0);
  }

  @When("a video fails to load or is unavailable")
  async videoFailsToLoadOrIsUnavailable() {
    await this.page.route("**/*.mp4", (route) => {
      route.fulfill({
        status: StatusCode.ClientErrorNotFound,
        body: "Video not found",
      });
    });
    await this.starshieldPage.page.reload();
  }

  @Then("an appropriate error message should be displayed in the video player")
  async appropriateErrorMessageInVideoPlayer() {
    const errorMessage = this.starshieldPage.videoPlayer.locator(
      ".video-error, [data-testid='video-error']"
    );
    await expect(errorMessage).toBeVisible();
    const errorText = await errorMessage.textContent();
    expect(errorText?.toLowerCase()).toMatch(
      /failed to load|unavailable|error/i
    );
  }

  @Then("alternative content or retry option should be offered")
  async alternativeContentOrRetryOptionShouldBeOffered() {
    const fallbackContent = this.starshieldPage.videoPlayer.locator(
      ".video-fallback, .transcript"
    );
    const retryButton = this.starshieldPage.videoPlayer.locator("button", {
      hasText: /retry|reload/i,
    });

    const hasAlternative =
      (await fallbackContent.isVisible()) || (await retryButton.isVisible());
    expect(hasAlternative).toBeTruthy();
  }

  @Then("the rest of the page should remain functional")
  async restOfPageShouldRemainFunctional() {
    await expect(this.starshieldPage.mainNavigationMenu).toBeVisible();
    await expect(this.starshieldPage.hero.heroSection).toBeVisible();
    await expect(this.starshieldPage.footer.footer).toBeVisible();
  }

  @Then("the content should be displayed without errors")
  async theContentShouldBeDisplayedWithoutErrors() {
    await expect(this.starshieldPage.errorBanner).not.toBeVisible();
    await expect(this.starshieldPage.hero.heroSection).toBeVisible();
  }
}
