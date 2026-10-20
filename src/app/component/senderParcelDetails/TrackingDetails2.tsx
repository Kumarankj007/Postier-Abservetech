
import React from 'react'
import Button from "../button";
import { Rating } from '@mui/material';
// import CustomStarIcon from "../../../../public/svg/icon/custom-star.svg";
import { trackingCardData2 } from "../../../../content";
import Image from 'next/image';

const TrackingDetails2 = () => {
    const awardedToCards: JSX.Element[] = [];
    const otherPostierCards: JSX.Element[] = [];

    trackingCardData2.map((card, index) => {
        const cardComponent = (
            <div key={index} className="mx-auto md:flex md:justify-between border rounded-xl p-6 md:p-10 shadow mb-20">
                <div className="md:pr-6">
                    <div className="flex flex-col md:flex-row justify-start items-center">
                        <div className="mb-4 md:mb-0">
                            <Image width={20} height={20} src={card.imgUrl} alt={card.name} className="w-14 h-14" />
                        </div>
                        <div className="ml-0 md:ml-4">
                            <h3 className="text-lg font-bold  text-center md:text-start mb-2 md:ml-1 md:mb-0">{card.name}</h3>
                            <Rating name="customized-icons" defaultValue={card.rating} max={5} readOnly />
                            {/* <Rating name="customized-icons" defaultValue={card.rating} max={5} icon={<Image width={20} height={20} src={CustomStarIcon} alt="custom-star" />} /> */}
                        </div>
                    </div>
                    <div className="mt-6 md:mt-6 " style={{ maxWidth: "824px", lineHeight: "34px" }}>
                        <p>{card.description}</p>
                    </div>
                    {card.name === "Marco" && <div className="flex flex-col md:flex-row justify-start mt-6 md:mt-8">
                        <div className="flex justify-start items-center md:pr-20">
                            <div className="border rounded-full bg-blue-200 p-3">
                                <Image width={20} height={20} src="/svg/icon/dollar.svg" alt="dollarIcon" className="h-4 w-4" />
                            </div>
                            <h4 className="ml-3 ">Payments</h4>
                        </div>
                        <div className="flex justify-start items-center mt-4 md:mt-0 ">
                            <div className="border rounded-full bg-blue-200 p-3">
                                <Image src="/svg/icon/chat.svg" alt="chatIcon" className="h-4 w-4" />
                            </div>
                            <h4 className="ml-3 ">Chat With Postier</h4>
                        </div>
                    </div>}
                </div>
                <div className="flex flex-col md:flex-col mt-6 md:mt-0 mr-6">
                    <div className="mb-4 md:mb-20" >
                        <Button className="font-bold  border p-3 md:p-4 rounded-md w-full md:w-52 shadow-md" style={{ boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.1)', borderColor: '#004080', color: "#004080" }}>
                            {card.btnLabel}
                        </Button>
                    </div>
                </div>
            </div>
        )
        if (card.name === "Marco") {
            awardedToCards.push(cardComponent);
        } else {
            otherPostierCards.push(cardComponent);
        }
    });


    return (
        <div className='p-6'>
            <div>
                {awardedToCards.length > 0 && <p className='font-bold  text-md mb-4'>Awarded To</p>}
                {awardedToCards.length > 0 && <div>{awardedToCards}</div>}
            </div>
            <div>
                {otherPostierCards.length > 0 && <p className='font-bold  text-md mb-4'>Other Postiers Offers</p>}
                {otherPostierCards.length > 0 && <div>{otherPostierCards}</div>}
            </div>
        </div>
    )
}

export default TrackingDetails2
