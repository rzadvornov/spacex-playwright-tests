import { Given, When, Then, Fixture } from "playwright-bdd/decorators";
import { expect, Page } from "@playwright/test";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../pages/ui/HumanSpaceflightPage";
import { BddFixtures } from "../../fixtures/BddFixtures";

@Fixture("theSuitesSteps")
export class TheSuitesSteps {
  constructor(
    private page: Page,
    private humanSpaceflightPage: HumanSpaceflightPage,
    private sharedContext: BddFixtures["sharedContext"]
  ) {}

  @Given("I view the Suits section")
  async viewSuitsSection() {
    await this.humanSpaceflightPage.theSuites.scrollToSection();
    await expect(
      this.humanSpaceflightPage.theSuites.suitsSection
    ).toBeVisible();
  }

  @Then("the section should display core elements:")
  async checkCoreElements(dataTable: DataTable) {
    const elements = dataTable.hashes();
    
    for (const element of elements) {
      const { Element, Content, State } = element;
      
      switch (Element) {
        case 'Heading':
          await expect(this.humanSpaceflightPage.theSuites.suitHeading).toBeVisible();
          await expect(this.humanSpaceflightPage.theSuites.suitHeading).toHaveText(Content);
          break;
          
        case 'IVA Button':
          await expect(this.humanSpaceflightPage.theSuites.ivaButton).toBeVisible();
          await expect(this.humanSpaceflightPage.theSuites.ivaButton).toHaveText(Content);
          if (State === 'Active by default') {
            await expect(this.humanSpaceflightPage.theSuites.ivaButton).toHaveClass(/active/);
          }
          break;
          
        case 'EVA Button':
          await expect(this.humanSpaceflightPage.theSuites.evaButton).toBeVisible();
          await expect(this.humanSpaceflightPage.theSuites.evaButton).toHaveText(Content);
          if (State === 'Inactive') {
            await expect(this.humanSpaceflightPage.theSuites.evaButton).not.toHaveClass(/active/);
          }
          break;
          
        case 'Suit Image':
          await expect(this.humanSpaceflightPage.theSuites.suitImage).toBeVisible();
          if (State === 'Centered') {
            const isCentered = await this.humanSpaceflightPage.theSuites.isSuitImageCentered();
            expect(isCentered).toBe(true);
          }
          break;
          
        case 'Hotspots':
          if (State === 'Visible') {
            const areVisible = await this.humanSpaceflightPage.theSuites.areHotspotsVisible();
            expect(areVisible).toBe(true);
          }
          break;
          
        case 'Background':
          if (State === 'Visible') {
            const isVisible = await this.humanSpaceflightPage.theSuites.isGradientVisible();
            expect(isVisible).toBe(true);
          }
          break;
      }
    }
  }

  @Given("I view the Suits section with the {string} suit displayed")
  async viewSuitType(suitType: string) {
    await this.viewSuitsSection();
    
    if (suitType === 'IVA') {
      await expect(this.humanSpaceflightPage.theSuites.ivaButton).toHaveClass(/active/);
    } else if (suitType === 'EVA') {
      // If EVA is not active, click it
      if (!(await this.humanSpaceflightPage.theSuites.evaButton.getAttribute('class'))?.includes('active')) {
        await this.humanSpaceflightPage.theSuites.evaButton.click();
      }
      await expect(this.humanSpaceflightPage.theSuites.evaButton).toHaveClass(/active/);
    }
  }

  @When("I click on the {string} button")
  async clickSuitButton(buttonName: string) {
    if (buttonName === 'IVA') {
      await this.humanSpaceflightPage.theSuites.ivaButton.click();
    } else if (buttonName === 'EVA') {
      await this.humanSpaceflightPage.theSuites.evaButton.click();
    }
  }

