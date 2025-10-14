@missions @portal @high-priority
Feature: Browse and Filter SpaceX Missions
  As a space enthusiast or researcher
  I want to view, filter, and search the complete list of SpaceX missions
  So that I can easily find information about specific launches, vehicles, and status.

  Background:
    Given a user navigates to the Missions page
    And the list of all available missions is successfully loaded

  @missions @list @display
  Scenario: View Mission List with Core Details and Chronological Order
    When the page loads initially
    Then the user should see a list of completed and upcoming SpaceX missions
    And each mission card should accurately display the **launch date, mission name, and vehicle type**
    And the mission list should be ordered **chronologically from most recent to oldest**
    And the page should match the snapshot "missions_initial_load"

  @missions @filter @vehicle
  Scenario: Filter Missions by Vehicle Type
    When the user selects the vehicle filter with the value "Falcon Heavy"
    Then the mission list should update to show **only** missions launched by Falcon Heavy
    And the total count of filtered missions should be displayed prominently (e.g., "Showing 7 of 150 Missions")
    And the vehicle filter should allow multiple selections (e.g., "Falcon 9, Dragon")

  @missions @details @navigation
  Scenario: Navigate to View Specific Mission Details
    When the user clicks on a specific mission link, such as "Demo-2"
    Then the mission details page should load successfully
    And the page should show detailed information including **payload, launch site, and mission objectives**
    And relevant multimedia content (video footage or images) of the mission should be available

  @missions @filter @status
  Scenario: Filter Missions by Status
    When the user selects the status filter with the value "Upcoming"
    Then the mission list should display **only** missions with the Upcoming status
    And for each upcoming mission, a **scheduled launch date and time** should be clearly visible

  @missions @search @data-integrity
  Scenario: Search for a Specific Mission or Payload Name
    When the user enters the text "Starlink" into the search box
    Then the mission list should filter dynamically to show only matching results
    And if the user enters a search term like "Apollo 11" (which has no matches)
    Then a visible message should indicate "No missions found matching your criteria"

  @missions @statistics @data-integrity
  Scenario: View Top-Level Mission Statistics
    When the page loads
    Then a statistics panel should be displayed
    And the panel should show key metrics, including total missions, successful launches, and total payload deployed
    And the displayed statistics should update automatically when a new mission is marked as completed

  @missions @sort @usability
  Scenario: Sort Missions by Different Criteria
    When the user selects the sorting option "Vehicle Type"
    Then the mission list should reorder to group missions by their vehicle type
    And the user interface should visually indicate that "Vehicle Type" is the active sort criteria
    And when the user selects the sorting option "Success Rate"
    Then missions should be ordered based on the success rate of the vehicle used

  @missions @livestream @timing
  Scenario: Access Live Stream and Countdown for Upcoming Mission
    Given a user is viewing an upcoming mission that is less than 24 hours from launch
    When the user views the mission details
    Then a clear link or button to the **live stream** should be available
    And a highly visible **countdown timer** should display the precise time remaining until launch
