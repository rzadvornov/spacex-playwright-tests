import { Page, Locator } from "@playwright/test";
import { SpaceXPage } from "../base/SpaceXPage";
import { HeroPOF } from "../fragments/HeroPOF";

export class StarshipPage extends SpaceXPage {
  readonly hero: HeroPOF;
  readonly overviewSection: Locator;
  readonly capabilitiesSection: Locator;
  readonly specificationsSection: Locator;
  readonly propulsionSection: Locator;
  readonly missionsSection: Locator;
  readonly payloadSection: Locator;
  readonly developmentSection: Locator;
  readonly contactSection: Locator;

  constructor(page: Page) {
    super(page);
    this.hero = new HeroPOF(page);
    this.overviewSection = this.appRoot.locator(".starship-overview, .overview-section").first();
    this.capabilitiesSection = this.appRoot.locator(".starship-capabilities, .capabilities-section").first();
    this.specificationsSection = this.appRoot.locator(".starship-specifications, .specifications-section").first();
    this.propulsionSection = this.appRoot.locator(".starship-propulsion, .propulsion-section").first();
    this.missionsSection = this.appRoot.locator(".starship-missions, .missions-section").first();
    this.payloadSection = this.appRoot.locator(".starship-payload, .payload-section").first();
    this.developmentSection = this.appRoot.locator(".starship-development, .development-section").first();
    this.contactSection = this.appRoot.locator(".starship-contact, .contact-section").first();
  }

  async open(urlPath: string = "/vehicles/starship"): Promise<void> {
    this.setupErrorListeners();
    await this.goto(this.baseURL + urlPath, { waitUntil: "domcontentloaded" });
    await this.waitForAppContentLoad();
  }

  async getOverviewHeadline(): Promise<string> {
    const headline = this.overviewSection
      .getByRole("heading", { level: 1 })
      .or(this.overviewSection.locator("h1"))
      .first();
    return (await headline.textContent())?.trim() ?? "";
  }

  async getOverviewDescription(): Promise<string> {
    const description = this.overviewSection
      .locator(".overview-description, .value-proposition")
      .first();
    return (await description.textContent())?.trim() ?? "";
  }

  // Capabilities Section Methods
  async getCapabilityDetail(capabilityType: string): Promise<string> {
    const capabilityRow = this.capabilitiesSection
      .locator(".capability-row, .spec-row")
      .filter({ has: this.page.getByText(capabilityType, { exact: true }) })
      .first();
    
    const valueCell = capabilityRow.locator(".capability-value, .spec-value").first();
    return (await valueCell.textContent())?.trim() ?? "";
  }

  // Specifications Section Methods
  async getStarshipSpecification(attribute: string): Promise<{ metric: string; imperial: string }> {
    return await this.getSpecification("starship", attribute);
  }

  async getSuperHeavySpecification(attribute: string): Promise<{ metric: string; imperial: string }> {
    return await this.getSpecification("super-heavy", attribute);
  }

  private async getSpecification(vehicle: string, attribute: string): Promise<{ metric: string; imperial: string }> {
    const specSection = this.specificationsSection
      .locator(`.${vehicle}-specs, .${vehicle}-specifications`)
      .first();
    
    const attributeRow = specSection
      .locator(".spec-row, .specification-row")
      .filter({ has: this.page.getByText(attribute, { exact: true }) })
      .first();
    
    const metricValue = await attributeRow.locator(".metric-value, .spec-metric").first().textContent();
    const imperialValue = await attributeRow.locator(".imperial-value, .spec-imperial").first().textContent();
    
    return {
      metric: metricValue?.trim() ?? "",
      imperial: imperialValue?.trim() ?? ""
    };
  }