  @Then("the following state changes should occur:")
  async checkStateChanges(dataTable: DataTable) {
    const changes = dataTable.hashes();
    
    for (const change of changes) {
      const { 'Element': element, 'State Change': stateChange } = change;
      
      switch (element) {
        case 'IVA Button':
          if (stateChange === 'Becomes active') {
            await expect(this.humanSpaceflightPage.theSuites.ivaButton).toHaveClass(/active/);
          } else if (stateChange === 'Becomes inactive') {
            await expect(this.humanSpaceflightPage.theSuites.ivaButton).not.toHaveClass(/active/);
          }
          break;
          
        case 'EVA Button':
          if (stateChange === 'Becomes active') {
            await expect(this.humanSpaceflightPage.theSuites.evaButton).toHaveClass(/active/);
          } else if (stateChange === 'Becomes inactive') {
            await expect(this.humanSpaceflightPage.theSuites.evaButton).not.toHaveClass(/active/);
          }
          break;
          
        case 'Suit Image':
          if (stateChange.includes('Changes to')) {
            const suitType = stateChange.replace('Changes to ', '').replace(' suit', '');
            // Wait for animation and check if image has updated
            await this.page.waitForTimeout(500);
            const isLoaded = await this.humanSpaceflightPage.theSuites.isSuitImageLoaded();
            expect(isLoaded).toBe(true);
          }
          break;
          
        case 'Hotspots':
          if (stateChange === 'Update for new suit type') {
            // Verify hotspots are still visible and functional
            const areVisible = await this.humanSpaceflightPage.theSuites.areHotspotsVisible();
            expect(areVisible).toBe(true);
          }
          break;
      }
    }
  }

  @Then("hotspots should be configured properly:")
  async checkHotspotConfiguration(dataTable: DataTable) {
    const requirements = dataTable.hashes();
    
    for (const requirement of requirements) {
      const { Requirement, Specification } = requirement;
      
      switch (Requirement) {
        case 'Quantity':
          const minCount = parseInt(Specification.match(/\d+/)?.[0] || '6');
          const count = await this.humanSpaceflightPage.theSuites.getHotspotCount();
          expect(count, { message: `Should have at least ${minCount} hotspots` }).toBeGreaterThanOrEqual(minCount);
          break;
          
        case 'Distribution':
          const distribution = await this.humanSpaceflightPage.theSuites.getHotspotDistribution();
          expect(distribution.upper, { message: 'Should have upper body hotspots' }).toBeGreaterThan(0);
          expect(distribution.lower, { message: 'Should have lower body hotspots' }).toBeGreaterThan(0);
          break;
          
        case 'Upper Body':
          const upperCount = parseInt(Specification.match(/\d+/)?.[0] || '2');
          const upperDistribution = await this.humanSpaceflightPage.theSuites.getHotspotDistribution();
          expect(upperDistribution.upper, { message: 'Should have multiple upper body hotspots' }).toBeGreaterThanOrEqual(upperCount);
          break;
          
        case 'Lower Body':
          const lowerCount = parseInt(Specification.match(/\d+/)?.[0] || '2');
          const lowerDistribution = await this.humanSpaceflightPage.theSuites.getHotspotDistribution();
          expect(lowerDistribution.lower, { message: 'Should have multiple lower body hotspots' }).toBeGreaterThanOrEqual(lowerCount);
          break;
      }
    }
  }

  @When("I interact with hotspots:")
  async interactWithHotspots(dataTable: DataTable) {
    const interactions = dataTable.hashes();
    
    for (const interaction of interactions) {
      const { Action, 'Expected Result': expectedResult } = interaction;
      
      switch (Action) {
        case 'Hover':
          await this.humanSpaceflightPage.theSuites.hoverHotspot(0);
          if (expectedResult.includes('after delay')) {
            await this.page.waitForTimeout(300); // Wait for callout delay
          }
          await expect(this.humanSpaceflightPage.theSuites.suitCallout, { 
            message: 'Callout should appear on hover' 
          }).toBeVisible();
          break;
          
        case 'Move Away':
          // First hover to show callout, then move away
          await this.humanSpaceflightPage.theSuites.hoverHotspot(0);
          await this.page.waitForTimeout(200);
          await this.humanSpaceflightPage.theSuites.suitsSection.hover({ position: { x: 0, y: 0 } });
          await expect(this.humanSpaceflightPage.theSuites.suitCallout, {
            message: 'Callout should disappear when moving away'
          }).not.toBeVisible();
          break;
          
        case 'Multiple Hover':
          const count = await this.humanSpaceflightPage.theSuites.getHotspotCount();
          const texts: string[] = [];
          
          for (let i = 0; i < Math.min(count, 3); i++) { // Test first 3 hotspots
            await this.humanSpaceflightPage.theSuites.hoverHotspot(i);
            await this.page.waitForTimeout(200);
            const text = await this.humanSpaceflightPage.theSuites.getCalloutText();
            texts.push(text);
          }
          
          const uniqueTexts = new Set(texts);
          expect(uniqueTexts.size, { 
            message: 'Each hotspot should show unique information' 
          }).toBe(texts.length);
          break;
      }
    }
  }

