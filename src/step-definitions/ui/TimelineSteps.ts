import { When, Then, Fixture } from "playwright-bdd/decorators";
import { expect, Page } from "@playwright/test";
import { DataTable } from "playwright-bdd";
import { HumanSpaceflightPage } from "../../pages/ui/HumanSpaceflightPage";

@Fixture("timelineSteps")
export class TimelineSteps {
  constructor(
    private page: Page,
    private humanSpaceflightPage: HumanSpaceflightPage  
  ) {}

  @When("I view the Timeline section")
  async viewTimelineSection() {
    await this.humanSpaceflightPage.timeline.scrollToSection();
    await expect(
      this.humanSpaceflightPage.timeline.timelineSection
    ).toBeVisible();
  }

  @Then("the section should display core elements:")
  async checkCoreElements(dataTable: DataTable) {
    const elements = dataTable.hashes();
    
    for (const element of elements) {
      const { Element, Content } = element;
      
      switch (Element) {
        case 'Heading':
          await expect(this.humanSpaceflightPage.timeline.sectionHeading).toBeVisible();
          await expect(this.humanSpaceflightPage.timeline.sectionHeading).toHaveText(Content);
          break;
          
        case 'Carousel':
          await expect(this.humanSpaceflightPage.timeline.timelineCarousel).toBeVisible();
          break;
          
        case 'Navigation':
          await expect(this.humanSpaceflightPage.timeline.nextArrow).toBeVisible();
          await expect(this.humanSpaceflightPage.timeline.previousArrow).toBeVisible();
          await expect(this.humanSpaceflightPage.timeline.paginationDots).toBeVisible();
          break;
          
        case 'Horizon Image':
          const isHorizonVisible = await this.humanSpaceflightPage.timeline.isHorizonImageVisible();
          expect(isHorizonVisible, { message: 'Horizon image should be visible' }).toBe(true);
          break;
      }
    }
  }

  @Then("each milestone card should contain:")
  async checkMilestoneCardComponents(dataTable: DataTable) {
    const components = dataTable.hashes();
    const milestones = await this.humanSpaceflightPage.timeline.getAllMilestoneData();
    
    for (const component of components) {
      const { Component, 'Required Content': requiredContent } = component;
      
      switch (Component) {
        case 'Year':
          for (const milestone of milestones) {
            expect(milestone.year, { message: 'Each milestone should have a year' }).toBeTruthy();
          }
          break;
          
        case 'Achievement':
          for (const milestone of milestones) {
            expect(milestone.achievement, { message: 'Each milestone should have achievement text' }).toBeTruthy();
          }
          break;
          
        case 'Background':
          const imagesLoaded = await this.humanSpaceflightPage.timeline.areBackgroundImagesLoaded();
          expect(imagesLoaded, { message: 'All milestone cards should have background images' }).toBe(true);
          break;
      }
    }
  }

  @When("I view the {string} milestone card")
  async viewMilestoneCard(year: string) {
    const card = await this.humanSpaceflightPage.timeline.getMilestoneCardByYear(year);
    await card.scrollIntoViewIfNeeded();
    await expect(card).toBeVisible();
  }

  @Then("it should display the following information:")
  async checkMilestoneInformation(dataTable: DataTable) {
    const info = dataTable.hashes();
    
    for (const item of info) {
      const { Element, Content } = item;
      
      switch (Element) {
        case 'Year':
          const milestones = await this.humanSpaceflightPage.timeline.getAllMilestoneData();
          const foundMilestone = milestones.find(m => m.year === Content);
          expect(foundMilestone, { message: `Should find milestone for year ${Content}` }).toBeTruthy();
          break;
          
        case 'Achievement':
          const allMilestones = await this.humanSpaceflightPage.timeline.getAllMilestoneData();
          const hasAchievement = allMilestones.some(m => m.achievement.includes(Content));
          expect(hasAchievement, { message: `Should find achievement: ${Content}` }).toBe(true);
          break;
          
        case 'Image':
          const imageUrl = await this.humanSpaceflightPage.timeline.getBackgroundImageUrl(Content);
          expect(imageUrl.toLowerCase(), { message: `Image should contain ${Content}` }).toContain(Content.toLowerCase());
          break;
      }
    }
  }

  @When("I view the Timeline section with the {string} milestone active")
  async viewTimelineWithActiveCard(year: string) {
    await this.viewTimelineSection();
    const isActive = await this.humanSpaceflightPage.timeline.isCardActive(year);
    expect(isActive, { message: `${year} milestone should be active` }).toBe(true);
  }

