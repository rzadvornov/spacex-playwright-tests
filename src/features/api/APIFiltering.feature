@API @SpaceX @Launches @Filtering @Query
Feature: API Filtering, Querying, and Sorting
  As a user who needs specific data
  I want to filter, sort, and select data using various query operators
  So that I can efficiently retrieve only the information I need

  Background:
    Given the SpaceX "Launches" API is available

  @Smoke @POST @Query @Operators
  Scenario Outline: Filter by various operators returns correct subset of results
    When I make a POST request to "<Endpoint>" with following query:
      """
      {
        "query": {
          "<Field>": {
            "<Operator>": <Value>
          }
        }
      }
      """
    Then the response status code should be 200
    And all results should satisfy the filter condition "<Field>" "<Operator>" "<Value>"

    Examples:
      | Endpoint        | Field       | Operator | Value |
      | /launches/query | success     |          | true  |
      | /cores/query    | reuse_count | $gt      | 3     |
      | /cores/query    | reuse_count | $gte     | 5     |
      | /payloads/query | mass_kg     | $lt      | 1000  |
      | /payloads/query | mass_kg     | $lte     | 500   |
      | /launches/query | success     | $ne      | null  |

  @Regression @POST @Query @Date
  Scenario: Filter by date range (GTE and LTE) is accurate
    When I make a POST request to "/launches/query" with following query:
      """
      {
        "query": {
          "date_utc": {
            "$gte": "2020-01-01T00:00:00.000Z",
            "$lte": "2020-12-31T23:59:59.999Z"
          }
        }
      }
      """
    Then the response status code should be 200
    And all results should have "date_utc" between "2020-01-01" and "2020-12-31"

  @Regression @POST @Query @Compound
  Scenario: Combining multiple AND filter conditions returns correct results
    When I make a POST request to "/launches/query" with following query:
      """
      {
        "query": {
          "success": true,
          "upcoming": false
        }
      }
      """
    Then the response status code should be 200
    And all results should be successful and not upcoming

  @Regression @POST @Query @Sorting
  Scenario: Sort results in descending order by a date field
    When I make a POST request to "/launches/query" with options:
      """
      {
        "sort": {
          "date_utc": "desc"
        },
        "limit": 20
      }
      """
    Then the response status code should be 200
    And results should be sorted by "date_utc" descending
