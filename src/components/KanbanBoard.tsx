import { useMemo, useState } from "react"
import PlusIcon from "../icons/PlusIcon"
import type { Column, Id, Task } from "../types";
import ColumnContainer from "./ColumnContainer";
import { DndContext, DragOverlay, PointerSensor, useSensors, useSensor, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";

function KanbanBoard() {
    const [columns, setColumns] = useState<Column[]>([]);
    const columnsId = useMemo(
        () => columns.map(column => column.id),
        [columns]);
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
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

    function createTask(columnId: Id) {
        const newTask: Task = {
            id: Date.now(),
            columnId: columnId,
            content: `Task ${tasks.length + 1}`
        }
        setTasks([...tasks, newTask]);
    }

    function deleteTask(id: Id) {
        const newTasks = tasks.filter(task => task.id !== id);
        setTasks(newTasks);
    }

    function updateTask(id: Id, content: string) {
        const newTasks = tasks.map(task => {
            if (task.id !== id) return task;
            return { ...task, content };
        });
        setTasks(newTasks);
    }

    function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current.column);
            return;
        }
        if (event.active.data.current?.type === "Task") {
            setActiveTask(event.active.data.current.task);
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
                                    updateColumn={updateColumn}
                                    createTask={createTask}
                                    deleteTask={deleteTask}
                                    updateTask={updateTask}
                                    tasks={tasks.filter(
                                        task =>
                                            task.columnId === column.id
                                    )} />
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
                            createTask={createTask}
                            deleteTask={deleteTask}
                            updateTask={updateTask}
                            tasks={tasks.filter(
                                task =>
                                    task.columnId === activeColumn.id
                            )}
                        />
                    )}
                    {activeTask && <TaskCard
                        task={activeTask}
                        deleteTask={deleteTask}
                        updateTask={updateTask} />
                    }
                </DragOverlay>, document.body)}
            </DndContext>
        </div>
    )
}

export default KanbanBoard