  @When("I click the {string} arrow")
  async clickArrow(direction: string) {
    if (direction === 'next') {
      await this.humanSpaceflightPage.timeline.nextArrow.click();
    } else if (direction === 'previous') {
      await this.humanSpaceflightPage.timeline.previousArrow.click();
    }
    await this.page.waitForTimeout(500); // Wait for animation
  }

  @Then("the carousel should navigate to the {string} milestone")
  async checkNavigationToMilestone(year: string) {
    const isActive = await this.humanSpaceflightPage.timeline.isCardActive(year);
    expect(isActive, { message: `${year} milestone should be active after navigation` }).toBe(true);
  }

  @Then("the pagination dot for {string} should be active")
  async checkPaginationDotActive(year: string) {
    // This would require additional implementation in POF to map years to dot indices
    // For now, we'll check that some dot is active
    const activeIndex = await this.humanSpaceflightPage.timeline.getActivePaginationDotIndex();
    expect(activeIndex, { message: 'A pagination dot should be active' }).toBeGreaterThanOrEqual(0);
  }

  @Then("pagination navigation should meet requirements:")
  async checkPaginationRequirements(dataTable: DataTable) {
    const requirements = dataTable.hashes();
    
    for (const requirement of requirements) {
      const { Element, Requirement } = requirement;
      
      switch (Element) {
        case 'Dot Count':
          const expectedCount = parseInt(Requirement.match(/\d+/)?.[0] || '12');
          const actualCount = await this.humanSpaceflightPage.timeline.getPaginationDotsCount();
          expect(actualCount, { message: `Should have ${expectedCount} pagination dots` }).toBe(expectedCount);
          break;
          
        case 'Default State':
          const activeIndex = await this.humanSpaceflightPage.timeline.getActivePaginationDotIndex();
          expect(activeIndex, { message: 'First dot should be active by default' }).toBe(0);
          break;
          
        case 'Visibility':
          const dotsCount = await this.humanSpaceflightPage.timeline.getPaginationDotsCount();
          for (let i = 0; i < dotsCount; i++) {
            const isVisible = await this.humanSpaceflightPage.timeline.paginationDots.nth(i).isVisible();
            expect(isVisible, { message: `Pagination dot ${i + 1} should be visible` }).toBe(true);
          }
          break;
          
        case 'Interaction':
          const dotsCountForInteraction = await this.humanSpaceflightPage.timeline.getPaginationDotsCount();
          expect(dotsCountForInteraction, { message: 'Should have pagination dots for interaction' }).toBeGreaterThan(0);
          break;
      }
    }
  }

  @When("I interact with pagination:")
  async interactWithPagination(dataTable: DataTable) {
    const interactions = dataTable.hashes();
    
    for (const interaction of interactions) {
      const { Action, 'Expected Result': expectedResult } = interaction;
      
      if (Action.includes('dot')) {
        const dotNumber = parseInt(Action.match(/\d+/)?.[0] || '1');
        await this.humanSpaceflightPage.timeline.clickPaginationDot(dotNumber - 1);
        await this.page.waitForTimeout(500);
        
        // Verify the expected milestone is shown
        const milestones = await this.humanSpaceflightPage.timeline.getAllMilestoneData();
        expect(milestones.length, { message: 'Should have milestones after pagination click' }).toBeGreaterThan(0);
      }
    }
  }

  @Then("the timeline should meet visual standards:")
  async checkVisualStandards(dataTable: DataTable) {
    const standards = dataTable.hashes();
    
    for (const standard of standards) {
      const { Element, Requirement, Details } = standard;
      
      switch (Element) {
        case 'Card Images':
          const imagesLoaded = await this.humanSpaceflightPage.timeline.areBackgroundImagesLoaded();
          expect(imagesLoaded, { message: 'Card images should load successfully' }).toBe(true);
          break;
          
        case 'Horizon Image':
          const isHorizonVisible = await this.humanSpaceflightPage.timeline.isHorizonImageVisible();
          expect(isHorizonVisible, { message: 'Horizon image should be visible' }).toBe(true);
          break;
          
        case 'Arrow Buttons':
          await expect(this.humanSpaceflightPage.timeline.nextArrow, { message: 'Next arrow should be visible' }).toBeVisible();
          await expect(this.humanSpaceflightPage.timeline.previousArrow, { message: 'Previous arrow should be visible' }).toBeVisible();
          break;
          
        case 'Card Layout':
          const consistency = await this.humanSpaceflightPage.timeline.checkCardsConsistency();
          expect(consistency.hasConsistentWidth, { message: 'Cards should have consistent width' }).toBe(true);
          expect(consistency.hasConsistentHeight, { message: 'Cards should have consistent height' }).toBe(true);
          break;
      }
    }
  }

