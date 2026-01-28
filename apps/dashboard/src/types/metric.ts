export interface MetricEntity {
  id: string;
  siteId: string;
  createCollectionDate: string;
  collectionPeriodStart: string;
  collectionPeriodEnd: string;
  cruxData: Record<string, unknown>;
  createdAt: string;
}
