@API @SpaceX @Launchpads @Read @Geo
Feature: SpaceX Launchpads API
  As a user
  I want to retrieve SpaceX launchpad information
  So that I can find launch location details and usage statistics.

  Background:
    Given the SpaceX API base URL is "https://api.spacexdata.com/v4"

  @Smoke @GET @List
  Scenario: Retrieve the list of all Launchpads
    When I make a GET request to "/launchpads"
    Then the response status code should be 200
    And the response should be a valid JSON array
    And each launchpad should have: id, full_name, locality, region, status

  @Regression @POST @Query
  Scenario Outline: Filter Launchpads by name or status
    When I make a POST request to "/launchpads/query" with filter:
      """
      {
        "query": {
          "<Field>": "<Value>"
        }
      }
      """
    Then the response status code should be 200
    And all results should have "<Field>" equal to "<Value>"

    Examples:
      | Field  | Value       |
      | name   | VAFB SLC 4E |
      | status | active      |
      | status | retired     |

  @Regression @GET @Validation @Coordinates
  Scenario: Launchpad coordinates are valid latitude and longitude
    Given a valid launchpad ID "5e9e4502f509094188566f88" is available
    When I make a GET request to "/launchpads/5e9e4502f509094188566f88"
    Then the latitude should be between -90 and 90
    And the longitude should be between -180 and 180

  @Regression @GET @Validation @Stats
  Scenario: Launchpad successes do not exceed launch attempts
    Given a valid launchpad ID "5e9e4502f509094188566f88" is available
    When I make a GET request to "/launchpads/5e9e4502f509094188566f88"
    Then the field launch_successes should be less than or equal to launch_attempts
    And both fields should be non-negative integers
