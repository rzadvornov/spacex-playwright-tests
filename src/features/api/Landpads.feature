@API @SpaceX @Landpads @Read @Geo
Feature: SpaceX Landing Pads API
  As a user
  I want to retrieve SpaceX landing pad information
  So that I can track booster landing locations and usage statistics.

  Background:
    Given the SpaceX API base URL is "https://api.spacexdata.com/v4"

  @Smoke @GET @List
  Scenario: Retrieve the list of all Landing Pads
    When I make a GET request to "/landpads"
    Then the response status code should be 200
    And the response should be a valid JSON array
    And each landing pad should have: id, full_name, type, status, locality

  @Regression @POST @Query
  Scenario Outline: Filter Landing Pads by type or status
    When I make a POST request to "/landpads/query" with filter:
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
      | Field  | Value   |
      | type   | ASDS    |
      | type   | RTLS    |
      | status | active  |
      | status | retired |

  @Regression @GET @Validation @Coordinates
  Scenario: Landing Pad coordinates are valid latitude and longitude
    Given a valid landing pad ID "5e9e3032383ecb267a34e7c7" is available
    When I make a GET request to "/landpads/5e9e3032383ecb267a34e7c7"
    Then the latitude should be between -90 and 90
    And the longitude should be between -180 and 180

  @Regression @GET @Validation @Stats
  Scenario: Landing successes do not exceed landing attempts
    Given a valid landing pad ID "5e9e3032383ecb267a34e7c7" is available
    When I make a GET request to "/landpads/5e9e3032383ecb267a34e7c7"
    Then the field landing_successes should be less than or equal to landing_attempts
    And both fields should be non-negative integers
