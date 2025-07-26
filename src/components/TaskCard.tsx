import type { Task } from "../types"

interface Props {
    task: Task;
}

function TaskCard(props: Props) {
    const { task } = props;
    return (
        <div>{task.content}</div>
    )
}

export default TaskCard