  @Then("the suit display should meet visual standards:")
  async checkVisualStandards(dataTable: DataTable) {
    const standards = dataTable.hashes();
    
    for (const standard of standards) {
      const { Element, Requirement, Details } = standard;
      
      switch (Element) {
        case 'Suit Image':
          if (Requirement === 'Properly loaded') {
            const isLoaded = await this.humanSpaceflightPage.theSuites.isSuitImageLoaded();
            expect(isLoaded, { message: 'Suit image should load properly' }).toBe(true);
          }
          break;
          
        case 'Image Position':
          if (Requirement === 'Centered in viewport') {
            const isCentered = await this.humanSpaceflightPage.theSuites.isSuitImageCentered();
            expect(isCentered, { message: 'Suit image should be centered' }).toBe(true);
          }
          break;
          
        case 'Background':
          if (Requirement === 'Gradient effect') {
            const isVisible = await this.humanSpaceflightPage.theSuites.isGradientVisible();
            expect(isVisible, { message: 'Background gradient should be visible' }).toBe(true);
            const enhancesVisibility = await this.humanSpaceflightPage.theSuites.isGradientEnhancingSuitVisibility();
            expect(enhancesVisibility, { message: 'Gradient should enhance visibility' }).toBe(true);
          }
          break;
          
        case 'Hotspot Markers':
          if (Requirement === 'Clearly visible') {
            const areVisible = await this.humanSpaceflightPage.theSuites.areHotspotsVisible();
            expect(areVisible, { message: 'Hotspot markers should be visible' }).toBe(true);
          }
          break;
          
        case 'Callouts':
          if (Requirement === 'Position adapts') {
            const count = await this.humanSpaceflightPage.theSuites.getHotspotCount();
            for (let i = 0; i < Math.min(count, 3); i++) {
              const isPositioned = await this.humanSpaceflightPage.theSuites.isCalloutPositionedCorrectly(i);
              expect(isPositioned, { message: `Callout should adapt position for hotspot ${i + 1}` }).toBe(true);
            }
          }
          break;
      }
    }
  }

  @Then("each suit type should display complete information:")
  async checkSuitInformation(dataTable: DataTable) {
    const suitInfo = dataTable.hashes();
    
    for (const suit of suitInfo) {
      const { 'Suit Type': suitType, 'Required Information': requiredInfo } = suit;
      
      // Switch to the suit type if not already active
      if (suitType === 'EVA') {
        await this.humanSpaceflightPage.theSuites.evaButton.click();
        await expect(this.humanSpaceflightPage.theSuites.evaButton).toHaveClass(/active/);
      } else {
        await this.humanSpaceflightPage.theSuites.ivaButton.click();
        await expect(this.humanSpaceflightPage.theSuites.ivaButton).toHaveClass(/active/);
      }
      
      // Verify suit image is loaded and hotspots provide information
      const isLoaded = await this.humanSpaceflightPage.theSuites.isSuitImageLoaded();
      expect(isLoaded, { message: `${suitType} suit image should load` }).toBe(true);
      
      const hotspotCount = await this.humanSpaceflightPage.theSuites.getHotspotCount();
      expect(hotspotCount, { message: `${suitType} suit should have hotspots` }).toBeGreaterThan(0);
    }
  }

  @Then("each hotspot should provide:")
  async checkHotspotContent(dataTable: DataTable) {
    const contentTypes = dataTable.hashes();
    const count = await this.humanSpaceflightPage.theSuites.getHotspotCount();
    
    // Test a sample of hotspots
    for (let i = 0; i < Math.min(count, 3); i++) {
      await this.humanSpaceflightPage.theSuites.hoverHotspot(i);
      await this.page.waitForTimeout(200);
      const calloutText = await this.humanSpaceflightPage.theSuites.getCalloutText();
      
      for (const contentType of contentTypes) {
        const { 'Content Type': type, Requirement } = contentType;
        
        switch (type) {
          case 'Component':
            expect(calloutText.length, { message: 'Should have component description' }).toBeGreaterThan(0);
            break;
          case 'Function':
            expect(calloutText.length, { message: 'Should have function explanation' }).toBeGreaterThan(0);
            break;
          case 'Technical':
            expect(calloutText.length, { message: 'Should have technical specifications' }).toBeGreaterThan(0);
            break;
        }
      }
    }
    
    // Verify uniqueness across hotspots
    const allTexts = await this.humanSpaceflightPage.theSuites.getAllHotspotTexts();
    const uniqueTexts = new Set(allTexts);
    expect(uniqueTexts.size, { message: 'Each hotspot should have unique information' }).toBe(allTexts.length);
  }
}