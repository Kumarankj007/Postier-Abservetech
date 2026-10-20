'use client'
import CustomBreadCrumb from '@/app/component/breadcrumbs'
import EmptyPage from '@/app/component/emptydatapage'
import Pagination from '@/app/component/pagination'
import PageContext from '@/app/providers/pagecontext'
import ReviewData from '@/app/store/reviews'
import RoleStore from '@/app/store/RoleStore'
import Store from '@/app/store/store'
import { Rating } from '@mui/material'
import Image from 'next/image'
import React, { useContext, useEffect } from 'react'

function You() {
  const { FetchReviews, Reviews } = ReviewData()
  const { Page, setPage, Limit, setLimit } = Store()
  const { RoleSwitch } = RoleStore()
  const { i18 } = useContext(PageContext);
  useEffect(() => {
    const data = {
      moduleType: RoleSwitch === 'user' ? 'Trip' : 'Post'
    }
    FetchReviews(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePageChange = (page: any) => {
    setPage(page)
  }
  const handleLimitChange = (limit: any) => {
    setLimit(limit)
  }
  return (
    <div className='flex flex-col gap-8'>
      <div className='m-[20px] md:m-[40px] lg:m-[70px] '>
        <div>
          <CustomBreadCrumb
            pathSegments={i18?.NEW?.REVIEW || 'Review & Ratings'}
            pathSegments2={i18?.NEW?.YOU || 'Reviews Given By You'}
            link={'/accountsettings/reviews'}
          />
        </div>
        {
          Array.isArray(Reviews) && Reviews.length > 0 ?
            Array.isArray(Reviews) && Reviews.map((review, index) => {
              return (
                <div key={index} className='mt-10 border border-1 border-btncolor rounded-[31px] p-8 w-full lg:w-[900px]'>
                  <div className='flex flex-col md:flex-row justify-start items-center'>
                    <div className='mb-4 md:mb-0 border-2 border-btncolor rounded-full'>
                      <Image width={900} height={900} src={process.env.NEXT_PUBLIC_IMAGE_URL + review?.reviewee?.profile} alt={review.name} className="w-14 h-14 rounded-full object-fill" />
                    </div>
                    <div className='ml-0 md:ml-4'>
                      <div className='text-center md:text-start'>
                        <h3 className='text-lg font-bold  mb-2 md:ml-1 md:mb-0'>{review?.reviewee?.fname} {review?.reviewee?.lname}</h3>
                      </div>
                      <div>
                        <Rating defaultValue={review.rating} max={5} readOnly />
                      </div>
                    </div>
                  </div>
                  <div className='mt-4'>
                    <p className='text-sm leading-8'>{review.comments}</p>
                  </div>
                </div>
              );
            })
            :
            <div className='h-screen'>
              <EmptyPage image='/svg/icon/noreview.svg' text={i18?.NEW?.NOREVIEW || 'No Reviews or Ratings Yet'} />
            </div>
        }


      </div>
      <div className=' flex items-center justify-center w-full'>
        {
          Array.isArray(Reviews) && Reviews.length > 0 &&
          <Pagination
            totalItems={Reviews?.length || 0}
            onLimitChange={handleLimitChange}
            onPageChange={handlePageChange}
          />
        }
      </div>

    </div>
  )
}

export default You