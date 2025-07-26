import { useState } from "react";
import TrashIcon from "../icons/TrashIcon";
import type { Task } from "../types"

interface Props {
    task: Task;
}

function TaskCard(props: Props) {
    const { task } = props;
    const [mouseIsOver, setMouseIsOver] = useState(false);
    return (
        <div className="bg-gray-950 p-2.5 h-[100px] min-h-[100px] 
            items-center flex text-left rounded-xl hover:ring-2 
            hover:ring-inset hover:ring-rose-500 cursor-grab relative"
            onMouseEnter={() => {
                setMouseIsOver(true);
            }}
            onMouseLeave={() => {
                setMouseIsOver(false);
            }}
        >
            {task.content}
            {mouseIsOver && <button className="stroke-white absolute right-4 top-1/2
            -translate-y-1/2 bg-gray-800 p-2 rounded">
                <TrashIcon />
            </button>}
        </div>
    )
}

export default TaskCard