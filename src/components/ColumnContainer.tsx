import { Column } from "../types";

interface Props {
    column: Column;
}

function ColumnContainer(props: Props) {
    const { column } = props;
    return (
        <div className="bg-columnBackgroundColor w-[350px] h-[500px] 
            max-h-[500px] rounded-md flex flex-col">
            {column.title}
        </div>
    )
}

export default ColumnContainer