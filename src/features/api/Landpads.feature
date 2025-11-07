@API @SpaceX @Landpads @Read @Geo
Feature: SpaceX Landing Pads API
  As a user
  I want to retrieve SpaceX landing pad information
  So that I can track booster landing locations and usage statistics.

  Background:
    Given the SpaceX "Landpads" API is available

  @Smoke @GET @List
  Scenario: Retrieve the list of all Landing Pads
    When I make a GET request to "/landpads"
    Then the response status code should be 200
    And the response should be a valid JSON array
    And each response item should have the following properties: "id, full_name, type, status, locality"

  @Smoke @GET @ID
  Scenario: Retrieve a single Landing Pad by a valid ID
    Given a valid landing pad ID "5e9e3032383ecb267a34e7c7" is available
    When I make a GET request to "/landpads/5e9e3032383ecb267a34e7c7"
    Then the response status code should be 200
    And the response ID should match the requested ID

  @Regression @POST @Query
  Scenario Outline: Filter Landing Pads by type or status
    When I query the Landpads API using POST with filter:
      """
      {
        "query": {
          "<Field>": "<Value>"
        }
      }
      """
    Then the response status code should be 200
    And the results should contain landpads matching "<Field>" equals "<Value>"

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
    Then the response status code should be 200
    And the landpad latitude should be between -90 and 90
    And the landpad longitude should be between -180 and 180

  @Regression @GET @Validation @Stats
  Scenario: Landing successes do not exceed landing attempts
    Given a valid landing pad ID "5e9e3032383ecb267a34e7c7" is available
    When I make a GET request to "/landpads/5e9e3032383ecb267a34e7c7"
    Then the response status code should be 200
    And the successful_landings should not be greater than the landing_attempts
