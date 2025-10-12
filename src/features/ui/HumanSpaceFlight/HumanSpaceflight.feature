@humanSpaceflight
Feature: SpaceX Human Spaceflight Page Load and Navigation
  As a website visitor
  I want the Human Spaceflight page to load correctly
  So that I can access SpaceX's human spaceflight information

  Background:
    Given I am on the SpaceX Human Spaceflight page

  @smoke @core
  Scenario: Page loads with essential content and elements
    Then the page should load with the following requirements:
      | Element    | Requirement       | Value                      |
      | Load Time  | Maximum load time | 5 seconds                  |
      | Page Title | Browser title     | SpaceX - Human Spaceflight |
      | Hero Title | Main heading      | Human Spaceflight          |
      | Subtitle   | Secondary text    | Making Life Multiplanetary |
    And the page should match the snapshot "spaceflight_initial_load"

  @navigation @desktop
  Scenario: Main navigation functionality
    Then the header navigation should contain:
      | Link Text         | URL Pattern        | Description        |
      | Vehicles          | /vehicles          | Spacecraft section |
      | Launches          | /launches          | Mission launches   |
      | Human Spaceflight | /human-spaceflight | Current section    |
      | Rideshare         | /rideshare         | Rideshare program  |
      | Starlink          | /starlink          | Internet service   |
      | Starshield        | /starshield        | Defense platform   |
      | Company           | /about             | Company info       |
      | Shop              | /shop              | Merchandise store  |
    And the SpaceX logo should be visible and clickable
    And the upcoming launches widget should be displayed

  @navigation
  Scenario Outline: Navigation links direct to correct pages
    When I click on the "<Link>" navigation link
    Then I should be navigated to the correct page
    And the URL should contain "<URL Pattern>"
    And the page should load successfully

    Examples:
      | Link      | URL Pattern |
      | Launches  | /launches   |
      | Rideshare | /rideshare  |
      | Shop      | /shop       |

  @navigation @mobile
Scenario: Mobile navigation functionality
  When I am on the SpaceX Human Spaceflight page viewed on mobile
  Then I should see the header with the following elements:
    | Element   | Verification    |
    | Logo      | Visible         |
    | Hamburger | Button visible  |
  When I click hamburger
  Then Menu expands
  When I click close
  Then Menu collapses
  And after the actions are performed:
    | Action          | Verification          |
    | Click hamburger | Menu expands          |
    | View menu items | All links visible     | 
    | Click close     | Menu collapses        |
  Then the mobile navigation should be fully functional

  @navigation @interaction
  Scenario: Hero section interaction elements
    When I see the scroll-down arrow animation
    And I click on the arrow
    Then the page should smoothly scroll to the Media Carousel section

  @performance @quality
  Scenario: Page performance and quality metrics
    Then the page should meet the following metrics:
      | Metric                   | Requirement   |
      | Largest Contentful Paint | < 4000 ms     |
      | First Input Delay        | < 100 ms      |
      | Console Errors           | None          |
      | Image Loading            | No 404 errors |

  @seo @metadata
  Scenario: SEO and metadata configuration
    Then the page should have the following metadata:
      | Element     | Content                                                                   |
      | Viewport    | Responsive configuration                                                  |
      | Description | SpaceX designs, manufactures and launches advanced rockets and spacecraft |
      | Keywords    | space, spacex, human spaceflight, dragon, starship                        |
      | Open Graph  | Title: SpaceX                                                             |
    And all metadata should be properly formatted for search engines