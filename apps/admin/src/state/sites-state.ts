import type { Site, CreateSiteDto, UpdateSiteDto } from "../types/site.js";
import * as sitesApi from "../services/sites.api.js";

type StateChangeCallback = () => void;

export class SitesState {
  private sites: Site[] = [];
  private isLoading = false;
  private error: string | null = null;
  private subscribers: Set<StateChangeCallback> = new Set();

  subscribe(callback: StateChangeCallback): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notify(): void {
    this.subscribers.forEach((callback) => callback());
  }

  getSites(): Site[] {
    return [...this.sites];
  }

  getLoading(): boolean {
    return this.isLoading;
  }

  getError(): string | null {
    return this.error;
  }

  async loadSites(): Promise<void> {
    this.isLoading = true;
    this.error = null;
    this.notify();

    try {
      this.sites = await sitesApi.getAllSites();
      this.error = null;
    } catch (err) {
      this.error =
        err instanceof Error ? err.message : "Ошибка при загрузке сайтов";
      this.sites = [];
    } finally {
      this.isLoading = false;
      this.notify();
    }
  }

  async createSite(data: CreateSiteDto): Promise<void> {
    this.isLoading = true;
    this.error = null;
    this.notify();

    try {
      const newSite = await sitesApi.createSite(data);
      this.sites = [newSite, ...this.sites];
      this.error = null;
    } catch (err) {
      this.error =
        err instanceof Error ? err.message : "Ошибка при создании сайта";
      throw err;
    } finally {
      this.isLoading = false;
      this.notify();
    }
  }

  async updateSite(id: string, data: UpdateSiteDto): Promise<void> {
    this.isLoading = true;
    this.error = null;
    this.notify();

    try {
      const updatedSite = await sitesApi.updateSite(id, data);
      this.sites = this.sites.map((site) =>
        site.id === id ? updatedSite : site,
      );
      this.error = null;
    } catch (err) {
      this.error =
        err instanceof Error ? err.message : "Ошибка при обновлении сайта";
      throw err;
    } finally {
      this.isLoading = false;
      this.notify();
    }
  }
}
