@API @SpaceX @Cores @Read
Feature: SpaceX Core (Booster) API
  As a user
  I want to retrieve SpaceX rocket core information
  So that I can track core reusability and landing history

  Background:
    Given the SpaceX "Cores" API is available

  @Smoke @GET @List
  Scenario: Retrieve the list of all Cores
    When I make a GET request to "/cores"
    Then the response status code should be 200
    And the response should be a valid JSON array
    And each response item should have the following properties: "id, serial, block, status, reuse_count, last_update"

  @Smoke @GET @ID
  Scenario: Retrieve a single Core by a valid ID
    Given a valid core ID "5e9e28a6f3a61c0006f7b147" is available
    When I make a GET request to "/cores/5e9e28a6f3a61c0006f7b147"
    Then the response status code should be 200
    And the response ID should match the requested ID

  @Smoke @POST @Query @Filtering
  Scenario Outline: Filter Cores by key status, block, or reuse count
    When I query the Cores API using POST with filter:
      """
      {
        "query": {
          "<Field>": <Value>
        }
      }
      """
    Then the response status code should be 200
    And all core results should have "<Field>" equal to <Value>

    Examples:
      | Field       | Value         | Description         |
      | status      | "active"      | active cores        |
      | status      | "lost"        | lost cores          |
      | block       | 5             | block 5 cores       |
      | reuse_count | { "$gte": 5 } | highly reused cores |
      | serial      | "B1049"       | core serial B1049   |
