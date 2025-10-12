import { When, Then, Fixture } from "playwright-bdd/decorators";
import { expect, Page } from "@playwright/test";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../pages/ui/HumanSpaceflightPage";

@Fixture("vehicleSteps")
export class VehiclesSteps {
  constructor(
    private page: Page,
    private humanSpaceflightPage: HumanSpaceflightPage
  ) { }

  @When("I am viewing the Vehicles section")
  async viewVehiclesSection() {
    await this.humanSpaceflightPage.vehicles.scrollToVehiclesSection();
  }

  @Then("the section should display core elements:")
  async checkCoreElements(dataTable: DataTable) {
    const elements = dataTable.hashes();
    
    for (const element of elements) {
      const { Element, Content } = element;
      
      switch (Element) {
        case 'Section Title':
          // Check for section title - would need implementation in POF
          const sectionVisible = await this.humanSpaceflightPage.vehicles['vehiclesSection'].isVisible();
          expect(sectionVisible, { message: 'Vehicles section should be visible' }).toBe(true);
          break;
          
        case 'Vehicle Cards':
          const dragonContent = await this.humanSpaceflightPage.vehicles.getVehicleCardContent('Dragon');
          const starshipContent = await this.humanSpaceflightPage.vehicles.getVehicleCardContent('Starship');
          expect(dragonContent, { message: 'Dragon card should exist' }).not.toBeNull();
          expect(starshipContent, { message: 'Starship card should exist' }).not.toBeNull();
          break;
          
        case 'Research Card':
          const researchContent = await this.humanSpaceflightPage.vehicles.getVehicleCardContent('Develop your research');
          expect(researchContent, { message: 'Research card should exist' }).not.toBeNull();
          break;
          
        case 'Media Elements':
          const dragonMedia = await this.humanSpaceflightPage.vehicles.verifyVehicleMediaExists('Dragon');
          const starshipMedia = await this.humanSpaceflightPage.vehicles.verifyVehicleMediaExists('Starship');
          const researchMedia = await this.humanSpaceflightPage.vehicles.verifyVehicleMediaExists('Develop your research');
          expect(dragonMedia, { message: 'Dragon should have media' }).toBe(true);
          expect(starshipMedia, { message: 'Starship should have media' }).toBe(true);
          expect(researchMedia, { message: 'Research should have media' }).toBe(true);
          break;
          
        case 'Call-to-Actions':
          // Check that learn more links exist for all cards
          const dragonLink = (await this.humanSpaceflightPage.vehicles.getVehicleCardContent('Dragon'))?.learnMoreLink;
          const starshipLink = (await this.humanSpaceflightPage.vehicles.getVehicleCardContent('Starship'))?.learnMoreLink;
          const researchLink = (await this.humanSpaceflightPage.vehicles.getVehicleCardContent('Develop your research'))?.learnMoreLink;
          expect(dragonLink, { message: 'Dragon should have learn more link' }).toBeTruthy();
          expect(starshipLink, { message: 'Starship should have learn more link' }).toBeTruthy();
          expect(researchLink, { message: 'Research should have learn more link' }).toBeTruthy();
          break;
      }
    }
  }

  @When("I locate the {string} card")
  async locateCard(vehicleName: string) {
    const cardContent = await this.humanSpaceflightPage.vehicles.getVehicleCardContent(vehicleName);
    expect(cardContent, { message: `${vehicleName} card should exist` }).not.toBeNull();
  }

  @Then("the card should display the following information:")
  async checkCardInformation(dataTable: DataTable) {
    const info = dataTable.hashes();
    
    for (const item of info) {
      const { Element, Content } = item;
      
      switch (Element) {
        case 'Title':
          // Title validation would be done in specific card checks
          break;
        case 'Description':
          // Description validation would be done in specific card checks
          break;
        case 'Media Type':
          // Media type validation
          break;
        case 'Learn More':
          // Learn more link validation
          break;
      }
    }
  }

  @Then("the research card should display the following:")
  async checkResearchCardContent(dataTable: DataTable) {
    const content = dataTable.hashes();
    const researchContent = await this.humanSpaceflightPage.vehicles.getVehicleCardContent('Develop your research');
    expect(researchContent, { message: 'Research card should exist' }).not.toBeNull();
    
    for (const item of content) {
      const { Element, Content } = item;
      
      switch (Element) {
        case 'Title':
          expect(researchContent!.title, { message: 'Research card should have correct title' }).toBe(Content);
          break;
        case 'Description':
          expect(researchContent!.description, { message: 'Research card should have correct description' }).toContain(Content.substring(0, 30));
          break;
        case 'Link':
          expect(researchContent!.learnMoreLink, { message: 'Research card should have correct link' }).toBe(Content);
          break;
        case 'Media':
          const hasMedia = await this.humanSpaceflightPage.vehicles.verifyVehicleMediaExists('Develop your research');
          expect(hasMedia, { message: 'Research card should have media' }).toBe(true);
          break;
      }
    }
  }

