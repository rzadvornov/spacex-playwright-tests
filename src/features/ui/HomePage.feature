@homepage @ui
Feature: SpaceX HomePage Load and Navigation
  As a website visitor
  I want the HomePage to load correctly and be easily navigable
  So that I can access SpaceX's main landing page and current content effectively

  Background:
    Given I am on the SpaceX HomePage

  @smoke @load
  Scenario: HomePage initial load verification
    Then the page should meet core requirements:
      | Element      | Requirement                  |
      | Load Time    | Complete within 5 seconds    |
      | Page Title   | "SpaceX"                     |
      | Hero Section | Visible with current mission |
      | Navigation   | Header menu accessible       |
      | Layout       | Matches design snapshot      |
    And critical content should be present:
      | Content Type     | Details                       |
      | Mission Title    | Latest mission name displayed |
      | Mission Status   | Current status indicator      |
      | Call-to-Action   | Primary action button visible |
      | Scroll Indicator | Down arrow animation present  |
    And the page should match the snapshot "homepage_initial_load"  

  @navigation @header
  Scenario: Header navigation structure validation
    Then the navigation menu should contain:
      | Primary Links     | Secondary Elements       | Functionality        |
      | Vehicles          | SpaceX Logo              | Homepage redirect    |
      | Launches          | Upcoming Launches Widget | Live update display  |
      | Human Spaceflight | Search Icon              | Search functionality |
      | Rideshare         | Language Selector        | Language switching   |
      | Starlink          | Mobile Menu Button       | Responsive toggle    |
      | Starshield        | Shop Cart                | Shopping access      |
      | Company           |                          |                      |
      | Shop              |                          |                      |

  @navigation @interaction
  Scenario Outline: Navigation link functionality
    When I click on the "<Link>" navigation item
    Then I should be redirected to the corresponding page:
      | Element    | Value           |
      | URL Path   | <Expected Path> |
      | Page Title | <Page Title>    |
      | Status     | 200 OK          |

    Examples:
      | Link              | Expected Path      | Page Title         |
      | Vehicles          | /vehicles          | SpaceX Vehicles    |
      | Launches          | /launches          | SpaceX Launches    |
      | Human Spaceflight | /human-spaceflight | Human Spaceflight  |
      | Rideshare         | /rideshare         | SmallSat Rideshare |
      | Starlink          | /starlink          | Starlink           |
      | Shop              | /shop              | SpaceX Shop        |

  @cta @interaction
  Scenario Outline: Call-to-action functionality
    When I interact with the "<CTA Type>" button
    Then the system should respond with "<Action>"
    And the result should match "<Expected Outcome>"

    Examples:
      | CTA Type     | Action | Expected Outcome                    |
      | Learn More   | Click  | Navigate to current mission details |
      | Watch Launch | Click  | Open video player                   |
      | Shop Now     | Click  | Redirect to shop                    |
      | Scroll Down  | Click  | Smooth scroll to next section       |

  @responsive @mobile
  Scenario Outline: Mobile menu responsiveness
    When viewing on "<Device>" with width "<Width>px"
    Then the mobile menu should function appropriately:
      | Element        | State            | Behavior                    |
      | Hamburger Icon | <Menu Icon>      | Toggles menu visibility     |
      | Navigation     | <Nav Display>    | Expands/collapses correctly |
      | Links          | <Link Style>     | Touch-optimized targets     |
      | Close Button   | <Close Behavior> | Collapses menu properly     |

    Examples:
      | Device   | Width | Menu Icon | Nav Display | Link Style | Close Behavior  |
      | Mobile S | 320   | Visible   | Vertical    | Full width | Top right fixed |
      | Mobile L | 425   | Visible   | Vertical    | Full width | Top right fixed |
      | Tablet   | 768   | Hidden    | Horizontal  | Inline     | Not needed      |

  @performance @metrics
  Scenario: Performance metrics validation
    Then the page should meet performance standards:
      | Metric                   | Threshold | Priority |
      | Largest Contentful Paint | 4000ms    | High     |
      | First Input Delay        | 100ms     | High     |
      | Cumulative Layout Shift  | 0.1       | Medium   |
      | Time to Interactive      | 5000ms    | Medium   |
    And technical requirements should be met:
      | Requirement      | Details                      |
      | Console Errors   | None present                 |
      | Resource Loading | All assets load successfully |
      | Memory Usage     | Below 100MB on initial load  |
      | Network Requests | Optimized and minimized      |

  @seo @metadata
  Scenario: SEO implementation verification
    Then the page metadata should be properly configured:
      | Element       | Content                                      | Purpose                |
      | Title         | SpaceX                                       | Browser/Search display |
      | Description   | SpaceX designs, manufactures and launches... | Search preview         |
      | Keywords      | space, spacex, falcon, starship, launches    | Search relevance       |
      | Viewport      | width=device-width, initial-scale=1          | Responsive design      |
      | Canonical URL | https://www.spacex.com/                      | SEO optimization       |
    And social media tags should be present:
      | Platform     | Tags                       | Content            |
      | Open Graph   | og:title, og:description   | SpaceX content     |
      | Twitter Card | twitter:card, twitter:site | Summary with image |
      | Schema.org   | Organization, WebSite      | Structured data    |

  @accessibility @a11y
  Scenario: Accessibility compliance verification
    Then the page should meet WCAG 2.1 AA standards:
      | Category       | Requirement                 | Success Criteria |
      | Perceivable    | Proper color contrast       | 4.5:1 minimum    |
      | Operable       | Keyboard navigation support | Full access      |
      | Understandable | Consistent navigation       | Clear structure  |
      | Robust         | Valid HTML5                 | No major errors  |
    And assistive technology support should be verified:
      | Technology     | Feature                       | Expected Behavior   |
      | Screen Readers | ARIA labels and landmarks     | Clear announcement  |
      | Keyboard       | Focus indicators              | Visible highlights  |
      | Voice Control  | Interactive element support   | Proper recognition  |
      | High Contrast  | Text and component visibility | Sufficient contrast |