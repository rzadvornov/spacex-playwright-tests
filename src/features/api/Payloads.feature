@API @SpaceX @Payloads @Read @Query
Feature: SpaceX Payloads API
  As a user
  I want to retrieve SpaceX payload information
  So that I can access details about satellites and cargo specifications.

  Background:
    Given the SpaceX API base URL is "https://api.spacexdata.com/v4"

  @Smoke @GET @List
  Scenario: Retrieve the list of all Payloads
    When I make a GET request to "/payloads"
    Then the response status code should be 200
    And the response should be a valid JSON array
    And each payload should have: id, name, type, orbit

  @Regression @POST @Query
  Scenario Outline: Filter Payloads by type or reused status
    When I make a POST request to "/payloads/query" with filter:
      """
      {
        "query": {
          "<Field>": <Value>
        }
      }
      """
    Then the response status code should be 200
    And all results should have "<Field>" equal to <Value>

    Examples:
      | Field  | Value        |
      | type   | "Satellite"  |
      | type   | "Dragon 1.1" |
      | reused | true         |
      | reused | false        |

  @Regression @GET @Validation @Mass
  Scenario: Payload mass units (kg/lbs) are consistent
    Given a valid payload ID "5eb0e4b5b6c3bb0006eeb1e1" is available
    When I make a GET request to "/payloads/5eb0e4b5b6c3bb0006eeb1e1"
    Then the field mass_kg should be a non-negative number or null
    And the mass_lbs value should be the correct conversion of mass_kg