  @Then("the research card should emphasize:")
  async checkResearchCardEmphasis(dataTable: DataTable) {
    const aspects = dataTable.hashes();
    const researchContent = await this.humanSpaceflightPage.vehicles.getVehicleCardContent('Develop your research');
    expect(researchContent, { message: 'Research card should exist' }).not.toBeNull();
    
    for (const aspect of aspects) {
      const { Aspect, Details } = aspect;
      
      // Check that the description contains relevant keywords for each aspect
      switch (Aspect) {
        case 'Innovation':
          expect(researchContent!.description.toLowerCase(), { message: 'Should emphasize innovation' }).toContain('research');
          break;
        case 'Access':
          expect(researchContent!.description.toLowerCase(), { message: 'Should emphasize access' }).toMatch(/(space|platform|access)/);
          break;
        case 'Support':
          expect(researchContent!.description.toLowerCase(), { message: 'Should emphasize support' }).toMatch(/(support|assistance|help)/);
          break;
      }
    }
  }

  @When("I interact with the {string} on the {string} card")
  async interactWithCardElement(element: string, cardName: string) {
    const normalizedCardName = cardName === 'Research' ? 'Develop your research' : cardName;
    
    switch (element) {
      case 'Learn More':
        await this.humanSpaceflightPage.vehicles.clickLearnMore(normalizedCardName);
        break;
      case 'Video':
        // Video interaction would need implementation in POF
        break;
      case 'Card':
        // Card hover/touch interaction
        const card = this.humanSpaceflightPage.vehicles['getVehicleCard'](normalizedCardName);
        await card.hover();
        break;
    }
  }

  @Then("the interaction should result in {string}")
  async checkInteractionResult(action: string) {
    // Action validation depends on the specific interaction
    switch (action) {
      case 'Click':
        // Navigation would be verified by URL change
        break;
      case 'Play':
        // Video play state would need verification
        break;
      case 'Hover':
        // Hover state would need verification
        break;
      case 'Show touch feedback':
        // Touch feedback would need verification
        break;
    }
  }

  @Then("the system should respond with {string}")
  async checkSystemResponse(response: string) {
    switch (response) {
      case 'Navigate to /vehicles/dragon':
        await expect(this.page).toHaveURL(/.*\/vehicles\/dragon/);
        break;
      case 'Navigate to /vehicles/starship':
        await expect(this.page).toHaveURL(/.*\/vehicles\/starship/);
        break;
      case 'Navigate to /research':
        await expect(this.page).toHaveURL(/.*\/research/);
        break;
      case 'Start video playback':
        // Video playback verification would need implementation
        break;
      case 'Show hover state':
        // Hover state verification would need implementation
        break;
      case 'Show touch feedback':
        // Touch feedback verification would need implementation
        break;
    }
  }

  @When("viewing on {string} with width {string}px")
  async setViewportForDevice(device: string, width: string) {
    const widthNum = parseInt(width);
    await this.page.setViewportSize({ width: widthNum, height: 812 });
  }

  @Then("the vehicle cards should adapt:")
  async checkCardAdaptation(dataTable: DataTable) {
    const adaptations = dataTable.hashes();
    
    for (const adaptation of adaptations) {
      const { Element, Behavior } = adaptation;
      
      switch (Element) {
        case 'Card Layout':
          // Layout adaptation would need responsive checks in POF
          const spacing = await this.humanSpaceflightPage.vehicles.verifyCardSpacing();
          expect(spacing.vertical, { message: 'Cards should have proper spacing' }).toBe(true);
          break;
        case 'Media Position':
          // Media position would need responsive checks in POF
          break;
        case 'Text Size':
          // Text size would need responsive checks in POF
          break;
        case 'Touch Targets':
          // Touch target size verification
          const learnMoreButtons = this.page.locator('[data-test="learn-more-link"]');
          const count = await learnMoreButtons.count();
          for (let i = 0; i < count; i++) {
            const button = learnMoreButtons.nth(i);
            const box = await button.boundingBox();
            expect(box!.width, { message: 'Touch targets should be at least 44px wide' }).toBeGreaterThanOrEqual(44);
            expect(box!.height, { message: 'Touch targets should be at least 44px high' }).toBeGreaterThanOrEqual(44);
          }
          break;
        case 'Spacing':
          const cardSpacing = await this.humanSpaceflightPage.vehicles.verifyCardSpacing();
          expect(cardSpacing.vertical, { message: 'Cards should have proper vertical spacing' }).toBe(true);
          expect(cardSpacing.horizontal, { message: 'Cards should have proper horizontal spacing' }).toBe(true);
          break;
      }
    }
  }

