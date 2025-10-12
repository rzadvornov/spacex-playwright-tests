@responsive @ui
Feature: SpaceX Human Spaceflight Responsive Design
  As a user accessing the page on different devices
  I want the page to display correctly and be functional on all screen sizes
  So that I can have a seamless experience on mobile, tablet, and desktop

  Background:
    Given I am on the SpaceX Human Spaceflight homepage

  @smoke @responsive
  Scenario: Core responsive functionality verification
    Then the page should maintain responsive integrity:
      | Element       | Requirement                       |
      | Viewport      | Proper meta tag configuration     |
      | Media Queries | Breakpoint definitions active     |
      | Base Font     | Relative units (rem/em)           |
      | Container     | Fluid width with max-width limits |
      | Grid System   | Responsive grid implementation    |
    And responsive images should be properly configured:
      | Feature      | Implementation                    |
      | srcset       | Multiple resolution options       |
      | sizes        | Viewport-based image selection    |
      | lazy loading | Implemented for below-fold images |
      | aspect ratio | Preserved during scaling          |

  @mobile @layout
  Scenario Outline: Section-specific mobile adaptations
    When I view the "<Section>" on a mobile device with width "<Width>px"
    Then the section should meet mobile requirements:
      | Requirement   | Details                          |
      | Layout        | <Layout Pattern>                 |
      | Content Flow  | <Content Adaptation>             |
      | Touch Targets | Minimum 44x44px, easily tappable |
      | Text Size     | Minimum 16px base font size      |
      | Image Display | <Image Handling>                 |
      | Interaction   | Touch-optimized controls         |

    Examples:
      | Section    | Width | Layout Pattern   | Content Adaptation     | Image Handling             |
      | Navigation | 375   | Hamburger menu   | Collapsible overlay    | Logo scales appropriately  |
      | Hero       | 375   | Simplified stack | Critical content focus | Background image cropping  |
      | Media      | 375   | Single-slide     | Full-width tiles       | Optimized mobile delivery  |
      | Timeline   | 375   | Single card      | Full-width milestones  | Mobile-optimized visuals   |
      | Vehicles   | 375   | Vertical cards   | Stacked presentation   | Adjusted background sizing |
      | Footer     | 375   | Vertical stack   | Prioritized links      | Minimal imagery            |

  @mobile @interaction
  Scenario Outline: Device-specific interaction patterns
    When I interact with "<Element>" on "<Device>" with width "<Width>px"
    Then the interaction should follow device patterns:
      | Aspect         | Requirement         |
      | Input Method   | <Input Type>        |
      | Feedback       | <Feedback Type>     |
      | Response Time  | Under 100ms         |
      | Visual Cues    | Clear state changes |
      | Error Handling | <Error Feedback>    |

    Examples:
      | Element  | Device  | Width | Input Type     | Feedback Type  | Error Feedback    |
      | Menu     | Mobile  | 375   | Touch/Tap      | Overlay expand | Vibration+Visual  |
      | Carousel | Mobile  | 375   | Swipe          | Smooth scroll  | Bounce effect     |
      | Button   | Tablet  | 768   | Touch/Mouse    | Hover+Active   | Message overlay   |
      | Form     | Desktop | 1440  | Mouse/Keyboard | Focus states   | Inline validation |

  @breakpoints @layout
  Scenario Outline: Layout transitions at breakpoints
    When the viewport width changes from "<Start>" to "<End>" pixels
    Then the layout should adapt appropriately:
      | Element    | Start State   | End State   | Transition    |
      | Navigation | <Nav Start>   | <Nav End>   | Smooth        |
      | Grid       | <Grid Start>  | <Grid End>  | Responsive    |
      | Typography | <Text Start>  | <Text End>  | Fluid scaling |
      | Spacing    | <Space Start> | <Space End> | Proportional  |

    Examples:
      | Start | End  | Nav Start | Nav End  | Grid Start | Grid End  | Text Start | Text End  | Space Start | Space End |
      | 375   | 768  | Hamburger | Expanded | 1 column   | 2 columns | 16px base  | 18px base | 16px gaps   | 24px gaps |
      | 768   | 1440 | Expanded  | Full     | 2 columns  | 3 columns | 18px base  | 20px base | 24px gaps   | 32px gaps |

  @performance @responsive
  Scenario: Responsive performance validation
    Then responsive implementation should meet performance criteria:
      | Metric                | Target                 | Priority |
      | Layout Shifts         | CLS < 0.1              | Critical |
      | Resize Response       | Under 100ms            | High     |
      | Image Loading         | Progressive, optimized | High     |
      | Animation Performance | 60fps                  | Medium   |
    And responsive assets should be optimized:
      | Asset Type | Optimization Strategy          |
      | Images     | Responsive images, WebP format |
      | Fonts      | WOFF2, subset loading          |
      | CSS        | Critical inline, async rest    |
      | JS         | Progressive enhancement        |

  @accessibility @responsive
  Scenario: Responsive accessibility compliance
    Then the responsive design should maintain accessibility:
      | Feature          | Requirement                        | WCAG Level |
      | Text Scaling     | Supports 200% zoom                 | AA         |
      | Touch Targets    | Minimum 44x44px                    | AAA        |
      | Color Contrast   | Maintains 4.5:1 ratio at all sizes | AA         |
      | Focus Indicators | Visible at all viewport widths     | AA         |
    And device-specific accessibility features:
      | Device  | Feature               | Implementation     |
      | Mobile  | Touch gestures        | Simple, documented |
      | Tablet  | Orientation support   | Content reflows    |
      | Desktop | Keyboard navigation   | Logical tab order  |
      | All     | Screen reader support | Semantic HTML      |
  @media @responsive
  Scenario: Media adaptation across viewports
    Then images should meet responsive requirements:
      | Requirement | Mobile (375px)         | Tablet (768px)        | Desktop (1440px)      |
      | Resolution  | Optimized for device   | High-quality display  | Full resolution       |
      | Scaling     | Maintain aspect ratio  | Proportional scaling  | Original dimensions   |
      | Size        | Appropriate for screen | Balanced for viewport | Maximum quality       |
      | Loading     | Low-res first          | Progressive loading   | Optimal quality first |

  @typography @responsive
  Scenario Outline: Typography responsiveness validation
    When viewing content on "<Device>" with width "<Width>px"
    Then typography should meet readability standards:
      | Element     | Requirement         | Value            |
      | Base Size   | <Base Font>         | Minimum size     |
      | Line Height | <Line Height>       | Readable spacing |
      | Line Length | <Max Characters>    | Optimal reading  |
      | Font Scale  | Modular progression | Consistent ratio |

    Examples:
      | Device  | Width | Base Font | Line Height | Max Characters |
      | Mobile  | 375   | 16px      | 1.5         | 45 chars       |
      | Tablet  | 768   | 16px      | 1.6         | 75 chars       |
      | Desktop | 1440  | 18px      | 1.7         | 95 chars       |

  @orientation @responsive
  Scenario Outline: Orientation handling
    When device orientation changes to "<Orientation>" on "<Device>"
    Then the layout should adapt with requirements:
      | Element     | Requirement           | Validation              |
      | Content     | No cutoff or overflow | Visual inspection       |
      | Navigation  | <Nav Adaptation>      | Functional verification |
      | Images      | <Image Handling>      | Visual quality check    |
      | Performance | No degradation        | Response time check     |

    Examples:
      | Device | Orientation | Nav Adaptation    | Image Handling      |
      | Mobile | Landscape   | Collapse to menu  | Adjust aspect ratio |
      | Tablet | Portrait    | Show full nav     | Maintain quality    |
      | Tablet | Landscape   | Expand navigation | Optimize for width  |
