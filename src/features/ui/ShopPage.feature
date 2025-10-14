@shop @ecommerce @high-priority
Feature: Browse and Purchase SpaceX Merchandise
  As a SpaceX enthusiast or customer
  I want to easily browse, search, and purchase official merchandise
  So that I can own items related to my favorite space programs.

  Background:
    Given a user navigates to the Shop homepage

  @shop @browsing @navigation
  Scenario: View Shop Homepage and Navigation Elements
    When the page loads initially
    Then the user should see featured merchandise products prominently displayed
    And all major **product categories** should be clearly visible and accessible
    And a **search functionality** (search bar) should be available
    And the page should match the snapshot "shop_initial_load"

  @shop @browsing @categories
  Scenario Outline: Browse and Filter Products by Category
    When the user views the product categories
    Then the following product categories <Category Name> should be displayed:
    And when the user clicks on <Category Name>
    Then only products belonging to the <Category Name> category should be displayed
    And the total count of filtered products should be shown
    Examples:
      | Category Name                |
      | Apparel                      |
      | Accessories                  |
      | Mission Patches/Collectibles |
      | Vehicle Models/Merchandise   |
      | Home and Office Items        |

  @shop @browsing @search
  Scenario: Search for Specific Products
    When the user enters the search term "Starship" into the search field
    Then matching products should be displayed
    And each search result should include the product name, image, and price
    And if no matching results are found, a suggestion to **browse categories** should appear

  @shop @browsing @sort
  Scenario: Sort Products by Different Criteria
    When the user selects the sort option "Price (High to Low)"
    Then products should be immediately re-sorted by price from highest to lowest
    And the available sorting criteria should include:
      | Sorting Criteria       | 
      | Price (low/high)       | 
      | Newest Arrivals        | 
      | Popularity/Bestsellers | 
      | Alphabetical           |

  @shop @product @details
  Scenario: View Product Details Page
    When the user clicks on a product named "Falcon 9 Crew Jacket"
    Then the product detail page should load successfully
    And the page should display **multiple high-quality product images**
    And detailed product description, price, and current availability should be shown

  @shop @product @options
  Scenario: Select Product Options and Update Availability
    Given a user is on the "Falcon 9 Crew Jacket" detail page
    When the user selects the "Large" size and "Black" color option
    Then the selection should be accurately reflected in the product display
    And if the chosen size/color is out of stock, a corresponding **"Out of Stock"** message should update instantly

  @shop @cart @add
  Scenario: Add Product to Shopping Cart
    Given a user is on a product detail page with all options selected
    When the user clicks the "Add to Cart" button
    Then the product should be successfully added to the shopping cart
    And a confirmation message (e.g., "Item added to cart") should appear
    And the **cart icon's item count** should update accordingly

  @shop @cart @view
  Scenario: View and Modify Shopping Cart Contents
    Given a user has multiple items in their cart
    When the user clicks on the cart icon or navigates to the Cart page
    Then the cart page should display:
      | Cart Content Detail     | Status            |
      | List of all items       | Must be shown     |
      | Quantity per item       | Must be shown     |
      | Unit price and Subtotal | Must be shown     |
      | Option to remove item   | Must be available |

  @shop @cart @update
  Scenario: Update Cart Quantities and Recalculate Total
    When the user modifies the quantity of an item from 1 to 3
    Then the quantity field should update successfully
    And the cart's **subtotal and grand total** should recalculate instantly
    And the quantity change should be saved automatically without requiring a separate "save" action

  @shop @cart @discount
  Scenario: Apply Valid Discount Codes
    Given the cart subtotal is $100
    When the user enters a valid promotional code "SPACEX20" and clicks "Apply"
    Then the discount should be successfully applied
    And the **cart total should reflect the 20% discount** ($80)
    And a confirmation message showing the discount amount should be displayed

  @shop @checkout @navigation
  Scenario: Proceed to Checkout
    Given a user has items in the cart
    When the user clicks the "Checkout" button
    Then the checkout page should load securely (HTTPS/SSL/TLS)
    And the user should be prompted with options to **sign in or proceed as a guest**

  @shop @checkout @shipping
  Scenario: Enter Shipping Information and Select Method
    Given a user is providing shipping details
    When the user enters a valid address and reviews shipping options
    Then the system should display shipping methods with:
      | Shipping Detail       | Status            |
      | Estimated Timeframes  | Must be shown     |
      | Shipping Costs        | Must be shown     |
      | Tracking Availability | Must be indicated |
    And the user must be able to select a method, and the **shipping cost must be added to the total**

  @shop @checkout @payment
  Scenario: Enter Payment Information
    When the user reaches the payment section
    Then the following payment options should be available:
      | Payment Method     | Status                                     |
      | Credit/Debit Cards | Must be available                          |
      | Digital Wallets    | Must be available (e.g., PayPal/Apple Pay) |
    And the payment form should ensure **data security and field validation** (e.g., card number length, CVC check)

  @shop @checkout @review
  Scenario: Review Final Order Details
    When the user reaches the final order review step
    Then the page should display a complete summary of:
      | Order Summary Detail          | Status                     |
      | All items and Quantities      | Must be accurate           |
      | Subtotal, Shipping, and Taxes | Must be itemized           |
      | Grand Total Payable           | Must be accurate and final |
      | Delivery Address and Method   | Must be confirmed          |

  @shop @checkout @place-order
  Scenario: Place Order and Receive Confirmation
    When the user clicks the "Place Order" button
    Then the payment should be successfully processed
    And an **order confirmation page** should immediately display the order number
    And a **confirmation email** containing the order details should be sent to the user's provided email address

  @shop @post-sale @tracking
  Scenario: Track Placed Order Status
    Given a user accesses the order tracking feature for a recently placed order
    When the user enters the order number
    Then the order status should be clearly displayed (e.g., "Processing," "Shipped," or "Delivered")
    And a **trackable shipping number and carrier link** (if shipped) should be provided

  @shop @post-sale @support
  Scenario: Contact Customer Support for Orders/Products
    When the user looks for support options
    Then dedicated contact options should be available:
      | Support Option     | Status           |
      | Help Email Address | Must be provided |
      | Contact Form Link  | Must be provided |
      | FAQ Section Link   | Must be provided |
    And the page should indicate **expected support response timeframes**