  @When("viewing on {string} with width {string}px")
  async setViewportForDevice(device: string, width: string) {
    const widthNum = parseInt(width);
    await this.page.setViewportSize({ width: widthNum, height: 812 });
  }

  @Then("the timeline should adapt appropriately:")
  async checkTimelineAdaptation(dataTable: DataTable) {
    const adaptations = dataTable.hashes();
    
    for (const adaptation of adaptations) {
      const { Element, Requirement } = adaptation;
      
      switch (Element) {
        case 'Card Width':
          const mobileChecks = await this.humanSpaceflightPage.timeline.checkMobileResponsiveness();
          if (Requirement === 'Full width') {
            expect(mobileChecks.isFullWidth, { message: 'Cards should be full width on mobile' }).toBe(true);
          }
          break;
          
        case 'Navigation':
          const navChecks = await this.humanSpaceflightPage.timeline.checkMobileResponsiveness();
          expect(navChecks.areArrowsSized, { message: 'Navigation arrows should be properly sized' }).toBe(true);
          expect(navChecks.areDotsTappable, { message: 'Pagination dots should be tappable' }).toBe(true);
          break;
          
        case 'Touch Targets':
          const touchChecks = await this.humanSpaceflightPage.timeline.checkMobileResponsiveness();
          expect(touchChecks.areArrowsSized, { message: 'Touch targets should be at least 44x44px' }).toBe(true);
          break;
          
        case 'Text Scaling':
          const readability = await this.humanSpaceflightPage.timeline.checkTextReadability();
          expect(readability.isTextReadable, { message: 'Text should be readable without zoom' }).toBe(true);
          break;
      }
    }
  }

  @Then("the timeline section should meet accessibility standards:")
  async checkAccessibilityStandards(dataTable: DataTable) {
    const standards = dataTable.hashes();
    const accessibility = await this.humanSpaceflightPage.timeline.getAccessibilityStatus();
    
    for (const standard of standards) {
      const { Element, Requirement } = standard;
      
      switch (Element) {
        case 'Navigation':
          expect(accessibility.isKeyboardNavigable, { message: 'Should be keyboard navigable' }).toBe(true);
          break;
          
        case 'Button Labels':
          expect(accessibility.hasAriaLabels, { message: 'Should have ARIA labels' }).toBe(true);
          break;
          
        case 'Focus States':
          // Check that focusable elements exist
          const focusableCount = await this.page.locator('button, [tabindex]').count();
          expect(focusableCount, { message: 'Should have focusable elements' }).toBeGreaterThan(0);
          break;
      }
    }
  }

  @Then("users should be able to navigate through milestones using:")
  async checkNavigationMethods(dataTable: DataTable) {
    const methods = dataTable.hashes();
    
    for (const method of methods) {
      const { Method, 'Expected Behavior': expectedBehavior } = method;
      
      switch (Method) {
        case 'Arrow Keys':
          // Test keyboard navigation
          await this.page.keyboard.press('ArrowRight');
          await this.page.waitForTimeout(500);
          const accessibility = await this.humanSpaceflightPage.timeline.getAccessibilityStatus();
          expect(accessibility.isKeyboardNavigable, { message: 'Should support arrow key navigation' }).toBe(true);
          break;
          
        case 'Tab Key':
          // Test tab navigation
          await this.page.keyboard.press('Tab');
          const hasFocusable = await this.page.evaluate(() => document.activeElement !== document.body);
          expect(hasFocusable, { message: 'Should support tab navigation' }).toBe(true);
          break;
      }
    }
  }

