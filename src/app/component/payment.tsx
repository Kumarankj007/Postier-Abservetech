'use client'

import Card from "./card"
import CustomTabComponent from "./tabComp"

export default function Payments() {

    const tabs = [
        { label: 'Card', content: <div><Card/></div>,value:true }
    ]
    return (
        <div className="px-5 md:px-[110px]">
            <p className="font-bold text-[17px] md:text-[25px]  mb-[50px]">Select Payment Method</p>
            <CustomTabComponent tabs={tabs}/>
        </div>
    )
}