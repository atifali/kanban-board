import TrashIcon from "../icons/TrashIcon";
import { Column } from "../types";

interface Props {
    column: Column;
}

function ColumnContainer(props: Props) {
    const { column } = props;
    return (
        <div className="bg-gray-800 w-[350px] h-[500px] 
            max-h-[500px] rounded-md flex flex-col">
            <div className="bg-gray-950 text-md h-[60px] cursor-grab
                rounded-md rounded-b-none p-3 font-bold 
                border-gray-800 border-4 flex items-center 
                justify-between">
                <div className="flex gap-2">
                    <div className="flex justify-center items-center 
                    bg-gray-800 px-2 py-1 text-sm rounded-full">
                        0
                    </div>
                    {column.title}
                </div>
                <button className="">
                    <TrashIcon />
                </button>
            </div>
            <div className="flex flex-grow">
                Content
            </div>
            <div>
                Footer
            </div>
        </div>
    )
}

export default ColumnContainer