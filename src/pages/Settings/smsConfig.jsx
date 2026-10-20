import React, { useState } from "react";
import Card from "@/components/ui/Card";

const SmsConfig = () => {

    return (
        <>
            <Card bodyClass='px-[24px] py-[16px]'>SMS Gateway</Card>
            <div className="grid grid-cols-2 gap-x-[30px] gap-y-[20px] mt-[20px]">
                <Card bodyClass='px-[24px] py-[16px]'>
                    <div className="flex items-center justify-between">
                        <p className="">Twilio</p>
                        <div className="flex items-center gap-[15px]">
                            <button className="text-[#fff] bg-[#00d68f] text-[12px] p-[8px] rounded-full w-[80px]">ACTIVE</button>
                        </div>
                    </div>
                </Card>
            </div>
        </>
    );
};

export default SmsConfig;
