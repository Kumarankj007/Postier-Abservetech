import React from "react";
import Card from "@/components/ui/Card";
import Button from "../../components/ui/Button";

const Settings = () => {

    return (
        <>
            <div className="grid grid-cols-2 gap-x-[30px] gap-y-[20px] mt-[20px]">
                <Card bodyClass='px-[24px] py-[16px]'>
                    <div className="flex items-center">
                        <Button link='general-settings' className="p-[9px] bg-slate-700 text-white w-[110px]" icon='mdi-email-outline' />
                        <p className="ml-[50px]">General Settings</p>
                    </div>
                </Card>
                <Card bodyClass='px-[24px] py-[16px]'>
                    <div className="flex items-center">
                        <Button link='email-configuration' className="p-[9px] bg-slate-700 text-white w-[110px]" icon='mdi-email-outline' />
                        <p className="ml-[50px]">Email Gateway</p>
                    </div>
                </Card>
                <Card bodyClass='px-[24px] py-[16px]'>
                    <div className="flex items-center">
                        <Button link='payment-gateway-configuration' className="p-[9px] bg-slate-700 text-white w-[110px]" icon='mdi-payment' />
                        <p className="ml-[50px]">Payment Gateway</p>
                    </div>
                </Card>
                {/* <Card bodyClass='px-[24px] py-[16px]'>
                    <div className="flex items-center">
                        <Button link='sms-configuration' className="p-[9px] bg-slate-700 text-white w-[110px]" icon='mdi-message-processing-outline' />
                        <p className="ml-[50px]">SMS Gateway</p>
                    </div>
                </Card> */}
            </div>
        </>
    );
};

export default Settings;
