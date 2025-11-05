import { expect, Page } from "@playwright/test";
import { Then, Fixture } from "playwright-bdd/decorators";
import { DataTable } from "playwright-bdd";
import { HomePage } from "../../../pages/ui/HomePage";
import { parseMetadataItems, parseSocialMediaTags } from "../../../types/TypeGuards";
import { MetadataItem, SocialMediaTag, MetadataTable } from "../../../utils/types/Types";

@Fixture("homePageMetadataSteps")
export class HomePageMetadataSteps {
  constructor(private page: Page, private homePage: HomePage) {}

  @Then("the page should contain correct metadata:")
  async checkMetadata(dataTable: DataTable): Promise<void> {
    const metadata = parseMetadataItems(dataTable.hashes());
    await this.validateMetadataItems(metadata);
  }

  private async validateMetadataItems(metadata: MetadataItem[]): Promise<void> {
    for (const item of metadata) {
      await this.validateMetadataItem(item);
    }
  }

  private async validateMetadataItem(item: MetadataItem): Promise<void> {
    switch (item.Element) {
      case "Title Tag":
        await this.validateTitleTag(item.Content);
        break;
      case "Description Meta":
        await this.validateDescriptionMeta(item.Content);
        break;
      case "Viewport":
        await this.validateViewportMeta(item.Content);
        break;
      case "Canonical URL":
        await this.validateCanonicalUrl(item.Content);
        break;
      default:
        console.warn(`Unknown metadata element: ${item.Element}`);
    }
  }

  private async validateTitleTag(expectedContent: string): Promise<void> {
    const title = await this.page.title();
    expect(title).toContain(expectedContent);
  }

  private async validateDescriptionMeta(expectedContent: string): Promise<void> {
    const metaDescription = await this.page.getAttribute(
      'meta[name="description"]',
      "content"
    );
    expect(metaDescription).toContain(expectedContent);
  }

  private async validateViewportMeta(expectedContent: string): Promise<void> {
    const viewportMeta = await this.page.getAttribute(
      'meta[name="viewport"]',
      "content"
    );
    expect(viewportMeta).toContain(expectedContent);
  }

  private async validateCanonicalUrl(expectedContent: string): Promise<void> {
    const canonicalLink = await this.page.getAttribute(
      'link[rel="canonical"]',
      "href"
    );
    expect(canonicalLink).toBe(expectedContent);
  }

  @Then("social media tags should be present:")
  async checkSocialMediaTags(dataTable: DataTable): Promise<void> {
    const tags = parseSocialMediaTags(dataTable.hashes());
    await this.validateSocialMediaTags(tags);
  }

  private async validateSocialMediaTags(tags: SocialMediaTag[]): Promise<void> {
    for (const tag of tags) {
      await this.validateSocialMediaTag(tag);
    }
  }

  private async validateSocialMediaTag(tag: SocialMediaTag): Promise<void> {
    if (tag.Platform === "Open Graph") {
      await this.validateOpenGraphTag();
    } else if (tag.Platform === "Twitter Card") {
      await this.validateTwitterCardTag();
    } else {
      console.warn(`Unknown social media platform: ${tag.Platform}`);
    }
  }

  private async validateOpenGraphTag(): Promise<void> {
    const ogTitle = await this.page.getAttribute(
      'meta[property="og:title"]',
      "content"
    );
    expect(ogTitle, "Open Graph og:title should be present").not.toBeNull();
  }

  private async validateTwitterCardTag(): Promise<void> {
    const twitterCard = await this.page.getAttribute(
      'meta[name="twitter:card"]',
      "content"
    );
    expect(twitterCard, "Twitter Card tag should be present").not.toBeNull();
  }

  @Then("the page metadata should be properly configured:")
  async checkPageMetadata(dataTable: DataTable): Promise<void> {
    const metas = dataTable.hashes() as MetadataTable;
    await this.validateMetadataConfiguration(metas);
  }

  private async validateMetadataConfiguration(metas: MetadataTable): Promise<void> {
    for (const meta of metas) {
      await this.validateSingleMetadataConfiguration(meta);
    }
  }

  private async validateSingleMetadataConfiguration(meta: MetadataTable[0]): Promise<void> {
    const metaNameOrProp = meta["Meta Name/Property"];
    const expectedContent = meta["Value Contains"];

    const actualContent = await this.getMetaContent(metaNameOrProp);

    expect(
      actualContent,
      `Metadata tag '${metaNameOrProp}' not found or is empty.`
    ).not.toBeNull();

    expect(
      actualContent?.toLowerCase(),
      `Metadata tag '${metaNameOrProp}' content '${actualContent}' does not contain expected value: '${expectedContent}'`
    ).toContain(expectedContent.toLowerCase());
  }

  private async getMetaContent(metaNameOrProp: string): Promise<string | null> {
    if (metaNameOrProp.includes(":")) {
      return await this.homePage.getPageProperty(metaNameOrProp);
    } else {
      return await this.homePage.getMetaTagContent(metaNameOrProp);
    }
  }
}