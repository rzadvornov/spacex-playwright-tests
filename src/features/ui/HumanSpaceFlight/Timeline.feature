@timeline
Feature: SpaceX Human Spaceflight Timeline Section
  As a space history enthusiast
  I want to see SpaceX's major milestones
  So that I can understand the company's progress toward making humanity multiplanetary

  Background:
    Given I am on the SpaceX Human Spaceflight homepage
    And I view the Timeline section

  @smoke @content
  Scenario: Timeline section displays essential content
    Then the Timeline section should display core elements:
      | Element       | Content                                    |
      | Heading       | The road to making humanity multiplanetary |
      | Carousel      | Interactive milestone cards                |
      | Navigation    | Arrows and pagination dots                 |
      | Horizon Image | Visual context at section top              |
    And each milestone card should contain:
      | Component   | Required Content           |
      | Year        | Clearly displayed date     |
      | Achievement | Descriptive milestone text |
      | Background  | Relevant mission imagery   |

  @milestones @data
  Scenario Outline: Timeline milestones validation
    When I view the "<Year>" milestone card
    Then it should display the following information:
      | Element     | Content                 |
      | Year        | <Year>                  |
      | Achievement | <Achievement>           |
      | Image       | <Related Image Content> |

    Examples:
      | Year | Achievement                                                    | Related Image Content |
      | 2008 | Falcon 1 becomes first privately deployed liquid fueled rocket | Falcon 1              |
      | 2012 | Dragon becomes first privately developed spacecraft            | Dragon                |
      | 2020 | SpaceX returns human spaceflight to the United States          | Crew Dragon           |
      | 2023 | Starship Super Heavy first test flight                         | Starship              |

  @navigation @interaction
  Scenario Outline: Timeline carousel navigation controls
    When I view the Timeline section with the "<Start>" milestone active
    And I click the "<Direction>" arrow
    Then the carousel should navigate to the "<Target>" milestone
    And the pagination dot on behalf of "<Target>" should be active

    Examples:
      | Start | Direction | Target |
      | 2008  | next      | 2010   |
      | 2010  | next      | 2012   |
      | 2012  | previous  | 2010   |
      | 2010  | previous  | 2008   |

  @pagination @interaction
  Scenario: Timeline pagination functionality
    Then pagination navigation should meet requirements:
      | Element       | Requirement                     |
      | Dot Count     | 12 (one per milestone)          |
      | Default State | First dot active                |
      | Visibility    | All dots clearly visible        |
      | Interaction   | Each dot individually clickable |
    When I interact with pagination:
      | Action         | Expected Result            |
      | Click 5th dot  | Shows 2016 milestone       |
      | Click 10th dot | Shows first 2021 milestone |
      | Click 1st dot  | Returns to 2008            |

  @visual @styling
  Scenario: Timeline visual presentation
    Then the timeline should meet visual standards:
      | Element       | Requirement                   | Details             |
      | Card Images   | Background for each milestone | Mission-specific    |
      | Horizon Image | Top section visual            | Sets context        |
      | Arrow Buttons | Consistent styling            | Clear interaction   |
      | Card Layout   | Clean presentation            | Text over image     |
      | Visual Flow   | Left to right progression     | Chronological order |

  @responsive @layout
  Scenario Outline: Timeline responsive design
    When viewing on "<Device>" with width "<Width>px"
    Then the timeline should adapt appropriately:
      | Element       | Requirement           |
      | Card Width    | <Card Layout>         |
      | Navigation    | <Navigation Style>    |
      | Touch Targets | Minimum 44x44px       |
      | Text Scaling  | Readable without zoom |
      | Visual Flow   | <Visual Pattern>      |

    Examples:
      | Device  | Width | Card Layout   | Navigation Style    | Visual Pattern    |
      | Mobile  | 375   | Full width    | Touch-optimized     | Vertical scroll   |
      | Tablet  | 768   | Partial width | Standard with touch | Horizontal scroll |
      | Desktop | 1440  | Fixed width   | Standard controls   | Horizontal scroll |

  @accessibility @a11y
  Scenario: Timeline section accessibility
    Then the timeline section should meet accessibility standards:
      | Element        | Requirement                                      |
      | Navigation     | Keyboard navigable with arrow keys               |
      | Button Labels  | Clear ARIA labels for screen readers             |
      | Focus States   | Visible focus indicators on interactive elements |
      | Color Contrast | WCAG 2.1 AA compliant text contrast              |
      | Alt Text       | Descriptive alt text for milestone images        |
    And users should be able to navigate through milestones using:
      | Method        | Expected Behavior                  |
      | Arrow Keys    | Move between milestone cards       |
      | Tab Key       | Focus through interactive elements |
      | Screen Reader | Announce milestone content clearly |
      | Voice Control | Navigate using voice commands      |

  @visual @media
  Scenario: Visual consistency and media handling
    Then timeline media elements should meet quality standards:
      | Element        | Requirement             | Validation               |
      | Card Images    | Load successfully       | No broken images         |
      | Image Quality  | High resolution         | Clear at all breakpoints |
      | Image Opacity  | Consistent across cards | Matches design specs     |
      | Loading States | Graceful image loading  | Placeholder during load  |
    And layout consistency should be maintained:
      | Element         | Requirement                 | Measurement                 |
      | Card Width      | Uniform across timeline     | Match design specifications |
      | Card Height     | Consistent for all cards    | Equal height all cards      |
      | Card Spacing    | Even gaps between cards     | Uniform horizontal spacing  |
      | Content Padding | Consistent internal spacing | Equal padding all sides     |

  @typography @readability
  Scenario: Typography and readability standards
    Then text elements should meet readability requirements:
      | Element           | Font Properties       | Contrast Requirements       |
      | Year Display      | Bold, minimum 24px    | 7:1 ratio with background   |
      | Achievement Text  | Regular, minimum 16px | 4.5:1 ratio with background |
      | Navigation Labels | Medium, minimum 14px  | 4.5:1 ratio with background |
    And text handling should be robust:
      | Scenario          | Requirement             | Validation                |
      | Long Content      | Proper text wrapping    | No overflow or truncation |
      | Different Lengths | Consistent card heights | Flexible container sizing |
      | Language Support  | Unicode compatibility   | Proper character display  |
      | Font Loading      | FOUT/FOIT handling      | Smooth font transitions   |

  @performance @optimization
  Scenario: Timeline performance optimization
    Then the timeline should meet performance targets:
      | Metric             | Target                   | Priority |
      | Initial Load       | Under 2s                 | High     |
      | Image Loading      | Progressive, lazy loaded | High     |
      | Scroll Performance | 60fps smooth scrolling   | Medium   |
      | Memory Usage       | Under 50MB for section   | Medium   |
    And resource optimization should be verified:
      | Resource Type  | Optimization Strategy    | Validation               |
      | Images         | WebP format, responsive  | Correct size delivery    |
      | Animations     | CSS-based where possible | CPU/GPU usage monitoring |
      | Event Handlers | Debounced scroll/resize  | Performance profiling    |
      | DOM Updates    | Batched when navigating  | Frame rate monitoring    |