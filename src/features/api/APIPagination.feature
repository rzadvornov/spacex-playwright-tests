@API @SpaceX @Launches @Pagination
Feature: API Pagination
  As a user
  I want to paginate through large datasets using limit and page/offset parameters
  So that I can efficiently retrieve all data without making overly large requests

  Background:
    Given the SpaceX "Launches" API is available

  @Smoke @POST @Metadata
  Scenario: Default query options return basic pagination metadata
    When I make a POST request to "/launches/query" with body:
      """
      {
        "query": {}
      }
      """
    Then the response status code should be 200
    And the response should have "docs", "totalDocs", "limit", and "page" fields

  @Regression @POST @Page @Limit
  Scenario Outline: Pagination options (limit, page, offset) are respected by the API
    When I make a POST request to "/launches/query" with options:
      """
      {
        "limit": <Limit>,
        "page": <Page>,
        "offset": <Offset>
      }
      """
    Then the response should have maximum <Limit> items in "docs"
    And the response should indicate page <Page>
    And the first result should correspond to the overall record at position <RecordPosition>

    Examples:
      | Limit | Page | Offset | RecordPosition |
      | 10    | 1    | 0      | 1              |
      | 5     | 3    | 0      | 11             |
      | 10    | 0    | 20     | 21             |

  @Regression @POST @Metadata
  Scenario: Pagination metadata fields (totalPages, hasNext/PrevPage) are accurate
    When I make a POST request to "/launches/query" with options:
      """
      {
        "limit": 10,
        "page": 1
      }
      """
    Then "totalPages" should equal ceiling of "totalDocs" divided by "limit"
    And "hasNextPage" should be true if current page is less than "totalPages"
    And "hasPrevPage" should be false for page 1

  @Regression @POST @Filtering
  Scenario: Pagination correctly applies to a filtered dataset
    When I make a POST request to "/launches/query" with query and options:
      """
      {
        "query": {
          "success": true
        },
        "options": {
          "limit": 10,
          "page": 1
        }
      }
      """
    Then the response should have maximum 10 items in "docs"
    And the response should indicate page 1
    And all capsule results should have "success" equal to true
