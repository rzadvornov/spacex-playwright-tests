import { Page, Locator} from "@playwright/test";
import { SpaceXPage } from "../base/SpaceXPage";

export class UpdatesPage extends SpaceXPage {
  readonly updatesFeed: Locator;
  readonly updateCards: Locator;
  readonly categoryFilter: Locator;
  readonly searchField: Locator;
  readonly searchResults: Locator;
  readonly statisticsPanel: Locator;
  readonly archiveTool: Locator;
  readonly paginationControls: Locator;
  readonly loadMoreButton: Locator;
  readonly socialShareButtons: Locator;
  readonly fullUpdatePage: Locator;

  constructor(page: Page) {
    super(page);

    this.updatesFeed = page.locator('[data-testid="updates-feed"], .updates-feed, .news-feed').first();
    this.updateCards = page.locator('[data-testid="update-card"], .update-card, .news-item, article').first();
    this.categoryFilter = page.locator('[data-testid="category-filter"], .category-filter, .filter-options').first();
    this.searchField = page.locator('[data-testid="search-updates"], input[placeholder*="search"], input[name*="search"]').first();
    this.searchResults = page.locator('[data-testid="search-results"], .search-results, .results-container').first();
    this.statisticsPanel = page.locator('[data-testid="statistics-panel"], .statistics-panel, .stats-container').first();
    this.archiveTool = page.locator('[data-testid="archive-tool"], .archive-tool, .date-picker').first();
    this.paginationControls = page.locator('[data-testid="pagination"], .pagination-controls, .pagination').first();
    this.loadMoreButton = page.locator('[data-testid="load-more"], .load-more, button:has-text("Load More")').first();
    this.socialShareButtons = page.locator('[data-testid="social-share"], .social-share, .share-buttons').first();
    this.fullUpdatePage = page.locator('[data-testid="full-update"], .full-update, .update-detail').first();
  }

  async navigateToUpdatesPage(urlPath: string = "/updates"): Promise<void> {
    this.setupErrorListeners();
    await this.open(urlPath);
    await this.waitForAppContentLoad();
  }

  async waitForUpdatesLoad(): Promise<void> {
    await this.waitForAppContentLoad();
    await this.updatesFeed.waitFor({ state: 'visible' });
  }

  async getUpdateCardsCount(): Promise<number> {
    return await this.updateCards.count();
  }

  async isUpdatesFeedVisible(): Promise<boolean> {
    return await this.updatesFeed.isVisible();
  }

  async getFirstUpdateCard(): Promise<Locator> {
    return this.updateCards.first();
  }

  async getUpdateCardInfo(index: number = 0): Promise<{ date: string; title: string; summary: string }> {
    const card = this.updateCards.nth(index);
    const date = await card.locator('[data-testid="update-date"], .date, time').textContent() || '';
    const title = await card.locator('[data-testid="update-title"], .title, h2, h3').textContent() || '';
    const summary = await card.locator('[data-testid="update-summary"], .summary, .excerpt, p').first().textContent() || '';
    
    return { date: date.trim(), title: title.trim(), summary: summary.trim() };
  }

  async areUpdatesInReverseChronologicalOrder(): Promise<boolean> {
    const count = await this.getUpdateCardsCount();
    if (count < 2) return true;

    const dates: Date[] = [];
    
    for (let i = 0; i < Math.min(count, 5); i++) {
      const card = this.updateCards.nth(i);
      const dateText = await card.locator('[data-testid="update-date"], .date, time').getAttribute('datetime') || 
                      await card.locator('[data-testid="update-date"], .date, time').textContent() || '';
      
      if (dateText) {
        const date = new Date(dateText);
        if (!isNaN(date.getTime())) {
          dates.push(date);
        }
      }
    }

    for (let i = 1; i < dates.length; i++) {
      if (dates[i] > dates[i - 1]) {
        return false;
      }
    }
    
    return dates.length > 0;
  }

  async searchUpdates(searchTerm: string): Promise<void> {
    await this.searchField.fill(searchTerm);
    await this.searchField.press('Enter');
    await this.page.waitForTimeout(500);
  }

  async getSearchResultsCount(): Promise<number> {
    const results = this.searchResults.locator('[data-testid="update-card"], .update-card, article');
    return await results.count();
  }

  async getNoResultsMessage(): Promise<string> {
    const message = this.searchResults.locator('.no-results, .no-matches, .empty-state');
    return await message.textContent() || '';
  }

