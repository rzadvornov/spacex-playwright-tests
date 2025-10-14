@vehicles @humanSpaceflight @ui
Feature: SpaceX Human Spaceflight - Vehicle Information
  As a potential space traveler or researcher
  I want to learn about SpaceX's spacecraft and research opportunities
  So that I can understand their capabilities and potential applications

  Background:
    Given I am on the SpaceX Human Spaceflight homepage
    And I am viewing the Vehicles section

  @smoke @content
  Scenario: Vehicle section displays essential components
    Then the Vehicle section should display core elements:
      | Element         | Content                        |
      | Section Title   | Our Vehicles                   |
      | Vehicle Cards   | Dragon, Starship               |
      | Research Card   | Development opportunities      |
      | Media Elements  | Images or videos for each card |
      | Call-to-Actions | Learn more buttons             |

  @vehicles @content
  Scenario Outline: Vehicle information cards validation
    When I locate the "<Vehicle>" card
    Then the card should display the following information:
      | Element     | Content        |
      | Title       | <Title>        |
      | Description | <Description>  |
      | Media Type  | <Media>        |
      | Learn More  | Link to <Path> |

    Examples:
      | Vehicle  | Title    | Description                                | Media | Path               |
      | Dragon   | Dragon   | capable of carrying up to 7 passengers     | Video | /vehicles/dragon   |
      | Starship | Starship | fully reusable spacecraft and second stage | Image | /vehicles/starship |

  @research @content
  Scenario: Research development opportunities presentation
    Then the research card should display the following:
      | Element     | Content                                                      |
      | Title       | Develop your research                                        |
      | Description | SpaceX is looking for exceptional science and research ideas |
      | Link        | /humanspaceflight/research                                   |
      | Media       | Background image showing research activities                 |
    And the research card should emphasize:
      | Aspect     | Details                                    |
      | Innovation | Cutting-edge research opportunities        |
      | Access     | Space-based research platform availability |
      | Support    | Technical and operational assistance       |

  @navigation @interaction
  Scenario Outline: Interactive elements functionality
    When I interact with the "<Element>" on the "<Card>" card
    Then the interaction should result in "<Action>"
    And the system should respond with "<Response>"

    Examples:
      | Card     | Element    | Action         | Response                       |
      | Dragon   | Learn More | Click          | Navigate to /vehicles/dragon   |
      | Starship | Learn More | Click          | Navigate to /vehicles/starship |
      | Research | Learn More | Click          | Navigate to /research          |
      | Dragon   | Video      | Play           | Start video playback           |
      | Dragon   | Card       | Hover          | Show hover state               |
      | Starship | Card       | Touch (mobile) | Show touch feedback            |

  @responsive @layout
  Scenario Outline: Responsive layout adaptation
    When viewing on "<Device>" with width "<Width>px"
    Then the vehicle cards should adapt:
      | Element        | Behavior                        |
      | Card Layout    | <Layout>                        |
      | Media Position | <Media Position>                |
      | Text Size      | <Text Scaling>                  |
      | Touch Targets  | Minimum 44x44px for interaction |
      | Spacing        | <Spacing>                       |

    Examples:
      | Device  | Width | Layout     | Media Position | Text Scaling | Spacing         |
      | Mobile  | 375   | Vertical   | Top            | 16-18px base | 24px vertical   |
      | Tablet  | 768   | Grid       | Side           | 18-20px base | 32px grid       |
      | Desktop | 1440  | Horizontal | Side           | 20-24px base | 48px horizontal |

  @accessibility @a11y
  Scenario: Accessibility compliance
    Then all vehicle cards should meet accessibility standards:
      | Feature        | Requirement                        | Success Criteria |
      | Headings       | Proper heading hierarchy (h1-h6)   | WCAG 2.1.1       |
      | Focus Order    | Logical tab sequence               | WCAG 2.4.3       |
      | Media Controls | Keyboard-accessible video controls | WCAG 2.1.1       |
      | Alt Text       | Descriptive text for all images    | WCAG 1.1.1       |
      | Color Contrast | Text meets contrast requirements   | WCAG 1.4.3       |
    And interactive elements should be accessible via:
      | Method        | Expected Behavior                  |
      | Keyboard      | Full navigation without mouse      |
      | Screen Reader | Announce content and state changes |
      | Voice Control | Support for voice commands         |
      | Touch         | Adequate target size and spacing   |

  @performance @optimization
  Scenario: Vehicle section performance validation
    Then the vehicle section should meet performance metrics:
      | Metric                | Requirement        | Priority |
      | Image Loading         | Lazy loading       | High     |
      | Video Loading         | On-demand playback | High     |
      | Animation Performance | 60fps smooth       | Medium   |
      | Memory Usage          | Below 50MB         | Medium   |
    And media optimization should be verified:
      | Media Type | Optimization                         |
      | Images     | WebP/AVIF format, properly sized     |
      | Videos     | Compressed, multiple quality options |
      | Animations | CSS-based where possible             |
      | Icons      | SVG or icon font for scalability     |
    And resource loading should be prioritized:
      | Resource       | Loading Strategy                      |
      | Hero Images    | Preload                               |
      | Videos         | Defer until visible                   |
      | Fonts          | Swap during load                      |
      | Scripts        | Async when possible                   |
      | Alt Text       | Descriptive text for all images       |
      | Color Contrast | WCAG 2.1 AA compliant (4.5:1 minimum) |
    And interactive elements should support:
      | Interaction   | Expected Behavior                     |
      | Keyboard      | Full navigation without mouse         |
      | Screen Reader | Clear announcement of content         |
      | Voice Control | Ability to activate all buttons       |
      | High Contrast | Visible in Windows High Contrast mode |