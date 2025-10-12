@destinations @humanSpaceflight @ui
Feature: SpaceX Destinations and Mission Locations
  As a potential space traveler or mission planner
  I want to explore SpaceX's range of destination capabilities
  So that I can understand the available mission options and their requirements

  Background:
    Given I am on the SpaceX Human Spaceflight homepage
    And I view the Destinations section

  @content @overview
  Scenario: Destinations section displays comprehensive mission locations
    Then the section should display destination information:
      | Destination   | Order | Description                | Path                    |
      | Earth Orbit   | 1     | Low Earth orbit missions   | /humanspaceflight/earth |
      | Space Station | 2     | ISS docking missions       | /humanspaceflight/iss   |
      | Moon          | 3     | Lunar exploration missions | /humanspaceflight/moon  |
      | Mars          | 4     | Mars colonization missions | /humanspaceflight/mars  |
    And each destination should have an associated visual element

  @navigation
  Scenario Outline: Destination cards navigate to detailed information
    When I click on the "<destination>" destination card
    Then I should be navigated to the destination details page
    And the URL should contain "<path>"
    And the page title should contain "<destination>"

    Examples:
      | destination   | path                    |
      | Earth Orbit   | /humanspaceflight/earth |
      | Space Station | /humanspaceflight/iss   |
      | Moon          | /humanspaceflight/moon  |
      | Mars          | /humanspaceflight/mars  |

  @visual @media
  Scenario: Destination visuals load and display correctly
    Then each destination should have proper visual elements:
      | Destination   | Element Type | Requirements                 |
      | Earth Orbit   | Image        | High-res, error-free loading |
      | Space Station | Image + SVG  | Circle overlay, interactive  |
      | Moon          | Image + SVG  | Circle overlay, interactive  |
      | Mars          | Image        | High-res, error-free loading |
    And visual elements should maintain quality across screen sizes

  @visual @background
  Scenario: Background elements enhance the destinations section
    Then the background should have these characteristics:
      | Element     | Position      | Properties        |
      | Earth image | Bottom center | Proper opacity    |
      | Stars       | Full section  | Subtle parallax   |
      | Gradient    | Top to bottom | Smooth transition |
    And background elements should not interfere with content

  @interaction @desktop
  Scenario Outline: Destination elements have proper interactive states
    When I interact with the "<element_type>" on desktop
    Then it should demonstrate the following states:
      | State   | Visual Change    | Cursor  | Accessibility  |
      | Hover   | Highlight effect | pointer | Enhanced focus |
      | Focus   | Clear indicator  | pointer | Announced      |
      | Active  | Click response   | pointer | Feedback       |
      | Regular | Default state    | default | Normal         |

    Examples:
      | element_type        |
      | destination card    |
      | interactive overlay |
      | navigation link     |
