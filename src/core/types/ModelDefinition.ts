export enum ViewType {
  Table = 'table',
  CardGrid = 'card-grid'
}

export interface ModelDefinition {
  modelName: string;
  endpoint: string;
  displayField: string;
  icon?: string;
  hasSeo?: boolean;
  viewType?: ViewType;
}
