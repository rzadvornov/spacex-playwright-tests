import { Page, Locator } from "@playwright/test";
import { SpaceXPage } from "../base/SpaceXPage";

export class RidesharePage extends SpaceXPage {
  readonly mainHeadline: Locator;
  readonly anchorPrice: Locator;
  readonly searchFlightsButton: Locator;
  readonly plateConfigurationSection: Locator;
  readonly specsTable: Locator;
  readonly payloadUserGuideLink: Locator;
  readonly payloadUserGuideDescription: Locator;
  readonly bookPlateButton: Locator;
  readonly reservationForm: Locator;
  readonly customOptionsSection: Locator;
  readonly cakeTopperNote: Locator;
  readonly customContactInfo: Locator;
  readonly logisticsSection: Locator;
  readonly postReservationStepsSection: Locator;
  readonly programValueOverview: Locator;
  readonly programInfoSection: Locator;
  readonly launchVehicleSection: Locator;
  readonly searchInterface: Locator;
  readonly upcomingLaunchDatesList: Locator;
  readonly availableFlights: Locator;
  readonly pricingCapacitySection: Locator;
  readonly availableFlightsSection: Locator;
  readonly customOptionsText: Locator;
  readonly processingTimelineText: Locator;
  readonly processingLocationText: Locator;
  readonly welcomePackageText: Locator;
  readonly documentationProtocolsText: Locator;

  constructor(page: Page) {
    super(page);

    this.mainHeadline = this.page
      .getByRole("heading", { name: /dedicated rideshare missions/i, level: 1 })
      .or(this.page.locator(".headline:has-text('Rideshare Missions')"))
      .first();

    this.anchorPrice = this.page
      .locator("span, p, div", { hasText: /as low as \$325k/i })
      .first();

    this.searchFlightsButton = this.page
      .getByRole("link", { name: "Search available flights" })
      .or(this.page.getByRole("button", { name: "Search available flights" }))
      .first();

    this.plateConfigurationSection = this.page
      .locator("#plate-configurations, main:has-text('Plate Options')")
      .first();

    this.specsTable = this.plateConfigurationSection.locator("table").first();

    this.payloadUserGuideLink = this.page
      .getByRole("link", { name: /payload user guide/i })
      .first();

    this.payloadUserGuideDescription = this.page
      .locator("p, div", { hasText: /standard interface.*espa-like/i })
      .first();

    this.bookPlateButton = this.page
      .getByRole("button", { name: /book|select configuration/i })
      .or(this.page.getByRole("link", { name: /book|select configuration/i }))
      .first();

    this.reservationForm = this.page
      .locator("#rideshare-booking-form, form:has-text('Payload Mass')")
      .first();

    this.customOptionsSection = this.page
      .locator("#custom-options, main:has-text('Custom Configurations')")
      .first();

    this.cakeTopperNote = this.customOptionsSection
      .locator("p, div", { hasText: /cake topper/i })
      .first();

    this.customContactInfo = this.customOptionsSection
      .locator("a[href^='mailto:'], a[href^='tel:'], p:has-text('Contact us')")
      .first();

    this.logisticsSection = this.page
      .locator("#logistics-section, main:has-text('Processing and Logistics')")
      .first();

    this.postReservationStepsSection = this.page
      .locator("#reservation-process, main:has-text('Reservation Process')")
      .or(this.logisticsSection)
      .first();
    
    this.programValueOverview = page.locator('section:has-text("program value")');
    this.programInfoSection = page.locator('#program-info-section');
    this.launchVehicleSection = page.locator('#vehicle-section');
    this.searchInterface = page.locator('input[placeholder*="Search Missions"]');
    this.upcomingLaunchDatesList = page.locator('#mission-list');
    this.availableFlights = this.page.locator("div.flight-list-item");
    this.pricingCapacitySection = page.locator('#pricing-capacity-section, text=/Pricing and Mass Capacity/').first();
    this.availableFlightsSection = page.locator('#available-flights-section, [data-testid="flight-listings"]').first();
    this.customOptionsText = page.locator('section:has-text("Custom Interfaces") p, section:has-text("Custom Interfaces") li').first();
    this.processingTimelineText = page.locator('section:has-text("Payload Processing")').filter({ hasText: /timeline|key dates/i });
    this.processingLocationText = page.locator('section:has-text("Payload Processing")').filter({ hasText: /SpaceX facility/i });
    this.welcomePackageText = page.locator('section:has-text("Approval Process")').filter({ hasText: /welcome package/i });
    this.documentationProtocolsText = page.locator('section:has-text("Approval Process")').filter({ hasText: /contact and documentation exchange/i });
  }

  callToActionLink(text: string): Locator {
    return this.page.getByRole('link', { name: text, exact: true });
  }

  falconDescription(vehicle: number): Locator {
    return this.page.locator(`text=/Falcon ${vehicle}.*reusable orbital class rocket/i`);
  }

  async navigate(urlPath: string = "/rideshare"): Promise<void> {
    this.setupErrorListeners();
    await this.open(urlPath);
    await this.waitForAppContentLoad();
  }

  async isPlateOptionDisplayed(
    configuration: string,
    boltPattern: string,
    includedMass: string
  ): Promise<boolean> {
    const rowLocator = this.specsTable.locator("tr", {
      has: this.page.locator(`td:has-text(\"${configuration}\")`),
    });
    return (
      (await rowLocator
        .locator(`td:has-text(\"${boltPattern}\")`)
        .isVisible()) &&
      (await rowLocator.locator(`td:has-text(\"${includedMass}\")`).isVisible())
    );
  }

  async isReservationPromptVisible(): Promise<boolean> {
    const isFormVisible = await this.reservationForm.isVisible();
    const hasMassField = await this.reservationForm
      .locator('input[name="mass"], textarea:has-text("Payload Mass")')
      .isVisible();
    const hasRequirementsField = await this.reservationForm
      .locator(
        'textarea[name="requirements"], textarea:has-text("Mission Requirements")'
      )
      .isVisible();
    return isFormVisible && hasMassField && hasRequirementsField;
  }

  async isApprovalProcessDetailed(): Promise<boolean> {
    const processText = await this.postReservationStepsSection.textContent();
    const lowerCaseText = processText?.toLowerCase() || "";
    const containsApproval = lowerCaseText.includes("approval process");
    const containsWelcomePackage = lowerCaseText.includes("welcome package");
    const containsContactProtocol =
      lowerCaseText.includes("contact protocols") ||
      lowerCaseText.includes("technical documentation exchange");

    return (
      containsApproval && containsWelcomePackage && containsContactProtocol
    );
  }

  async isDocumentationLinked(name: string): Promise<boolean> {
    const locator = this.page.getByRole('link', { name: name });
    const isVisible = await locator.isVisible();
    const hasHref = (await locator.getAttribute('href')) !== null;
    return isVisible && hasHref;
  }
  
  async isSpecDisplayed(attribute: string, detail: string): Promise<boolean> {
      const rowLocator = this.page.locator('#specs-table tr', { 
          has: this.page.locator(`td:has-text("${attribute}")`) 
      });
      return await rowLocator.locator(`td:has-text("${detail}")`).isVisible();
  }
  
  async clickFeature(name: string): Promise<void> {
    await this.page.getByRole('button', { name: name }).click();
  }
}
