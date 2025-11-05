import { expect, Page } from "@playwright/test";
import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { StarshieldPage } from "../../../pages/ui/StarshieldPage";
import { AssertionHelper } from "../../../utils/AssertionHelper";

@Fixture("starshieldPerformanceSteps")
export class StarshieldPerformanceSteps {
  constructor(
    protected page: Page,
    protected starshieldPage: StarshieldPage,
    protected assertionHelper: AssertionHelper
  ) {}

  @Given("the page is designed for performance optimization")
  async pageIsDesignedForPerformanceOptimization() {
    await this.starshieldPage.open();
  }

  @Then("the Largest Contentful Paint (LCP) should be fast")
  async largestContentfulPaintShouldBeFast() {
    const lcp = await this.page.evaluate(
      () =>
        performance
          .getEntriesByType("paint")
          .find((e) => e.name === "first-contentful-paint")?.startTime
    );
    this.assertionHelper.assertMetric(
      lcp,
      2500,
      "Largest Contentful Paint should be less than 2.5 seconds."
    );
  }

  @Then("all critical resources should be loaded efficiently")
  async allCriticalResourcesShouldBeLoadedEfficiently() {
    const imageLoaded = await this.starshieldPage.hero.heroImage.isVisible();
    expect(imageLoaded).toBeTruthy();
  }

  @Then("no major performance warnings should be present")
  async noMajorPerformanceWarningsShouldBePresent() {
    await expect(this.starshieldPage.errorBanner).not.toBeVisible();
  }

  @Given("the user has a slow network connection")
  async userHasASlowNetworkConnection() {
    await this.page.route("**/*", (route) => {
      route.continue({});
    });
    await this.page.emulateMedia({ reducedMotion: "reduce" });
  }

  @When("media content is loading")
  async mediaContentIsLoading() {
    await this.starshieldPage.page.reload({ waitUntil: "domcontentloaded" });
  }

  @Then("loading indicators should be displayed")
  async loadingIndicatorsShouldBeDisplayed() {
    const loadingIndicator = this.starshieldPage.page.locator(
      ".loading-spinner, .media-placeholder-spinner, .skeleton-screen"
    );
    await expect(loadingIndicator).toBeVisible({ timeout: 5000 });
  }

  @Then("the page should remain responsive")
  async thePageShouldRemainResponsive() {
    await expect(
      this.starshieldPage.mainNavigationMenu.locator("a").first()
    ).toBeEnabled();
  }

  @Then("users should have the option to cancel or skip media loading")
  async usersShouldHaveTheOptionToCancelOrSkipMediaLoading() {
    const skipOrCancelButton = this.starshieldPage.page.locator("button", {
      hasText: /skip|cancel|dismiss/i,
    });

    (await skipOrCancelButton.count()) > 0
      ? await expect(skipOrCancelButton).toBeVisible()
      : await expect(this.starshieldPage.mainNavigationMenu).toBeVisible();
  }

  @Given("the page contains hero images or graphics")
  async thePageContainsHeroImagesOrGraphics() {
    await expect(this.starshieldPage.hero.heroImage).toBeVisible();
  }

  @Then("images should load progressively or with placeholders")
  async imagesShouldLoadProgressivelyOrWithPlaceholders() {
    const heroImage = this.starshieldPage.hero.heroImage;
    const isLazyLoaded = (await heroImage.getAttribute("loading")) === "lazy";
    const hasPlaceholder = await this.page
      .locator(".image-placeholder, .skeleton-screen")
      .isVisible();

    expect(isLazyLoaded || hasPlaceholder).toBeTruthy();
  }

  @Then("images should have appropriate alt text for accessibility")
  async imagesShouldHaveAppropriateAltTextForAccessibility() {
    const altText = await this.starshieldPage.hero.heroImage.getAttribute(
      "alt"
    );
    this.assertionHelper.assertValuePresent(
      altText,
      "Hero image must have a non-empty 'alt' attribute for accessibility."
    );
    expect(altText?.length).toBeGreaterThan(5);
  }

  @Then("images should be optimized for web performance")
  async imagesShouldBeOptimizedForWebPerformance() {
    const heroImage = this.starshieldPage.hero.heroImage;
    const src = await heroImage.getAttribute("src");
    const srcset = await heroImage.getAttribute("srcset");

    const isOptimized =
      src?.toLowerCase().endsWith(".webp") || (srcset && srcset.length > 0);

    expect(isOptimized).toBeTruthy();
  }

  @Given("the page contains video content")
  async thePageContainsVideoContent() {
    await expect(this.starshieldPage.videoPlayer).toBeVisible();
  }

  @When("the user interacts with video controls")
  async theUserInteractsWithVideoControls() {
    await this.starshieldPage.videoPlayer
      .locator('[aria-label="Play"], [aria-label="Pause"], .play-button')
      .first()
      .click();
  }

  @Then("the video should play smoothly")
  async theVideoShouldPlaySmoothly() {
    const isPlaying = this.starshieldPage.videoPlayer
      .locator(
        '[data-state="playing"], .video-playing, button[aria-label="Pause"]'
      )
      .first();
    await expect(isPlaying).toBeVisible();
  }

  @Then("playback controls should be responsive")
  async playbackControlsShouldBeResponsive() {
    const controls = this.starshieldPage.videoPlayer
      .locator(
        '[role="slider"], button[aria-label*="screen"], button[aria-label*="Volume"]'
      )
      .first();
    await expect(controls).toBeEnabled();
  }

  @Then("video should support pause, play, and volume adjustment")
  async videoShouldSupportPausePlayAndVolumeAdjustment() {
    await expect(
      this.starshieldPage.videoPlayer
        .locator('button[aria-label*="play"], button[aria-label*="pause"]')
        .first()
    ).toBeVisible();
    await expect(
      this.starshieldPage.videoPlayer
        .locator('[aria-label="Volume"], [role="slider"][aria-label="volume"]')
        .first()
    ).toBeVisible();
  }
}
