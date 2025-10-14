@ourMissions
Feature: SpaceX Human Spaceflight Our Missions Section
  As a potential astronaut or researcher
  I want to understand different mission types and their specifications
  So that I can choose the right mission for my needs

  Background:
    Given I am on the SpaceX Human Spaceflight homepage
    And I view the Our Missions section

  @smoke @content
  Scenario: Our Missions section displays essential content
    Then the Our Missions section should display core elements:
      | Element     | Content                                  |
      | Title       | Our Missions                             |
      | Description | Scientific research and global awareness |
      | Default Tab | Earth Orbit                              |
    And mission tabs should be available:
      | Tab Name      | Order |
      | Earth Orbit   | 1     |
      | Space Station | 2     |
      | Moon          | 3     |
      | Mars          | 4     |

  @metrics
  Scenario Outline: Mission tabs display correct metrics
    When I view the "<Mission Type>" tab
    Then the tab should become active
    And the metrics table should show mission-specific information:
      | Metric           | Value           | Additional Info            |
      | <Primary Metric> | <Primary Value> | <Primary Additional>       |
      | Mission Duration | <Duration>      | Typical mission length     |
      | Altitude         | <Altitude>      | Above Earth's surface      |
      | Seating          | <Passengers>    | Crew capacity              |
      | Cargo / Science  | <Cargo>         | Available payload capacity |

    Examples:
      | Mission Type  | Primary Metric   | Primary Value    | Duration    | Altitude     | Passengers | Cargo            |
      | Earth Orbit   | Orbit Frequency  | Every 90 minutes | 3 - 6 days  | 300 - 500 km | 2 - 4      | Up to 192 kg     |
      | Space Station | Docking Duration | Up to 6 months   | 6+ months   | 400 km       | Up to 7    | Up to 3,307 kg   |
      | Moon          | Travel Time      | 3 days           | 7 - 14 days | 384,400 km   | 2 - 4      | Mission specific |
      | Mars          | Journey Time     | 6-8 months       | 2+ years    | 225M km      | TBD        | TBD              |

  @navigation @interaction
  Scenario Outline: Tab switching behavior and content updates
    When I click on the "<Target Tab>" tab
    Then the following changes should occur:
      | Element       | State                           |
      | Target Tab    | Active, highlighted             |
      | Previous Tab  | Inactive                        |
      | Metrics Table | Updates with new data           |
      | Description   | Shows <Description Focus> focus |
      | Background    | Updates to relevant image       |

    Examples:
      | Target Tab    | Description Focus    |
      | Space Station | ISS operations       |
      | Moon          | Lunar exploration    |
      | Mars          | Martian colonization |

  @interaction @reliability
  Scenario: Tab interaction responsiveness
    When I perform rapid tab interactions:
      | Action              | Expected Result        |
      | Quick tab switching | Smooth content updates |
      | Multiple clicks     | No data corruption     |
      | Background loading  | No visual glitches     |
    Then all content transitions should be smooth
    And the UI should remain responsive

  @cta @navigation
  Scenario: Mission engagement functionality
    Then a "Join a mission" button should be visible
    When I click the "Join a mission" button
    Then I should be directed to:
      | Element    | Requirement                       |
      | URL        | Contains /humanspaceflight/submit |
      | Page Title | Mission Submission                |
      | Form       | Visible and interactive           |

  @visual @styling
  Scenario: Visual presentation requirements
    Then the section should meet visual standards:
      | Element          | Requirement                    |
      | Background Image | Left-aligned, mission-relevant |
      | Image Opacity    | Appropriate for text overlay   |
      | Tab Design       | Consistent styling             |
      | Metrics Layout   | Clean, organized grid          |
      | Typography       | Clear and readable             |
