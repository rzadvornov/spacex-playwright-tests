Feature: SpaceX Homepage
  As a website visitor
  I want to view the SpaceX homepage
  So that I can learn about SpaceX missions

  Scenario: Homepage loads successfully and validates core content
    Given I am on the SpaceX homepage
    Then the page should load within 5 seconds
    And the page title should be "SpaceX"
    And the main header navigation menu (desktop view) should be visible
    And the page should match the snapshot "homepage_initial_load"

  Scenario: Navigation menu is functional
    Given I am on the SpaceX homepage
    Then I should see the main navigation links:
      | link_text         |
      | Vehicles          |
      | Launches          |
      | Human Spaceflight |
      | Rideshare         |
      | Starlink          |
      | Starshield        |
      | Company           |
      | Shop              |
    And clicking a main navigation link should navigate to the correct URL

  Scenario: Homepage meets performance metrics
    Given I am on the SpaceX homepage
    Then the Largest Contentful Paint should be less than 4000 ms
    And the First Input Delay should be less than 100 ms

  Scenario: SEO and Social Metadata are correctly set
    Given I am on the SpaceX homepage
    Then the viewport meta tag should be configured for responsiveness
    And the page description meta tag should contain the text "SpaceX designs, manufactures and launches advanced rockets and spacecraft."
    And the Open Graph title should be "SpaceX"
   # And the Open Graph image link should load successfully

  Scenario: Footer content and external links are correct
    Given I am on the SpaceX homepage
    Then the following footer links should be visible:
      | Link Text      |
      | Careers        |
      | Updates        |
      | Suppliers      |
      | Privacy Policy |
    And the social media links (e.g., Twitter/X) should be present and functional
    And the "Social" section in the footer should be visible at the bottom of the page