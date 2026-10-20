import React, { useContext, useEffect, useState } from 'react';
import Select from './select';
import { MenuItem } from '@mui/material';
import Store from '../store/store';
import { useSearchParams } from 'next/navigation';
import PageContext from '../providers/pagecontext';
import { urlToObject } from '@/utils';
import Image from 'next/image';

interface PaginationProps {
  totalItems: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}


const option = [5, 10, 20, 30, 40, 50]

const Pagination: React.FC<PaginationProps> = ({ totalItems, onPageChange, onLimitChange, }) => {
  const searchParams: any = useSearchParams()
  const { i18 } = useContext(PageContext);
  const path = typeof window !== undefined && window?.location?.pathname
  const { Page, Limit, setLimit, setPage }: any = Store()
  const [currentPage, setCurrentPage] = useState<any>(1);
  const [startPage, setStartPage] = useState(1);
  const totalPages = Math.ceil(totalItems / Limit);
  const maxVisiblePages = 10;

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  const handleNext = () => {
    
    if (currentPage < totalPages) {
      handlePageClick(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      handlePageClick(currentPage - 1);
    }
  };

  useEffect(() => {
    onPageChange(currentPage);
    if (currentPage > startPage + maxVisiblePages - 1) {
      setStartPage(startPage + 1);
    } else if (currentPage < startPage) {
      setStartPage(startPage - 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, startPage]);

  useEffect(() => {
    const data = urlToObject(window.location.search)
    // const data: any = {};
    if (currentPage) {
      if (totalPages >= currentPage) {
        data.page = Page;
      } else {
        data.page = 1
      }
    }
    if (Limit) {
      data.Limit = Limit;
    }
    const queryString = Object.keys(data).map((key) => `${key}=${encodeURIComponent(data[key])}`).join('&');
    window.history.replaceState({path: `${path}?` + queryString }, '', '?' + queryString);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Page,Limit])

  useEffect(() => {
    const page = parseInt(searchParams.get('page'))
    const limit = parseInt(searchParams.get('Limit'))
    if (page) {
      setPage(page)
      setCurrentPage(page)
    }
    if (limit) {
      setLimit(limit)
    }
   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])
  const renderPageNumbers = () => {
    const pages = [];
    const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <div
          key={i}
        // onClick={() => handlePageClick(i)}
        >
          <div className={`flex ${i === parseInt(currentPage) ? 'bg-btncolor w-[35px] h-[35px] py-[8px] px-[12px] rounded-full flex items-center justify-center text-[#fff]' : 'border border-[#E9E9E9] w-[35px] h-[35px] py-[8px] px-[12px] rounded-full flex items-center justify-center text-[#313131]'}`}>
            {i}
          </div>
        </div>
      );
    }
    return pages;
  };
  // console.log('currentPage', totalPages)
  return (
    totalItems > 0 &&
    <div className="   flex flex-wrap gap-5 items-center justify-center mb-5">
    <div className='border border-1 border-btncolor p-3 rounded-[15px] flex'>
    <button onClick={handlePrev} disabled={currentPage === 1}>
        <div className=" py-[8px] px-[12px] rounded-[4px] flex  gap-3 items-center justify-center text-[#313131] ">
          <Image width={10} height={10} src='/svg/icon/previouspagination.svg' alt='img' />
         {/* { i18?.TRANSACTION?.PREVIOUS || 'Previous'} */}
        </div>
      </button>
      {renderPageNumbers()}
      <button onClick={handleNext} disabled={currentPage === totalPages}>
        <div className=" py-[8px] px-[12px] rounded-[4px] flex gap-3  items-center justify-center text-[#313131]">
        {/* { i18?.TRANSACTION?.NEXT || 'Next'} */}
          <Image width={10} height={10} src='/svg/icon/nextPagination.svg' alt='img' />
        </div>
      </button>
    </div>
      {/* <p className='mr-4 text-[#313131]'> { i18?.TRANSACTION?.RESULTPERPAGE || 'Result per page'}</p> */}
      {/* <select
        value={Limit}
        className='py-[5px] px-[12px] bg-[#fff] border border-[#E9E9E9] rounded-[4px] outline-none text-center'
        onChange={(e: any) => {
          setLimit(e.target.value);
          onLimitChange(e.target.value);
        }}>
        {
          option.map((option, id) => (
            <option key={id} value={option}>
              {option}
            </option>
          ))
        }
      </select> */}
    </div>


  );
};

export default Pagination;
