import { LoaderCircle } from "lucide-react";

const Loading = () => {
    return ( 
        <div className=" w-full p-20 flex items-center rounded-xl justify-center flex-col gap-1 text-gray-600">
            <LoaderCircle className=" animate-spin"/>
            <p>Loading ...</p>
        </div>
     );
}
 
export default Loading;