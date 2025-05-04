export interface TileProps {
  index: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  onDelete?: () => void;
  onClone?: () => void;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  Icon?: React.ReactNode;
  overlapping?: boolean;
  isDraggable?: boolean;
  isResizable?: boolean;
  isBounded?: boolean;
  isDroppable?: boolean;
  locked?: boolean;
  isStatic?: boolean;
  Title?: string;
  children: React.ReactNode;
}

export const tile = ({ index, children }: TileProps) => {
  return (
    <div className="h-full w-full" key={index}>
      {children}
    </div>
  );
};

/*

<div
          key="4"
          data-grid={{
            x: 8,
            y: 0,
            w: 4,
            h: 3
          }}
        >
          <span className="text">
            4 - Draggable with Handle
            <hr />
            <hr />
            <span className="react-grid-dragHandleExample">[DRAG HERE]</span>
            <hr />
            <hr />
          </span>
        </div>

*/