  // Propulsion Section Methods
  async getRaptorEngineSpecs(engineType: 'sea-level' | 'vacuum'): Promise<Map<string, string>> {
    const engineSection = this.propulsionSection
      .locator(`.raptor-${engineType}, .${engineType}-engine`)
      .first();
    
    const specs = new Map<string, string>();
    const specRows = await engineSection.locator(".spec-row, .engine-spec").all();
    
    for (const row of specRows) {
      const attribute = await row.locator(".spec-attribute, .engine-attribute").first().textContent();
      const value = await row.locator(".spec-value, .engine-value").first().textContent();
      
      if (attribute && value) {
        specs.set(attribute.trim(), value.trim());
      }
    }
    
    return specs;
  }

  async getEngineConfiguration(): Promise<string> {
    const configNote = this.propulsionSection
      .locator(".engine-configuration, .config-note")
      .first();
    return (await configNote.textContent())?.trim() ?? "";
  }

  // Missions Section Methods
  async getMissionCapabilities(missionType: 'mars' | 'lunar' | 'earth'): Promise<string[]> {
    const missionSection = this.missionsSection
      .locator(`.${missionType}-missions, .${missionType}-capabilities`)
      .first();
    
    const capabilityItems = await missionSection
      .locator(".capability-item, .mission-feature")
      .all();
    
    const capabilities: string[] = [];
    for (const item of capabilityItems) {
      const text = await item.textContent();
      if (text) {
        capabilities.push(text.trim());
      }
    }
    
    return capabilities;
  }

  // Payload Section Methods
  async getPayloadAdvantages(): Promise<string[]> {
    const advantageItems = await this.payloadSection
      .locator(".advantage-item, .payload-feature")
      .all();
    
    const advantages: string[] = [];
    for (const item of advantageItems) {
      const text = await item.textContent();
      if (text) {
        advantages.push(text.trim());
      }
    }
    
    return advantages;
  }

  // Development Section Methods
  async getDevelopmentLocation(): Promise<string> {
    const location = this.developmentSection
      .locator(".development-location, .manufacturing-site")
      .first();
    return (await location.textContent())?.trim() ?? "";
  }

  async getDevelopmentUpdates(): Promise<string> {
    const updates = this.developmentSection
      .locator(".development-updates, .testing-progress")
      .first();
    return (await updates.textContent())?.trim() ?? "";
  }

  // Contact Section Methods
  async getSalesEmail(): Promise<string> {
    const emailLink = this.contactSection
      .getByRole("link", { name: /sales@spacex.com/i })
      .or(this.contactSection.locator('a[href^="mailto:sales@spacex.com"]'))
      .first();
    
    return (await emailLink.textContent())?.trim() ?? "";
  }

  // Navigation Methods
  async navigateToSection(section: string): Promise<void> {
    const sectionLink = this.appRoot.getByRole("link", { name: section, exact: true });
    await sectionLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  // Utility Methods
  async waitForStarshipPageLoad(): Promise<void> {
    await this.waitForAppContentLoad();
    await this.overviewSection.waitFor({ state: 'visible' });
  }

  async isStarshipPageLoaded(): Promise<boolean> {
    return await this.overviewSection.isVisible() && 
           await this.verifyPageTitle("Starship");
  }

  // Section Visibility Methods
  async isOverviewSectionVisible(): Promise<boolean> {
    return await this.overviewSection.isVisible();
  }

  async isCapabilitiesSectionVisible(): Promise<boolean> {
    return await this.capabilitiesSection.isVisible();
  }

  async isSpecificationsSectionVisible(): Promise<boolean> {
    return await this.specificationsSection.isVisible();
  }

  async isPropulsionSectionVisible(): Promise<boolean> {
    return await this.propulsionSection.isVisible();
  }

  async isMissionsSectionVisible(): Promise<boolean> {
    return await this.missionsSection.isVisible();
  }

  async isPayloadSectionVisible(): Promise<boolean> {
    return await this.payloadSection.isVisible();
  }

  async isDevelopmentSectionVisible(): Promise<boolean> {
    return await this.developmentSection.isVisible();
  }

  async isContactSectionVisible(): Promise<boolean> {
    return await this.contactSection.isVisible();
  }
}