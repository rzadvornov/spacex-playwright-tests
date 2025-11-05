@API @SpaceX @Capsules @Read
Feature: SpaceX Capsules API
  As a user
  I want to retrieve SpaceX capsule information
  So that I can track spacecraft data and reusability

  Background:
    Given the SpaceX API base URL is "https://api.spacexdata.com/v4"

  @Smoke @GET @List
  Scenario: Retrieve the list of all Capsules
    When I make a GET request to "/capsules"
    Then the response status code should be 200
    And the response should be a valid JSON array
    And each capsule should have: id, serial, type, status

  @Smoke @GET @ID
  Scenario: Retrieve a single Capsule by a valid ID
    Given a valid capsule ID "5e9e2c5bf35918ed873b2664" is available
    When I make a GET request to "/capsules/5e9e2c5bf35918ed873b2664"
    Then the response status code should be 200
    And the response should be a valid JSON object
    And the capsule ID should match the requested ID

  @Error @404 @ID
  Scenario: Requesting a non-existent Capsule by ID returns 404
    When I make a GET request to "/capsules/invalid-capsule-id"
    Then the response status code should be 404

  @Regression @POST @Query @Filter
  Scenario Outline: Filter Capsules by common criteria (type, status)
    When I make a POST request to "/capsules/query" with query:
      """
      {
        "query": {
          "<Field>": "<Value>"
        }
      }
      """
    Then the response status code should be 200
    And all capsules should have "<Field>" equal to "<Value>"

    Examples:
      | Field  | Value      |
      | type   | Dragon 1.1 |
      | type   | Dragon 2.0 |
      | status | active     |
      | status | retired    |
