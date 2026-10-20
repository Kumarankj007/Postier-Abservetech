import Skeleton from '@mui/material/Skeleton';
import Store from '../store/store';
import useLoaderStore from '../hooks/loader';
import ThreeDotLoader from './threedotloader';
import ChatData from '../store/chat';

export default function SkeletonComponent(props: any) {
    const { page, children } = props;
    const { loading } = useLoaderStore();
    const {loader} = ChatData()
    return (

        loading ?
            <>
                {page === 'carousel' && (
                    <div className='w-[330px]'>
                        <Skeleton variant="rectangular" width={300} height={300} sx={{ borderRadius: '21px' }} />
                        <Skeleton variant="text" width={250} sx={{ fontSize: '1rem' }} />
                        <div className='flex flex-col gap-3 mt-5'>
                            <Skeleton variant="text" width={300} sx={{ fontSize: '1rem' }} />
                            <Skeleton variant="text" width={300} sx={{ fontSize: '1rem' }} />
                            <Skeleton variant="text" width={150} sx={{ fontSize: '1rem' }} />
                        </div>
                    </div>

                )
                }
                {page === 'staticpage' && (
                    <div >
                        <Skeleton variant="text" width={250} sx={{ fontSize: '1rem' }} />
                        <div className='flex flex-col gap-3 mt-5'>
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                        </div>
                    </div>

                )
                }
                {
                    page === 'Mypost' && (
                        <>
                            <div className="shadow-shadowbox p-5 border rounded-[17px] mb-6">
                                <Skeleton variant="text" width={500} sx={{ fontSize: '1rem', marginBottom: '15px' }} />
                                <Skeleton variant="text" width={500} sx={{ fontSize: '1rem', marginBottom: '15px' }} />
                                <Skeleton variant="text" width={500} sx={{ fontSize: '1rem', marginBottom: '15px' }} />
                                <Skeleton variant="text" width={500} sx={{ fontSize: '1rem', marginBottom: '15px' }} />
                            </div>
                            <div className="shadow-shadowbox p-5 border rounded-[17px] mb-6">
                                <Skeleton variant="text" width={500} sx={{ fontSize: '1rem', marginBottom: '15px' }} />
                                <Skeleton variant="text" width={500} sx={{ fontSize: '1rem', marginBottom: '15px' }} />
                                <Skeleton variant="text" width={500} sx={{ fontSize: '1rem', marginBottom: '15px' }} />
                                <Skeleton variant="text" width={500} sx={{ fontSize: '1rem', marginBottom: '15px' }} />
                            </div>
                        </>
                    )
                }
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
                    page === 'details' && (
                        <div>
                            <div className='flex flex-col sm:flex-row justify-start items-center sm:items-start'>
                                <div className='mb-4 sm:mb-0 sm:mr-8'>
                                    <Skeleton variant="rectangular" width={300} height={300} />
                                </div>
                                <div>
                                    <Skeleton variant="text" width={300} sx={{ fontSize: '1rem', marginBottom: '15px' }} />
                                    <Skeleton variant="text" width={500} sx={{ fontSize: '1rem', marginBottom: '15px' }} />
                                    <Skeleton variant="text" width={200} sx={{ fontSize: '1rem', marginBottom: '15px' }} />
                                </div>

                            </div>
                            <div className=''>
                                <Skeleton variant="text" width={500} height={300}  />
                            </div>
                        </div>
                    )
                }
            </>
            :
            children
    )
}