  async filterByCategory(categoryName: string): Promise<void> {
    const filterButton = this.categoryFilter.getByRole('button', { name: categoryName });
    await filterButton.click();
    await this.page.waitForTimeout(500);
  }

  async getActiveFilter(): Promise<string> {
    const activeFilter = this.categoryFilter.locator('[aria-selected="true"], .active, .selected');
    return await activeFilter.textContent() || '';
  }

  async clickUpdateTitle(index: number = 0): Promise<void> {
    const titleLink = this.updateCards.nth(index).locator('a, [data-testid="update-title"]');
    await titleLink.click();
  }

  async isFullUpdatePageVisible(): Promise<boolean> {
    return await this.fullUpdatePage.isVisible();
  }

  async getFullUpdateText(): Promise<string> {
    return await this.fullUpdatePage.textContent() || '';
  }

  async getStatisticsMetrics(): Promise<{ [key: string]: number }> {
    const metrics: { [key: string]: number } = {};
    const metricElements = this.statisticsPanel.locator('[data-testid="metric"], .metric, .stat-item');
    
    const count = await metricElements.count();
    for (let i = 0; i < count; i++) {
      const element = metricElements.nth(i);
      const label = await element.locator('[data-testid="metric-label"], .label, .name').textContent() || '';
      const valueText = await element.locator('[data-testid="metric-value"], .value, .number').textContent() || '';
      const value = parseInt(valueText.replace(/,/g, '')) || 0;
      
      if (label) {
        metrics[label.trim().toLowerCase()] = value;
      }
    }
    
    return metrics;
  }

  async loadMoreUpdates(): Promise<void> {
    await this.loadMoreButton.click();
    await this.page.waitForTimeout(1000);
  }

  async getSocialShareOptions(): Promise<string[]> {
    const options: string[] = [];
    const shareButtons = this.socialShareButtons.locator('a, button');
    
    const count = await shareButtons.count();
    for (let i = 0; i < count; i++) {
      const button = shareButtons.nth(i);
      const platform = await button.getAttribute('aria-label') || 
                      await button.textContent() || 
                      await button.getAttribute('title') || '';
      if (platform) {
        options.push(platform.trim().toLowerCase());
      }
    }
    
    return options;
  }

  async hasMultimediaContent(): Promise<boolean> {
    const multimedia = this.fullUpdatePage.locator('img, video, iframe, [data-testid="media"]');
    return await multimedia.count() > 0;
  }

  async findUpdateByKeyword(keyword: string): Promise<boolean> {
    const count = await this.getUpdateCardsCount();
    
    for (let i = 0; i < count; i++) {
      const card = this.updateCards.nth(i);
      const text = await card.textContent() || '';
      if (text.toLowerCase().includes(keyword.toLowerCase())) {
        return true;
      }
    }
    
    return false;
  }

  async getCrewMembers(): Promise<{ role: string; name: string }[]> {
    const crew: { role: string; name: string }[] = [];
    const crewSection = this.page.locator('[data-testid="crew"], .crew-section, .team-members');
    const crewItems = crewSection.locator('[data-testid="crew-member"], .crew-member, .team-member');
    
    const count = await crewItems.count();
    for (let i = 0; i < count; i++) {
      const item = crewItems.nth(i);
      const role = await item.locator('[data-testid="role"], .role, .position').textContent() || '';
      const name = await item.locator('[data-testid="name"], .name, .member-name').textContent() || '';
      
      if (role && name) {
        crew.push({ role: role.trim(), name: name.trim() });
      }
    }
    
    return crew;
  }

  async getMissionDetails(): Promise<{ [key: string]: string }> {
    const details: { [key: string]: string } = {};
    const detailSection = this.page.locator('[data-testid="mission-details"], .mission-details, .details-grid');
    const detailItems = detailSection.locator('[data-testid="detail"], .detail-item, .info-row');
    
    const count = await detailItems.count();
    for (let i = 0; i < count; i++) {
      const item = detailItems.nth(i);
      const label = await item.locator('[data-testid="label"], .label, .field').textContent() || '';
      const value = await item.locator('[data-testid="value"], .value, .info').textContent() || '';
      
      if (label && value) {
        details[label.trim().toLowerCase()] = value.trim();
      }
    }
    
    return details;
  }
}