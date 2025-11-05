@API @SpaceX @Integration @E2E
Feature: API Integration and Cross-Endpoint Validation
  As a developer
  I want to integrate and validate data across multiple API endpoints
  So that I can build comprehensive applications with consistent information

  Background:
    Given the SpaceX API base URL is "https://api.spacexdata.com/v4"

  @Critical @Launches @Rockets
  Scenario: Launch data correctly references its Rocket
    Given a valid launch ID "5eb87cd9ffd86e000604b32a" is available
    When I retrieve the launch data
    And I retrieve the rocket data using the extracted rocket ID
    Then the rocket data should be valid
    And the rocket ID in the launch and the retrieved rocket ID should match

  @Regression @Launches @Cores
  Scenario: Launch data correctly references its Cores
    Given a valid launch with multiple cores is available
    When I retrieve the launch data
    And I retrieve each core using the extracted core IDs
    Then all retrieved core data should be valid
    And cores should reference the launch ID

  @Regression @Launches @Launchpads
  Scenario: Launch data correctly references its Launchpad
    Given a valid launch with a launchpad is available
    When I retrieve the launch data
    And I retrieve the launchpad data using the extracted launchpad ID
    Then the launchpad data should be valid
    And the launchpad should list the launch ID

  @Regression @Cores @Launches @History
  Scenario: Core data correctly references all associated Launches
    Given a reused core ID is available
    When I retrieve the core data
    And I retrieve all launches referenced by the core ID
    Then all launches should be valid and reference the core ID

  @E2E @Launches @Mission
  Scenario: All resource links within a Launch form a complete mission profile
    Given a launch ID with full mission data is available
    When I retrieve all linked resources (rocket, cores, payloads, launchpad, crew)
    Then all retrieved data should form a complete, valid mission profile
    And all cross-references between the resources should be valid
