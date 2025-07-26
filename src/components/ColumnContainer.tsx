import { useSortable } from "@dnd-kit/sortable";
import TrashIcon from "../icons/TrashIcon";
import type { Column, Id, Task } from "../types";
import { CSS } from "@dnd-kit/utilities"
import { useState } from "react";
import PlusIcon from "../icons/PlusIcon";

interface Props {
    column: Column;
    deleteColumn: (id: Id) => void;
    updateColumn: (id: Id, title: string) => void;
    createTask: (columnId: Id) => void;
    tasks: Task[];
}

function ColumnContainer(props: Props) {
    const { column, deleteColumn, updateColumn, createTask, tasks } = props;
    const [editMode, setEditMode] = useState(false);

    const { setNodeRef, attributes, listeners,
        transform, transition, isDragging } = useSortable({
            id: column.id,
            data: {
                type: "Column",
                column,
            },
            disabled: editMode,
        });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }

    if (isDragging) {
        return (
            <div ref={setNodeRef} style={style} className="bg-gray-800 
            w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col
            opacity-40 border-2 border-rose-500">
            </div>
        );
    }

    return (
        <div ref={setNodeRef} style={style} className="bg-gray-800 
            w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col">
            <div {...attributes} {...listeners}
                onClick={
                    () => { setEditMode(true) }
                } className="bg-gray-950 
                text-md h-[60px] cursor-grab rounded-md rounded-b-none 
                p-3 font-bold border-gray-800 border-4 flex items-center 
                justify-between">
                <div className="flex gap-2">
                    <div className="flex justify-center items-center 
                    bg-gray-800 px-2 py-1 text-sm rounded-full">
                        0
                    </div>
                    {!editMode && column.title}
                    {editMode && <input
                        className="bg-black focus:border-rose-500 
                            border rounded outline-none px-2"
                        value={column.title}
                        onChange={
                            (e) => {
                                updateColumn(column.id, e.target.value);
                            }
                        }
                        autoFocus
                        onBlur={
                            () => { setEditMode(false) }
                        }
                        onKeyDown={
                            (e) => {
                                if (e.key !== "Enter") return;
                                setEditMode(false);
                            }
                        }
                    />}
                </div>
                <button onClick={() => deleteColumn(column.id)}
                    className="stroke-gray-500 
                    hover:stroke-white hover:bg-gray-800 rounded 
                    px-1 py-2">
                    <TrashIcon />
                </button>
            </div>
            <div className="flex flex-grow flex-col gap-4 p-2 
                overflow-x-hidden overflow-y-auto">
                {tasks.map(task => (
                    <div key={task.id}>{task.content}</div>
                ))}
            </div>
            <button className="flex gap-2 items-center border-gray-800
                border rounded-md p-4 border-x-gray-800 
                hover:bg-gray-950 hover:text-rose-500 
                active:bg-black"
                onClick={() => createTask(column.id)}
            >
                <PlusIcon />
                Add Task
            </button>
        </div >
    )
}

export default ColumnContainer