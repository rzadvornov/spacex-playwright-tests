@accessibility @humanSpaceflight @ui
Feature: SpaceX Human Spaceflight Page Accessibility
  As a user with diverse abilities and assistive technologies
  I want the website to follow WCAG 2.1 AA standards
  So that I can navigate and interact with all content effectively

  Background:
    Given I am on the SpaceX Human Spaceflight homepage

  @structure @headings
  Scenario: Page structure follows proper heading hierarchy
    Then the page heading structure should be correct:
      | Level | Content           | Count |
      | H1    | Human Spaceflight | 1     |
      | H2    | Section headings  | 6+    |
      | H3-H6 | Sub-sections      | Any   |
    And all headings should be properly nested
    And each major section should have a descriptive heading

  @landmarks @aria
  Scenario: Essential page landmarks are properly defined
    Then the page should have the following landmarks:
      | Type   | Purpose      | Content Requirements  |
      | header | Main header  | Logo and navigation   |
      | nav    | Navigation   | Primary nav links     |
      | main   | Main content | Primary page content  |
      | footer | Page footer  | Footer links and info |
    And each landmark should have appropriate ARIA roles

  @keyboard @navigation
  Scenario Outline: All interactive elements are keyboard accessible
    When I navigate through the page using the Tab key
    Then each <element_type> should:
      | Requirement              | Status |
      | Be keyboard focusable    | Yes    |
      | Have visible focus state | Yes    |
      | Show focus indicator     | Yes    |
      | Have sufficient contrast | Yes    |
      | Be logically ordered     | Yes    |
    And no keyboard traps should exist

    Examples:
      | element_type |
      | button       |
      | link         |
      | form input   |
      | menu item    |
      | video player |

  @forms @labels
  Scenario: Form elements have proper accessibility attributes
    When I examine all form inputs on the page
    Then each form element should have correct attributes:
      | Element Type | Label Type | Requirements                     |
      | text input   | label tag  | visible, associated, descriptive |
      | select       | aria-label | clear purpose, unique            |
      | checkbox     | label tag  | adjacent, clear state            |
      | radio        | fieldset   | grouped, legend present          |
    And placeholders should only supplement labels

  @images @alt-text
  Scenario: Images and icons have appropriate accessibility text
    Then all visual elements should have proper descriptions:
      | Element Type   | Attribute Required | Content Type   |
      | Content images | alt text           | Descriptive    |
      | Decorative     | empty alt=""       | None required  |
      | SVG icons      | aria-label         | Purpose/action |
      | Complex images | aria-describedby   | Detailed desc  |
    And all SVG elements should have proper ARIA roles

  @media @captions
  Scenario Outline: Media content is accessible with alternative formats
    When I play <content_type> in the media carousel
    Then the content should have the following accessibility features:
      | Feature       | Status | Requirements               |
      | <primary_alt> | Yes    | Synchronized, accurate     |
      | Controls      | Yes    | Keyboard accessible        |
      | Progress      | Yes    | Screen reader friendly     |
      | Volume        | Yes    | Independently controllable |
    And the content should be pauseable

    Examples:
      | content_type | primary_alt |
      | video        | captions    |
      | audio        | transcript  |

  @visual @indicators
  Scenario: Information is not conveyed through color alone
    Then all status indicators should use multiple cues:
      | Element Type | Visual Cue Types       |
      | Status       | Color + Icon + Text    |
      | Links        | Color + Underline      |
      | Buttons      | Color + Shape + Label  |
      | Errors       | Color + Icon + Message |
    And all interactive elements should have clear states

  @contrast @readability
  Scenario: Text and UI elements meet contrast requirements
    Then all content should meet WCAG 2.1 AA contrast ratios:
      | Content Type     | Min Ratio | Required Level |
      | Normal text      | 4.5:1     | AA             |
      | Large text       | 3:1       | AA             |
      | UI components    | 3:1       | AA             |
      | Focus indicators | 3:1       | AA             |
    And contrast should be maintained in all color schemes

  @zoom @scaling
  Scenario Outline: Content remains accessible when scaled
    When I set the text scaling to <scale_percentage>
    Then the page should maintain usability:
      | Requirement             | Status |
      | All content visible     | Yes    |
      | No horizontal scroll    | Yes    |
      | No overlapping elements | Yes    |
      | Controls accessible     | Yes    |
      | Layout preserved        | Yes    |

    Examples:
      | scale_percentage |
      | 125%             |
      | 150%             |
      | 200%             |

  @media @autoplay
  Scenario: Media behavior respects user preferences
    Then all media elements should follow these rules:
      | Media Type | Initial State | User Control Required | Auto-play |
      | Video      | Paused        | Yes                   | No        |
      | Audio      | Muted         | Yes                   | No        |
      | Animation  | Respectful    | Yes                   | Optional  |
    And users should maintain control over playback

  @motion @safety
  Scenario: Animation and motion are safely implemented
    Given the browser has the following preferences:
      | Preference             | Setting |
      | prefers-reduced-motion | enabled |
    Then the page should adapt:
      | Element Type | Behavior Change  |
      | Animations   | Disabled/Minimal |
      | Carousels    | No Auto-advance  |
      | Parallax     | Disabled         |
      | Transitions  | Simplified       |
    And no content should flash more than 3 times/second

  @forms @validation
  Scenario: Form validation is accessible and informative
    When I submit a form with invalid data
    Then validation should be accessible:
      | Aspect           | Requirement                   |
      | Error Messages   | Clear, descriptive, announced |
      | Error Location   | Easily identifiable           |
      | Focus Management | Moves to first error          |
      | Instructions     | Explains how to fix           |
    And form should remain usable with assistive tech

  @dynamic @live-regions
  Scenario: Dynamic content updates are properly announced
    When content changes occur in the following areas:
      | Region Type      | Update Frequency | Priority  |
      | Status messages  | As needed        | Polite    |
      | Error alerts     | Immediate        | Assertive |
      | Progress updates | Periodic         | Polite    |
    Then updates should be properly announced
    And ARIA live regions should be appropriately used

  @language
  Scenario: Page language is properly specified
    Then language attributes should be correctly set:
      | Element      | Attribute | Value |
      | HTML tag     | lang      | en    |
      | Main content | lang      | en    |
      | Translations | lang      | *     |
    And screen readers should use correct pronunciation
