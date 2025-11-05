import { Page, expect } from "@playwright/test";
import { Then, Fixture } from "playwright-bdd/decorators";
import { HumanSpaceflightPage } from "../../../../pages/ui/HumanSpaceflightPage";
import { DataTable } from "playwright-bdd";

@Fixture("seoMetaTagsSteps")
export class SeoMetaTagsSteps {
  constructor(
    private page: Page,
    private humanSpaceflightPage: HumanSpaceflightPage,
  ) {}

  @Then("the meta description should be present and under {int} characters")
  async checkMetaDescription(maxLength: number) {
    const metaTags =
      await this.humanSpaceflightPage.performanceSEO.getMetaTags();
    const description = metaTags["description"];

    expect(description, {
      message: "Meta description should be present",
    }).toBeDefined();
    expect(description!.length, {
      message: `Meta description should not exceed ${maxLength} characters (current: ${
        description!.length
      })`,
    }).toBeLessThanOrEqual(maxLength);
  }

  @Then("the Open Graph title should be {string}")
  async checkOGTitle(expectedTitle: string) {
    const ogTags =
      await this.humanSpaceflightPage.performanceSEO.getOpenGraphTags();
    expect(ogTags["title"], {
      message: `Open Graph title should be "${expectedTitle}"`,
    }).toBe(expectedTitle);
  }

  @Then("the robots meta tag should be present")
  async checkRobotsTag() {
    const robotsContent =
      await this.humanSpaceflightPage.performanceSEO.getRobotsMetaContent();
    expect(robotsContent, {
      message: "Robots meta tag should be present",
    }).toBeDefined();
  }

  @Then("a canonical link should be present")
  async checkCanonicalLink() {
    const canonicalUrl =
      await this.humanSpaceflightPage.performanceSEO.getCanonicalUrl();
    expect(canonicalUrl, {
      message: "Canonical link should be present",
    }).toBeDefined();
  }

  @Then("the page should have required meta tags:")
  async checkRequiredMetaTags(dataTable: DataTable) {
    const requiredTags = dataTable.hashes();
    const metaTags =
      await this.humanSpaceflightPage.performanceSEO.getMetaTags();

    for (const tag of requiredTags) {
      const tagValidators: Record<string, () => Promise<void>> = {
        Title: async () => {
          const pageTitle = await this.page.title();
          expect(pageTitle, {
            message: `Page title should be "${tag["Value/Pattern"]}"`,
          }).toBe(tag["Value/Pattern"]);
        },
        Description: async () => {
          const description = metaTags["description"];
          expect(description, {
            message: "Meta description should be present",
          }).toBeDefined();
          expect(description!.length, {
            message: `Meta description should be under ${tag["Value/Pattern"]} characters`,
          }).toBeLessThanOrEqual(
            parseInt(tag["Value/Pattern"].replace(/\D/g, ""))
          );
        },
        Viewport: async () => {
          const viewport = metaTags["viewport"];
          expect(viewport, {
            message: "Viewport meta tag should be present",
          }).toBeDefined();
          expect(viewport, {
            message: "Viewport should be optimized for mobile",
          }).toContain("device-width");
        },
        Robots: async () => {
          const robots =
            await this.humanSpaceflightPage.performanceSEO.getRobotsMetaContent();
          expect(robots, {
            message: "Robots meta tag should be present",
          }).toBeDefined();
          expect(robots, {
            message: "Robots should allow indexing and following",
          }).toContain("index");
        },
      };

      const validator = tagValidators[tag["Meta Element"]];
      if (!validator) {
        throw new Error(`Unknown meta element: ${tag["Meta Element"]}`);
      }
      await validator();
    }
  }

  @Then("the description should include key mission terms")
  async checkDescriptionMissionTerms() {
    const metaTags =
      await this.humanSpaceflightPage.performanceSEO.getMetaTags();
    const description = metaTags["description"];

    expect(description, {
      message: "Meta description should be present",
    }).toBeDefined();

    const missionTerms = [
      "space",
      "mission",
      "exploration",
      "research",
      "spaceflight",
    ];
    const hasMissionTerms = missionTerms.some((term) =>
      description!.toLowerCase().includes(term)
    );

    expect(hasMissionTerms, {
      message: "Meta description should include key mission terms",
    }).toBeTruthy();
  }

  @Then("Open Graph tags should be configured:")
  async checkOpenGraphTags(dataTable: DataTable) {
    const requiredOgTags = dataTable.hashes();
    const ogTags =
      await this.humanSpaceflightPage.performanceSEO.getOpenGraphTags();

    for (const tag of requiredOgTags) {
      const ogProperty = tag["OG Property"].toLowerCase();
      const ogValue = ogTags[ogProperty];

      expect(ogValue, {
        message: `Open Graph ${tag["OG Property"]} tag should be present`,
      }).toBeDefined();

      if (tag["Value/Format"] !== "Present and compelling") {
        expect(ogValue, {
          message: `Open Graph ${tag["OG Property"]} should match expected value`,
        }).toBe(tag["Value/Format"]);
      }
    }
  }
}