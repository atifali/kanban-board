import { useMemo, useState } from "react"
import PlusIcon from "../icons/PlusIcon"
import type { Column, Id } from "../types";
import ColumnContainer from "./ColumnContainer";
import { DndContext, DragOverlay, type DragStartEvent } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

function KanbanBoard() {
    const [columns, setColumns] = useState<Column[]>([]);
    const columnsId = useMemo(
        () => columns.map(column => column.id),
        [columns]);
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);

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

    function onDragStart(event: DragStartEvent) {
        console.log("DRAG START", event);
        if (event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current.column);
            return;
        }
    }

    return (
        <div className="m-auto flex min-h-screen w-full items-center
            overflow-x-auto overflow-y-hidden px-[40px]">
            <DndContext onDragStart={onDragStart}>
                <div className="m-auto flex gap-4">
                    <div className="flex gap-4">
                        <SortableContext items={columnsId}>
                            {columns.map((column) => (
                                <ColumnContainer key={column.id}
                                    column={column}
                                    deleteColumn={deleteColumn} />
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
                        />
                    )}
                </DragOverlay>, document.body)}
            </DndContext>
        </div>
    )
}

export default KanbanBoard