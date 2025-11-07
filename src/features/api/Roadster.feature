@API @SpaceX @Roadster @Read
Feature: SpaceX Roadster API
  As a user
  I want to retrieve information about Elon Musk's Tesla Roadster in space
  So that I can monitor its status and trajectory data

  Background:
    # Updated to align with the convention in Ships, Rockets, and Starlink features
    Given the SpaceX "Roadster" API is available

  @Critical @GET @Info
  Scenario: Retrieve complete Roadster information
    When I make a GET request to "/roadster"
    Then the response status code should be 200
    And the response should be a valid JSON object
    And the name field should contain "Roadster"
    And the launch_date_utc should be a valid ISO 8601 timestamp

  @Regression @GET @Validation @Numeric
  Scenario Outline: Key numeric and orbital fields are present and valid
    When I make a GET request to "/roadster"
    Then the response status code should be 200
    And the field "<Field>" should be present
    And the "<Field>" value should be a "<ValidationType>"

    Examples:
      | Field             | ValidationType   |
      | norad_id          | positive integer |
      | launch_mass_kg    | positive number  |
      | speed_kph         | positive number  |
      | earth_distance_km | positive number  |
      | mars_distance_km  | positive number  |
      | period_days       | positive number  |

  @Regression @GET @Validation @Links
  Scenario: External links (Wikipedia, video) are present and valid URLs
    When I make a GET request to "/roadster"
    Then the response status code should be 200
    And the "wikipedia" field should be a valid URL
    And the "video" field should be a valid URL
