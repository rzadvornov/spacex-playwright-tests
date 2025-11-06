@API @SpaceX @Starlink @Read
Feature: SpaceX Starlink API
  As a user
  I want to retrieve SpaceX Starlink satellite and orbital information
  So that I can access constellation data, launch details, and spatial parameters.

  Background:
    Given the SpaceX Starlink API is available

  @Smoke @GET @List
  Scenario: Retrieve the list of all Starlink satellites
    When I make a GET request to "/starlink"
    Then the response status code should be 200
    And the response should be a valid JSON array
    And each satellite should have: id, version, launch, velocity_kms

  @Smoke @GET @ID
  Scenario: Retrieve a single Starlink satellite by a valid ID
    Given a valid Starlink satellite ID "5eed770f096e59000697b50d" is available
    When I make a GET request to "/starlink/5eed770f096e59000697b50d"
    Then the response status code should be 200
    And the satellite ID should match the requested ID
    And the response should contain spacetrack information

  @Regression @POST @Query @Filtering
  Scenario Outline: Filter Starlink satellites by launch ID, height, or velocity
    When I make a POST request to "/starlink/query" with a range filter:
      """
      {
        "query": {
          "<Field>": <Query_Body>
        }
      }
      """
    Then the response status code should be 200
    And all results should satisfy the filter condition "<Field>" as per the query

    Examples:
      | Field        | Query_Body                   | Description                 |
      | launch       | "5eb87cd9ffd86e000604b32a"   | by a specific launch ID     |
      | height_km    | { "$gte": 500, "$lte": 600 } | by height range in km       |
      | velocity_kms | { "$gte": 7 }                | by minimum velocity in km/s |

  @Regression @POST @Pagination
  Scenario: Query results can be paginated
    When I make a POST request to "/starlink/query" with pagination:
      """
      {
        "query": {},
        "options": {
          "limit": 50,
          "page": 1
        }
      }
      """
    Then the response status code should be 200
    And the response should have docs array with maximum 50 items
    And the response should contain accurate pagination metadata

  @Regression @Validation
  Scenario: Starlink fields are present and valid
    Given a valid Starlink satellite ID "5eed770f096e59000697b50d" is available
    When I make a GET request to "/starlink/5eed770f096e59000697b50d"
    Then the version field should be a non-empty string or null
    And the spaceTrack object should contain: CCSDS_ID, EPOCH, MEAN_MOTION