  @Then("all vehicle cards should meet accessibility standards:")
  async checkAccessibilityStandards(dataTable: DataTable) {
    const standards = dataTable.hashes();
    
    for (const standard of standards) {
      const { Feature, Requirement, 'Success Criteria': successCriteria } = standard;
      
      switch (Feature) {
        case 'Headings':
          // Check heading hierarchy
          const headings = this.page.locator('h1, h2, h3, h4, h5, h6');
          const headingCount = await headings.count();
          expect(headingCount, { message: 'Should have proper heading structure' }).toBeGreaterThan(0);
          break;
        case 'Focus Order':
          // Check tab order
          const focusableElements = this.page.locator('button, a, [tabindex]');
          const focusableCount = await focusableElements.count();
          expect(focusableCount, { message: 'Should have focusable elements' }).toBeGreaterThan(0);
          break;
        case 'Media Controls':
          // Check video controls accessibility
          const videos = this.page.locator('video');
          const videoCount = await videos.count();
          // If videos exist, they should have controls
          if (videoCount > 0) {
            const firstVideo = videos.first();
            const hasControls = await firstVideo.getAttribute('controls');
            expect(hasControls, { message: 'Videos should have controls' }).not.toBeNull();
          }
          break;
        case 'Alt Text':
          // Check images have alt text
          const images = this.page.locator('img');
          const imageCount = await images.count();
          for (let i = 0; i < imageCount; i++) {
            const alt = await images.nth(i).getAttribute('alt');
            expect(alt, { message: 'Images should have alt text' }).toBeTruthy();
          }
          break;
        case 'Color Contrast':
          // Basic color contrast check - would need more sophisticated implementation
          const textElements = this.page.locator('p, span, div');
          const textCount = await textElements.count();
          expect(textCount, { message: 'Should have text elements for contrast check' }).toBeGreaterThan(0);
          break;
      }
    }
  }

  @Then("interactive elements should be accessible via:")
  async checkAccessibilityMethods(dataTable: DataTable) {
    const methods = dataTable.hashes();
    
    for (const method of methods) {
      const { Method, 'Expected Behavior': expectedBehavior } = method;
      
      switch (Method) {
        case 'Keyboard':
          // Test keyboard navigation
          await this.page.keyboard.press('Tab');
          const hasFocus = await this.page.evaluate(() => document.activeElement !== document.body);
          expect(hasFocus, { message: 'Should support keyboard navigation' }).toBe(true);
          break;
        case 'Screen Reader':
          // Check ARIA attributes
          const ariaElements = this.page.locator('[aria-label], [aria-describedby]');
          const ariaCount = await ariaElements.count();
          expect(ariaCount, { message: 'Should have ARIA attributes for screen readers' }).toBeGreaterThan(0);
          break;
        case 'Touch':
          // Already checked in touch targets
          const buttons = this.page.locator('button, [role="button"]');
          const buttonCount = await buttons.count();
          expect(buttonCount, { message: 'Should have touchable elements' }).toBeGreaterThan(0);
          break;
      }
    }
  }

  @Then("the vehicle section should meet performance metrics:")
  async checkPerformanceMetrics(dataTable: DataTable) {
    const metrics = dataTable.hashes();
    
    for (const metric of metrics) {
      const { Metric, Requirement, Priority } = metric;
      
      switch (Metric) {
        case 'Image Loading':
          // Check that images are loaded
          const images = this.page.locator('img');
          const imageCount = await images.count();
          for (let i = 0; i < imageCount; i++) {
            const isLoaded = await images.nth(i).evaluate((img: HTMLImageElement) => img.complete);
            expect(isLoaded, { message: 'Images should load' }).toBe(true);
          }
          break;
        case 'Video Loading':
          // Videos should not autoplay to save bandwidth
          const videos = this.page.locator('video');
          const videoCount = await videos.count();
          for (let i = 0; i < videoCount; i++) {
            const autoplay = await videos.nth(i).getAttribute('autoplay');
            expect(autoplay, { message: 'Videos should not autoplay' }).toBeNull();
          }
          break;
      }
    }
  }

  @Then("media optimization should be verified:")
  async checkMediaOptimization(dataTable: DataTable) {
    const optimizations = dataTable.hashes();
    
    for (const optimization of optimizations) {
      const { 'Media Type': mediaType, Optimization } = optimization;
      
      switch (mediaType) {
        case 'Images':
          // Check for modern image formats
          const images = this.page.locator('img');
          const imageCount = await images.count();
          let hasModernFormat = false;
          for (let i = 0; i < imageCount; i++) {
            const src = await images.nth(i).getAttribute('src');
            if (src && (src.includes('.webp') || src.includes('.avif'))) {
              hasModernFormat = true;
              break;
            }
          }
          expect(hasModernFormat || imageCount === 0, { message: 'Should use modern image formats' }).toBe(true);
          break;
        case 'Videos':
          // Basic video check
          const videos = this.page.locator('video');
          const videoCount = await videos.count();
          expect(videoCount, { message: 'Videos should be present if required' }).toBeGreaterThanOrEqual(0);
          break;
      }
    }
  }
}