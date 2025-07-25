import { useMemo, useState } from "react"
import PlusIcon from "../icons/PlusIcon"
import type { Column, Id } from "../types";
import ColumnContainer from "./ColumnContainer";
import { DndContext, DragOverlay, PointerSensor, useSensors, useSensor, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

function KanbanBoard() {
    const [columns, setColumns] = useState<Column[]>([]);
    const columnsId = useMemo(
        () => columns.map(column => column.id),
        [columns]);
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3,
            }
        })
    );

    function createNewColumn() {
        const columnToAdd: Column = {
            id: Date.now(),
            title: `Column ${columns.length + 1}`,
        };
        setColumns([...columns, columnToAdd]);
    }

    function deleteColumn(id: Id) {
        const filteredColumns = columns.filter(
            (column) => column.id !== id
        );
        setColumns(filteredColumns);
    }

    function updateColumn(id: Id, title: string) {
        const newColumns = columns.map(
            column => {
                if (column.id !== id) return column;
                return { ...column, title }
            }
        );
        setColumns(newColumns);
    }

    function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current.column);
            return;
        }
    }

    function onDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over) return;
        const activeColumnId = active.id;
        const overColumnId = over.id;
        if (activeColumnId === overColumnId) return;
        setColumns(columns => {
            const activeColumnIndex = columns.findIndex(column =>
                column.id === activeColumnId);
            const overColumnIndex = columns.findIndex(column =>
                column.id === overColumnId);
            return arrayMove(columns, activeColumnIndex, overColumnIndex);
        });
    }

    return (
        <div className="m-auto flex min-h-screen w-full items-center
            overflow-x-auto overflow-y-hidden px-[40px]">
            <DndContext
                sensors={sensors}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
            >
                <div className="m-auto flex gap-4">
                    <div className="flex gap-4">
                        <SortableContext items={columnsId}>
                            {columns.map((column) => (
                                <ColumnContainer key={column.id}
                                    column={column}
                                    deleteColumn={deleteColumn}
                                    updateColumn={updateColumn} />
                            ))}
                        </SortableContext>
                    </div>
                    <button className="h-[60px] w-[350px] min-w-[350px] 
                    cursor-pointer rounded-lg bg-gray-900 
                    border-2 border-gray-800 p-4 
                    ring-rose-500 hover:ring-2 flex gap-2"
                        onClick={createNewColumn}>
                        <PlusIcon />
                        Add Column
                    </button>
                </div>
                {createPortal(<DragOverlay>
                    {activeColumn && (
                        <ColumnContainer
                            column={activeColumn}
                            deleteColumn={deleteColumn}
                            updateColumn={updateColumn}
                        />
                    )}
                </DragOverlay>, document.body)}
            </DndContext>
        </div>
    )
}

export default KanbanBoard