@API @SpaceX @Payloads @Read @Query
Feature: SpaceX Payloads API
  As a user
  I want to retrieve SpaceX payload information
  So that I can access details about satellites and cargo specifications.

  Background:
    Given the SpaceX "Payloads" API is available

  @Smoke @GET @List
  Scenario: Retrieve the list of all Payloads
    When I make a GET request to "/payloads"
    Then the response status code should be 200
    And the response should be a valid JSON array
    And each response item should have the following properties: "id, name, type, orbit, launch, customers"

  @Smoke @GET @ID
  Scenario: Retrieve a single Payload by a valid ID
    Given a valid payload ID "5eb0e4b5b6c3bb0006eeb1e1" is available
    When I make a GET request to "/payloads/5eb0e4b5b6c3bb0006eeb1e1"
    Then the response status code should be 200
    And the response ID should match the requested ID
    And the response should be a valid JSON object

  @Regression @POST @Query @Filtering @String
  Scenario Outline: Filter Payloads by type (String matching)
    When I query the Payloads API using POST with filter:
      """
      {
        "query": {
          "<Field>": <Value>
        }
      }
      """
    Then the response status code should be 200
    And the results should contain payloads matching "<Field>" equals <Value>

    Examples:
      | Field | Value        |
      | type  | "Satellite"  |
      | type  | "Dragon 1.1" |

  @Regression @POST @Query @Filtering @Boolean
  Scenario Outline: Filter Payloads by reused status (Boolean matching)
    When I query the Payloads API using POST with filter:
      """
      {
        "query": {
          "reused": <Value>
        }
      }
      """
    Then the response status code should be 200
    And the results should contain payloads matching "reused" equals <Value>

    Examples:
      | Value |
      | true  |
      | false |

  @Regression @GET @Validation @Mass
  Scenario: Payload mass units (kg/lbs) are consistent
    Given a valid payload ID "5eb0e4b5b6c3bb0006eeb1e1" is available
    When I make a GET request to "/payloads/5eb0e4b5b6c3bb0006eeb1e1"
    Then the response status code should be 200
    And the field "mass_kg" should be a non-negative number or null
    And the field "mass_lbs" should be a non-negative number or null
    And the mass_kg should be approximately equal to mass_lbs converted from pounds