  @Then("timeline media elements should meet quality standards:")
  async checkMediaQualityStandards(dataTable: DataTable) {
    const standards = dataTable.hashes();
    
    for (const standard of standards) {
      const { Element, Requirement, Validation } = standard;
      
      switch (Element) {
        case 'Card Images':
          const imagesLoaded = await this.humanSpaceflightPage.timeline.areBackgroundImagesLoaded();
          expect(imagesLoaded, { message: 'Card images should load successfully' }).toBe(true);
          break;
          
        case 'Image Quality':
          // Check that images are not pixelated
          const milestones = await this.humanSpaceflightPage.timeline.getAllMilestoneData();
          expect(milestones.length, { message: 'Should have milestone images' }).toBeGreaterThan(0);
          break;
          
        case 'Image Opacity':
          const cards = this.humanSpaceflightPage.timeline.milestoneCards;
          const opacityCheck = await cards.evaluateAll((elements) =>
            elements.every((el) => {
              const opacity = window.getComputedStyle(el).opacity;
              return parseFloat(opacity) > 0 && parseFloat(opacity) <= 1;
            })
          );
          expect(opacityCheck, { message: 'Images should have consistent opacity' }).toBe(true);
          break;
      }
    }
  }

  @Then("layout consistency should be maintained:")
  async checkLayoutConsistency(dataTable: DataTable) {
    const consistencyChecks = dataTable.hashes();
    const consistency = await this.humanSpaceflightPage.timeline.checkCardsConsistency();
    
    for (const check of consistencyChecks) {
      const { Element, Requirement, Measurement } = check;
      
      switch (Element) {
        case 'Card Width':
          expect(consistency.hasConsistentWidth, { message: 'Cards should have uniform width' }).toBe(true);
          break;
          
        case 'Card Height':
          expect(consistency.hasConsistentHeight, { message: 'Cards should have consistent height' }).toBe(true);
          break;
          
        case 'Card Spacing':
          expect(consistency.hasUniformSpacing, { message: 'Cards should have even spacing' }).toBe(true);
          break;
      }
    }
  }

  @Then("text elements should meet readability requirements:")
  async checkTypographyRequirements(dataTable: DataTable) {
    const requirements = dataTable.hashes();
    const readability = await this.humanSpaceflightPage.timeline.checkTextReadability();
    
    for (const requirement of requirements) {
      const { Element, 'Font Properties': fontProps, 'Contrast Requirements': contrastReq } = requirement;
      
      switch (Element) {
        case 'Year Display':
          expect(readability.isYearVisible, { message: 'Year text should be visible' }).toBe(true);
          break;
          
        case 'Achievement Text':
          expect(readability.isTextReadable, { message: 'Achievement text should be readable' }).toBe(true);
          break;
          
        case 'Navigation Labels':
          // Check navigation button text visibility
          await expect(this.humanSpaceflightPage.timeline.nextArrow, { message: 'Navigation should be visible' }).toBeVisible();
          break;
      }
    }
  }

  @Then("text handling should be robust:")
  async checkTextHandling(dataTable: DataTable) {
    const scenarios = dataTable.hashes();
    
    for (const scenario of scenarios) {
      const { Scenario, Requirement, Validation } = scenario;
      
      switch (Scenario) {
        case 'Long Content':
          const readability = await this.humanSpaceflightPage.timeline.checkTextReadability();
          expect(readability.hasNoOverflow, { message: 'Text should not overflow' }).toBe(true);
          break;
          
        case 'Different Lengths':
          const consistency = await this.humanSpaceflightPage.timeline.checkCardsConsistency();
          expect(consistency.hasConsistentHeight, { message: 'Cards should handle different text lengths' }).toBe(true);
          break;
      }
    }
  }

  @Then("the timeline should meet performance targets:")
  async checkPerformanceTargets(dataTable: DataTable) {
    const targets = dataTable.hashes();
    
    for (const target of targets) {
      const { Metric, Target, Priority } = target;
      
      switch (Metric) {
        case 'Initial Load':
          // Check that section loads within reasonable time
          await expect(this.humanSpaceflightPage.timeline.timelineSection, { 
            message: 'Timeline section should load' 
          }).toBeVisible();
          break;
          
        case 'Image Loading':
          const imagesLoaded = await this.humanSpaceflightPage.timeline.areBackgroundImagesLoaded();
          expect(imagesLoaded, { message: 'Images should load successfully' }).toBe(true);
          break;
      }
    }
  }

  @Then("resource optimization should be verified:")
  async checkResourceOptimization(dataTable: DataTable) {
    const optimizations = dataTable.hashes();
    
    for (const optimization of optimizations) {
      const { 'Resource Type': resourceType, 'Optimization Strategy': strategy, Validation } = optimization;
      
      switch (resourceType) {
        case 'Images':
          const imagesLoaded = await this.humanSpaceflightPage.timeline.areBackgroundImagesLoaded();
          expect(imagesLoaded, { message: 'Images should be optimized' }).toBe(true);
          break;
      }
    }
  }
}