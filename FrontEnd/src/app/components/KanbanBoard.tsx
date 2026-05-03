import React, { useState } from 'react';
import { GripVertical, Plus } from 'lucide-react';

interface KanbanItem {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
}

interface KanbanColumn {
  id: string;
  title: string;
  items: KanbanItem[];
  color?: string;
}

interface KanbanBoardProps {
  columns: KanbanColumn[];
  onItemMove?: (itemId: string, fromColumn: string, toColumn: string) => void;
}

export default function KanbanBoard({ columns: initialColumns, onItemMove }: KanbanBoardProps) {
  const [columns, setColumns] = useState(initialColumns);
  const [draggedItem, setDraggedItem] = useState<{ item: KanbanItem; columnId: string } | null>(null);

  const handleDragStart = (item: KanbanItem, columnId: string) => {
    setDraggedItem({ item, columnId });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetColumnId: string) => {
    if (!draggedItem) return;

    const { item, columnId: sourceColumnId } = draggedItem;

    if (sourceColumnId === targetColumnId) {
      setDraggedItem(null);
      return;
    }

    const newColumns = columns.map(column => {
      if (column.id === sourceColumnId) {
        return {
          ...column,
          items: column.items.filter(i => i.id !== item.id),
        };
      }
      if (column.id === targetColumnId) {
        return {
          ...column,
          items: [...column.items, item],
        };
      }
      return column;
    });

    setColumns(newColumns);
    onItemMove?.(item.id, sourceColumnId, targetColumnId);
    setDraggedItem(null);
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {columns.map(column => (
        <div
          key={column.id}
          className="flex-shrink-0 w-80"
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(column.id)}
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {column.color && (
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: column.color }}
                />
              )}
              <h3 className="font-semibold">{column.title}</h3>
              <span className="text-sm text-muted-foreground">
                ({column.items.length})
              </span>
            </div>
            <button className="p-1 hover:bg-accent rounded transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 min-h-[200px] bg-accent/30 rounded-xl p-3">
            {column.items.map(item => (
              <div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(item, column.id)}
                className="bg-card border border-border rounded-lg p-4 cursor-move hover:border-primary/50 transition-all hover:shadow-md"
              >
                <div className="flex items-start gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm mb-1">{item.title}</h4>
                    {item.description && (
                      <p className="text-xs text-muted-foreground mb-2">
                        {item.description}
                      </p>
                    )}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-xs rounded-md bg-accent text-accent-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
