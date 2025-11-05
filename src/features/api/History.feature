@API @SpaceX @History @Read @Time
Feature: SpaceX Historical Events API
  As a user
  I want to retrieve SpaceX historical events
  So that I can access significant milestones and achievements over time.

  Background:
    Given the SpaceX API base URL is "https://api.spacexdata.com/v4"
    And a POST request to "/history/query" is prepared

  @Smoke @GET @List
  Scenario: Retrieve the list of all History events
    When I make a GET request to "/history"
    Then the response status code should be 200
    And the response should be a valid JSON array
    And each event should have: id, title, event_date_utc

  @Regression @POST @Query @Date
  Scenario Outline: Filter History events by specific year range
    When I make a POST request with date range query:
      """
      {
        "query": {
          "event_date_utc": {
            "$gte": "<Start>",
            "$lt": "<End>"
          }
        },
        "options": {
          "limit": 10
        }
      }
      """
    Then the response status code should be 200
    And all events should fall between date "<Start>" and "<End>"

    Examples:
      | Start                | End                  |
      | 2010-01-01T00:00:00Z | 2011-01-01T00:00:00Z |
      | 2020-01-01T00:00:00Z | 2021-01-01T00:00:00Z |

  @Regression @POST @Sorting
  Scenario Outline: Sort History events by date in specified order
    When I make a POST request with options for sorting:
      """
      {
        "options": {
          "sort": {
            "event_date_utc": "<Order>"
          },
          "limit": 10
        }
      }
      """
    Then the response status code should be 200
    And events should be sorted by date in "<Order>" order

    Examples:
      | Order |
      | asc   |
      | desc  |

  @Regression @Validation @Links
  Scenario: All history events must reference a launch or an external link
    When I make a GET request to "/history"
    Then for each event, the launch field should be present or the links object should be present
