@API @SpaceX @Cores @Read
Feature: SpaceX Core (Booster) API
  As a user
  I want to retrieve SpaceX rocket core information
  So that I can track core reusability and landing history

  Background:
    Given the SpaceX API base URL is "https://api.spacexdata.com/v4"

  @Smoke @GET @List
  Scenario: Retrieve the list of all Cores
    When I make a GET request to "/cores"
    Then the response status code should be 200
    And the response should be a valid JSON array

  @Smoke @POST @Query @Filtering
  Scenario Outline: Filter Cores by key status, block, or reuse count
    When I make a POST request to "/cores/query" with filter:
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
      | Field       | Value         | Description         |
      | status      | "active"      | active cores        |
      | status      | "lost"        | lost cores          |
      | block       | 5             | block 5 cores       |
      | reuse_count | { "$gte": 5 } | highly reused cores |
      | serial      | "B1049"       | core serial B1049   |
