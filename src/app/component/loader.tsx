import useLoaderStore from "../hooks/loader";
import ChatData from "../store/chat";
import ThreeDotLoader from "./threedotloader";

export default function LoderComp(props: any) {
    const { page, children } = props;
    const { loading } = useLoaderStore();
    const { loader ,singleloader} = ChatData()
    return (
       ( page === 'SingleChat' ? singleloader : loader || page === 'Tracking' &&  loading) ?
            <>
                {
                    page === 'Message' && (
                        <ThreeDotLoader />
                    )
                }
                {
                    page === 'SingleChat' && (
                        <div className='h-[100vh] w-full bg-[#5a5a5a1a] flex items-center justify-center'>
                            <ThreeDotLoader />
                        </div>
                    )
                }
                {
                    page === 'Tracking' && (
                        <div className='h-[30vh] w-full flex items-center justify-center'>
                            <ThreeDotLoader />
                        </div>
                    )
                }
            </>
            :
            children

    )
}