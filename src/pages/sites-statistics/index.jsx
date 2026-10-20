import React from 'react'
import PiecChart from './piechart'
import Barchat from './barchat'

function Statistics() {

    return (
        <div className='flex flex-col gap-8'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <PiecChart title={'Trip Details'} api='tripcount' value='tripCount' />
                <PiecChart title={'Post Details'} api='postcount' value='postCount' />
            </div>
            <div>
                <Barchat />
            </div>
        </div>
    )
}

export default Statistics