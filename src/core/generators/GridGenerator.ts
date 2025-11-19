import type { BaseModel } from '@/core/models/base';
import type { GridColumnConfig, GridToolbarConfig } from '@/core/types';
import { FieldType } from '@/core/types';

/**
 * Generador de configuración para DataGrid
 */
export class GridGenerator {
  /**
   * Genera la configuración de columnas para el DataGrid
   */
  static generateColumns(modelClass: typeof BaseModel): GridColumnConfig[] {
    const columns: GridColumnConfig[] = [];
    const fields = modelClass.getFields();

    for (const [fieldName, fieldConfig] of fields) {
      // Solo incluir campos marcados como visibles en grid
      if (fieldConfig.gridVisible !== false && fieldName !== 'id') {
        const column: GridColumnConfig = {
          field: fieldName,
          header: fieldConfig.label,
          width: fieldConfig.gridWidth || this.getDefaultWidth(fieldConfig.type),
          sortable: fieldConfig.gridSortable !== false,
          filterable: fieldConfig.gridFilterable !== false,
          type: fieldConfig.type,
          render: fieldConfig.gridRender || 'default'
        };

        // Configuración especial para ForeignKey
        if (fieldConfig.type === FieldType.ForeignKey && fieldConfig.relatedModel) {
          column.lookup = {
            dataSource: `${fieldConfig.relatedModel}Service`,
            displayField: fieldConfig.relatedField || 'nombre',
            valueField: 'id'
          };
        }

        columns.push(column);
      }
    }

    // Agregar columnas base comunes
    columns.push({
      field: 'created_at',
      header: 'Fecha Creación',
      width: 150,
      sortable: true,
      filterable: false,
      type: FieldType.DateTime,
      render: 'datetime'
    });

    columns.push({
      field: 'estatus',
      header: 'Estatus',
      width: 100,
      sortable: true,
      filterable: true,
      type: FieldType.Number,
      render: 'badge'
    });

    return columns;
  }

  /**
   * Genera la configuración del toolbar
   */
  static generateToolbar(modelName: string): GridToolbarConfig {
    return {
      items: [
        {
          type: 'add',
          text: `Agregar ${modelName}`,
          icon: 'Plus'
        },
        {
          type: 'delete',
          text: 'Eliminar Seleccionados',
          icon: 'Delete'
        },
        {
          type: 'refresh',
          text: 'Refrescar',
          icon: 'Refresh'
        },
        {
          type: 'export',
          text: 'Exportar',
          icon: 'Download'
        },
        {
          type: 'separator'
        },
        {
          type: 'search',
          placeholder: 'Buscar...',
          icon: 'Search'
        }
      ]
    };
  }

  /**
   * Obtiene el ancho por defecto según el tipo de campo
   */
  private static getDefaultWidth(fieldType: FieldType): number {
    const widthMap: Record<FieldType, number> = {
      [FieldType.String]: 200,
      [FieldType.Text]: 300,
      [FieldType.Number]: 100,
      [FieldType.Boolean]: 100,
      [FieldType.Date]: 120,
      [FieldType.DateTime]: 150,
      [FieldType.Image]: 100,
      [FieldType.File]: 150,
      [FieldType.Email]: 200,
      [FieldType.URL]: 250,
      [FieldType.ForeignKey]: 200,
      [FieldType.Select]: 150,
      [FieldType.MultiSelect]: 200
    };

    return widthMap[fieldType] || 150;
  }

  /**
   * Genera configuración de exportación
   */
  static generateExportConfig(modelClass: typeof BaseModel) {
    const columns = this.generateColumns(modelClass);
    
    return {
      fileName: `${modelClass.modelName}_${new Date().toISOString().split('T')[0]}`,
      columns: columns.map(col => ({
        field: col.field,
        header: col.header
      }))
    };
  }
}
