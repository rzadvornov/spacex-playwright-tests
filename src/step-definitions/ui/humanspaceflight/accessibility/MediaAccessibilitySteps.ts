import { Page, expect } from "@playwright/test";
import { When, Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../../../services/ui/HumanSpaceflightPage";
import { parseAccessibilityRequirements } from "../../../../utils/types/Types";

@Fixture("mediaAccessibilitySteps")
export class MediaAccessibilitySteps {
  constructor(
    private page: Page,
    private humanSpaceflightPage: HumanSpaceflightPage
  ) {}

  @When("I play video in the media carousel")
  async playVideoInMediaCarousel(): Promise<void> {
    const videoPlayButton = await this.page.$(
      '.media-carousel button:has-text("Play"), .video-tile button'
    );

    if (videoPlayButton) {
      await videoPlayButton.click();
      await this.page.waitForTimeout(1000);
    } else {
      const videoElement = await this.page.$("video");
      if (videoElement) {
        await videoElement.click();
      }
    }
  }

  @Then("the content should have the following accessibility features:")
  async checkMediaAccessibilityFeatures(dataTable: DataTable): Promise<void> {
    const requirements = parseAccessibilityRequirements(dataTable.hashes());
    const requirementMap = new Map(
      requirements.map((req) => [req.Requirement, true])
    );

    if (requirementMap.has("Controls")) {
      const hasControls =
        (await this.page.$("video[controls], audio[controls]")) !== null;
      expect(
        hasControls,
        "Media content should have visible controls"
      ).toBeTruthy();
    }

    if (requirementMap.has("Progress")) {
      const hasProgress =
        (await this.page.$('progress, [role="progressbar"]')) !== null;
      expect(
        hasProgress,
        "Media content should have progress indication"
      ).toBeTruthy();
    }

    if (requirementMap.has("Volume")) {
      const hasVolumeControl =
        (await this.page.$('[aria-label*="volume"], [title*="volume"]')) !==
        null;
      expect(
        hasVolumeControl,
        "Media content should have volume control"
      ).toBeTruthy();
    }

    const hasCaptions =
      (await this.page.$('track[kind="captions"], [aria-label*="caption"]')) !==
      null;
    const hasTranscript =
      (await this.page.$('[aria-describedby*="transcript"], .transcript')) !==
      null;

    if (requirementMap.has("Captions")) {
      expect(hasCaptions, "Video content should have captions").toBeTruthy();
    }

    if (requirementMap.has("Transcript")) {
      expect(
        hasTranscript,
        "Audio content should have transcript"
      ).toBeTruthy();
    }
  }

  @Then("the content should be pauseable")
  async checkContentIsPauseable(): Promise<void> {
    const pauseButton = await this.page.$(
      'button:has-text("Pause"), [aria-label*="pause"]'
    );
    const hasPauseControl = pauseButton !== null;

    const mediaWithControls = await this.page.$(
      "video[controls], audio[controls]"
    );
    const hasMediaControls = mediaWithControls !== null;

    expect(
      hasPauseControl || hasMediaControls,
      "Media content should be pauseable with visible controls"
    ).toBeTruthy();
  }

  @When("I play audio in the media carousel")
  async playAudioInMediaCarousel(): Promise<void> {
    const audioPlayButton = await this.page.$(
      '.media-carousel button:has-text("Play"), .audio-tile button'
    );

    if (audioPlayButton) {
      await audioPlayButton.click();
      await this.page.waitForTimeout(1000);
    } else {
      const audioElement = await this.page.$("audio");
      if (audioElement) {
        await audioElement.click();
      }
    }
  }

  @Then("users should maintain control over playback")
  async checkUserPlaybackControl(): Promise<void> {
    const mediaElements = await this.page.$$("video, audio");

    for (const element of mediaElements) {
      const hasControl = await element.evaluate((el: HTMLMediaElement) => {
        return (
          el.controls || el.parentElement?.querySelector("button") !== null
        );
      });

      expect(
        hasControl,
        "Users should maintain control over media playback"
      ).toBeTruthy();
    }
  }

  @Then("all media elements should follow these rules:")
  async checkMediaElementRules(dataTable: DataTable): Promise<void> {
    const mediaRules = dataTable.hashes();

    for (const rule of mediaRules) {
      const mediaType = rule["Media Type"];
      const initialState = rule["Initial State"];
      const userControlRequired = rule["User Control Required"];
      const autoPlay = rule["Auto-play"];

      await this.validateMediaElementRules(
        mediaType,
        initialState,
        userControlRequired,
        autoPlay
      );
    }
  }

  private async validateMediaElementRules(
    mediaType: string,
    initialState: string,
    userControlRequired: string,
    autoPlay: string
  ): Promise<void> {
    const elements = await this.getMediaElementsByType(mediaType);

    for (const element of elements) {
      const followsRules = await this.mediaElementFollowsRules(
        element,
        initialState,
        userControlRequired,
        autoPlay
      );
      expect(
        followsRules,
        `${mediaType} elements should follow accessibility rules`
      ).toBeTruthy();
    }
  }

  private async getMediaElementsByType(mediaType: string): Promise<any[]> {
    const mediaTypeMap: Record<string, string> = {
      video: "video",
      audio: "audio",
      animation: '[class*="animate"], [class*="animation"]',
    };

    const selector = mediaTypeMap[mediaType.toLowerCase()];
    return selector ? await this.page.$$(selector) : [];
  }

  private async mediaElementFollowsRules(
    element: any,
    initialState: string,
    userControlRequired: string,
    autoPlay: string
  ): Promise<boolean> {
    const rules: boolean[] = [];

    if (initialState === "Paused") {
      const isPaused = await element.evaluate(
        (el: HTMLMediaElement | HTMLElement) => {
          if (el instanceof HTMLMediaElement) {
            return el.paused;
          }
          return true;
        }
      );
      rules.push(isPaused);
    }

    if (userControlRequired === "Yes") {
      const hasControls = await element.evaluate(
        (el: HTMLMediaElement | HTMLElement) => {
          if (el instanceof HTMLMediaElement) {
            return el.controls;
          }
          return (
            el.hasAttribute("controls") || el.querySelector("button") !== null
          );
        }
      );
      rules.push(hasControls);
    }

    if (autoPlay === "No") {
      const noAutoplay = await element.evaluate(
        (el: HTMLMediaElement | HTMLElement) => {
          return !el.hasAttribute("autoplay");
        }
      );
      rules.push(noAutoplay);
    }

    return rules.every((rule) => rule);
  }

  @Then("{word} content should be fully accessible:")
  async checkMediaAccessibility(
    mediaType: "video" | "audio",
    dataTable: DataTable
  ) {
    const results =
      await this.humanSpaceflightPage.accessibility.checkMediaFeatures(
        mediaType
      );
    const requirements = parseAccessibilityRequirements(dataTable.hashes());

    for (const requirement of requirements) {
      await this.validateMediaRequirement(
        mediaType,
        requirement.Requirement,
        results
      );
    }
  }

  private async validateMediaRequirement(
    mediaType: string,
    requirement: string,
    results: any
  ): Promise<void> {
    switch (requirement) {
      case "Controls available":
        expect(
          results.hasControls,
          `${mediaType} element must have visible controls`
        ).toBeTruthy();
        break;
      case "Captions/Transcripts":
        expect(
          results.hasCaptions,
          `${mediaType} must provide captions or transcript`
        ).toBeTruthy();
        break;
    }
  }

  @Then("screen readers should use correct pronunciation")
  async checkPronunciation() {
    const lang =
      await this.humanSpaceflightPage.accessibility.getHtmlLangAttribute();
    expect(
      lang,
      "Language must be set for screen readers to use correct pronunciation"
    ).toBeTruthy();
  }
}
