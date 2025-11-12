@API @SpaceX @Capsules @Read @Query
Feature: SpaceX Capsules API
  As a user
  I want to retrieve SpaceX capsule information
  So that I can track spacecraft data and reusability

  Background:
    Given the SpaceX "Capsules" API is available

  @Smoke @GET @List
  Scenario: Retrieve the list of all Capsules
    When I make a GET request to "/capsules"
    Then the response status code should be 200
    And the response should be a valid JSON array
    And each response item should have the following properties: "id, serial, type, status"

  @Smoke @GET @ID
  Scenario: Retrieve a single Capsule by a valid ID
    Given a valid capsule ID "5e9e2c5bf35918ed873b2664" is available
    When I make a GET request with the resource ID
    Then the response status code should be 200
    And the response should be a valid JSON object
    And the capsule ID should match the requested ID

  @Error @404 @ID
  Scenario: Requesting a non-existent Capsule by ID returns 404
    Given an invalid resource ID "invalid-capsule-id" is available
    When I make a GET request with the resource ID
    Then the response status code should be 404

  @Regression @POST @Query @Filter
  Scenario Outline: Filter Capsules by common criteria (type, status, land_attempts)
    When I make a POST request to "/capsules/query" with query:
      """
      {
        "query": {
          "<Field>": <Value>
        }
      }
      """
    Then the response status code should be 200
    # Note: For the 'land_attempts' query where Value is { "$gte": 1 }, the ValidationField/Value is used for a simple check.
    # The 'land_attempts' > 0 check is handled by the dedicated scenario below.
    And all capsule results should have "<ValidationField>" equal to <ValidationValue>

    Examples:
      | Field  | Value        | ValidationField | ValidationValue | Description             |
      | type   | "Dragon 1.0" | type            | "Dragon 1.0"    | Filter by capsule type  |
      | status | "active"     | status          | "active"        | Filter by active status |

  @Regression @POST @Query @Range
  Scenario: Filter Capsules by successful land attempts (greater than 0)
    When I make a POST request to "/capsules/query" with query:
      """
      {
        "query": {
          "land_attempts": {
            "$gt": 0
          }
        }
      }
      """
    Then the response status code should be 200
    And all capsule results should have "land_attempts" greater than 0
