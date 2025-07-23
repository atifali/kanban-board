import { useState } from "react"
import PlusIcon from "../icons/PlusIcon"
import type { Column } from "../types";
import ColumnContainer from "./ColumnContainer";

function KanbanBoard() {
    const [columns, setColumns] = useState<Column[]>([]);
    function createNewColumn() {
        const columnToAdd: Column = {
            id: Date.now(),
            title: `Column ${columns.length + 1}`,
        };
        setColumns([...columns, columnToAdd]);
    }

    return (
        <div className="m-auto flex min-h-screen w-full items-center
            overflow-x-auto overflow-y-hidden px-[40px]">
            <div className="m-auto flex gap-4">
                <div className="flex gap-4">
                    {columns.map((column) => (
                        <ColumnContainer column={column} />
                    ))}
                </div>
                <button className="h-[60px] w-[350px] min-w-[350px] 
                    cursor-pointer rounded-lg bg-mainBackgroundColor 
                    border-2 border-columnBackgroundColor p-4 
                    ring-rose-500 hover:ring-2 flex gap-2"
                    onClick={createNewColumn}>
                    <PlusIcon />
                    Add Column
                </button>
            </div>
        </div>
    )
}

export default KanbanBoard