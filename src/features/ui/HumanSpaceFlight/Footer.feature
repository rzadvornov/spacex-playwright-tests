@footer
Feature: SpaceX Human Spaceflight Footer
  As a website visitor
  I want to access additional SpaceX resources and information
  So that I can learn more about the company and connect on social media

  Background:
    Given I am on the SpaceX Human Spaceflight homepage
    And I view the footer

  @smoke @content
  Scenario: Footer displays required content elements
    Then I should see the following footer links:
      | Link Text      | Expected URL Pattern |
      | Careers        | /careers             |
      | Updates        | /updates             |
      | Privacy Policy | privacy-policy.pdf   |
      | Suppliers      | /supplier            |
    And I should see a social media section with Twitter/X button
    And the footer should display the copyright text including the current year

  @navigation
  Scenario Outline: Footer navigation links functionality
    When I click the "<Link>" link
    Then I should be navigated to the appropriate page
    And the URL should contain "<URL Pattern>"
    And the page should load successfully

    Examples:
      | Link      | URL Pattern |
      | Careers   | /careers    |
      | Updates   | /updates    |
      | Suppliers | /supplier   |

  @navigation @external
  Scenario Outline: Footer external links functionality
    When I click on the "<Link>" link
    Then a new tab should open
    And the content should load successfully

    Examples:
      | Link           | Content Type |
      | Privacy Policy | PDF document |
      | Twitter/X      | Social media |

  @styling @layout
  Scenario: Footer layout and styling verification
    Then the footer should have the following layout:
      | Element          | Position | Alignment |
      | Social Media     | Left     | Left      |
      | Navigation Links | Center   | Center    |
      | Copyright Text   | Right    | Right     |
    And there should be proper spacing between elements:
      | Spacing Type | Requirement           |
      | Horizontal   | Even between elements |
      | Vertical     | Consistent padding    |
      | Overall      | No cramped appearance |

  @interaction @desktop
  Scenario Outline: Footer interactive elements behavior
    When I hover over the "<Element>"
    Then it should show a hover effect
    And the cursor should change to pointer
    When I move away from the "<Element>"
    Then the hover effect should disappear

    Examples:
      | Element        |
      | Careers link   |
      | Updates link   |
      | Twitter/X icon |

  @styling @visual
  Scenario: Footer visual elements styling
    Then the Twitter/X social media button should have:
      | Style Element | Requirement          |
      | Background    | Rounded shape        |
      | Icon          | Visible and centered |
      | Design        | Consistent with page |
    And all navigation links should have consistent styling
    And the copyright text should be properly formatted