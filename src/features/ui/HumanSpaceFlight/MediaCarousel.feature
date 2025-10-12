@mediaCarousel
Feature: SpaceX Human Spaceflight Media Carousel
  As a website visitor
  I want to view and interact with media content
  So that I can experience astronaut perspectives and training footage

  Background:
    Given I am on the SpaceX Human Spaceflight homepage
    And I view the media carousel section

  @smoke @core
  Scenario: Media carousel displays all required media tiles
    Then I should see four media tiles:
      | Media Type | Title      | Description                             |
      | video      | On-Orbit   | View Earth from 300km up                |
      | audio      | Launch     | Listen as the crew prepares for liftoff |
      | audio      | Splashdown | Listen to the crew prepare for landing  |
      | video      | Training   | Watch crew prepare for launch day       |
    And each tile should have an image or audio/video player
    And navigation arrows should be present to scroll through tiles
    And pagination dots should indicate the current tile

  @videoPlayback
  Scenario Outline: Media carousel video playback functionality
    When I click the play button on the "<Title>" video tile
    Then an overlay with the video player should open
    And the YouTube video should load
    And the video title should be "<Title>"
    And the video description should be "<Description>"
    And a close button should be visible to dismiss the overlay
    When I click the close button
    Then the overlay should close and return to the carousel

    Examples:
      | Title    | Description                       |
      | On-Orbit | View Earth from 300km up          |
      | Training | Watch crew prepare for launch day |

  @audioPlayback
  Scenario Outline: Media carousel audio playback functionality
    When I click on the "<Title>" audio tile
    Then an audio player should be displayed
    And the audio title should be "<Title>"
    And the audio description should be "<Description>"
    And the audio player should have play/pause controls
    And the audio player should display the audio duration
    And the audio player should display a progress bar

    Examples:
      | Title      | Description                             |
      | Launch     | Listen as the crew prepares for liftoff |
      | Splashdown | Listen to the crew prepare for landing  |

  @navigation
  Scenario: Media carousel pagination and arrow navigation
    And I view the media carousel with the "On-Orbit" tile active
    When I click on the pagination dot for the second tile
    Then the carousel should advance to the "Launch" tile
    And the pagination dot for "Launch" should be active
    When I click the next arrow button
    Then the carousel should advance to the "Splashdown" tile
    When I click the previous arrow button
    Then the carousel should go back to the "Launch" tile

  @accessibility @behavior
  Scenario: Media carousel accessibility and behavior
    Then the carousel should be visible
    And no media should auto-play on page load (autoplay disabled)
    When I click the play button on a video tile
    Then the video overlay should open
    When I press the Escape key
    Then the overlay should close
