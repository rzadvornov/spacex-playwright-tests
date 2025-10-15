@updates @news-feed @high-priority
Feature: View SpaceX News and Mission Updates
  As a space enthusiast or stakeholder
  I want to view the latest news and program updates
  So that I can stay informed about SpaceX's development, missions, and partnerships.

  Background:
    Given a user navigates to the Updates page
    And the database of all updates is successfully loaded

  @updates @display @ordering
  Scenario: View Latest Updates in Reverse Chronological Order
    When the Updates page loads initially
    Then the user should see the most recent SpaceX news and updates prominently displayed
    And the displayed updates should be ordered in **reverse chronological order** (newest first)
    And each update card should clearly show the **date, title, and a summary/excerpt**
    And the page should match the snapshot "updates_initial_load"

  @updates @polaris @mission-details
  Scenario: View and Understand the Polaris Program Announcement
    When the user scrolls through the primary update feed
    Then a major update about the **Polaris Program** should be displayed
    And the update should introduce Jared Isaacman's initiative and charitable goal
    And the text should clearly mention **three planned human spaceflight missions**

  @updates @polaris @mission-details @crew
  Scenario: View Polaris Dawn Mission Details and Crew
    When the user reviews the Polaris Dawn mission details
    Then the information should accurately describe the mission's scope:
      | Detail Field        | Expected Information               |
      | Mission Designation | Polaris Dawn                       |
      | Mission Goal        | Reach highest Earth orbit          |
      | Mission Duration    | Approximately five days            |
      | Unique Milestone    | First commercial spacewalk attempt |
    And the following four crew members should be listed:
      | Role               | Name           |
      | Commander          | Jared Isaacman |
      | Mission Specialist | Scott Poteet   |
      | Flight Engineer    | Sarah Gillis   |
      | Medical Officer    | Anna Menon     |

  @updates @starship @development
  Scenario: View Starship Development Milestones
    When the user looks for Starship news within the update feed
    Then updates about the **latest Starship development milestones** should be displayed
    And the information should reference recent major announcements (e.g., IFT details, next steps)
    And key development status information (e.g., Starbase manufacturing progress) should be highlighted

  @updates @starlink @mission-log
  Scenario: View Starlink Mission and Deployment Updates
    When the user looks for Starlink news
    Then updates about Starlink satellite deployment missions should be displayed
    And the updates should include the **number of satellites deployed** in recent launches
    And relevant operational details (e.g., orbit raises, minor anomalies, storm impacts) should be mentioned

  @updates @filter @category
  Scenario: Filter Updates by Specific Category
    When the user selects the category filter "Artemis"
    Then the updates list should filter to show **only** news related to the Artemis Program
    And the filter should be visually indicated as active (e.g., a button state change)
    And the displayed articles should highlight **Starship's role as a Human Landing System (HLS)** and NASA partnership details

  @updates @search @usability
  Scenario: Search for a Specific Update by Keyword
    When the user enters the search term "Inspiration4" into the search field
    Then the updates list should filter dynamically to show matching results
    And the search results should include details about the **all-civilian mission** and its crew
    And if the user enters a non-matching search term
    Then a message should clearly indicate "No updates found matching your search term"

  @updates @display @details
  Scenario: Navigate to View Full Update Details
    When the user clicks on the title of a specific update
    Then the full, dedicated update page should load
    And the full, unexcerpted text of the update should be displayed
    And related multimedia (images, video embeds, or downloadable documents) should be available

  @updates @statistics @data-integrity
  Scenario: View Key Program Statistics
    When the page finishes loading
    Then a summary statistics panel should be prominently displayed
    And the panel should accurately report the following key metrics:
      | Metric Field                 | Value Format |
      | Total successful missions    | Integer      |
      | Reusable booster flights     | Integer      |
      | Starlink satellites deployed | Integer      |
      | Crew missions completed      | Integer      |

  @updates @archive @pagination
  Scenario: Access Historical Update Archives
    When the user looks for older, historical news
    Then an archive tool or date picker should be available for selecting time periods
    And the updates list should include **pagination controls** or a "Load More" button
    And clicking "Load More" should append the next set of older updates to the list

  @updates @share @usability
  Scenario: Share a Specific Update
    Given a user is viewing a specific full update page
    When the user wants to share the news
    Then social media sharing buttons should be clearly visible and functional
    And sharing options should include **Twitter, Facebook, and LinkedIn**
    And a mechanism to copy the direct URL link to the clipboard should be available
