import { useState } from "react";
import { type NextPage } from "next";
import { QRSelector } from "@/components";

const Contact:NextPage = () => {
    const [qr, setQr] = useState<string>("Insta")

    return (
        <div className="flex h-screen items-center justify-center">
            <div className="flex h-[1068px] w-[1068px] items-center justify-center p-8 rounded-[50%] bg-black">
                <div className="flex h-full w-full text-left p-3 pt-3 justify-start border-4  rounded-[50%] border-white">
                   <div className="flex h-full w-full text-left justify-start p-3 pt-3 border-4 rounded-[50%]  border-purple-600">
                       <div className="flex h-full w-full text-left p-3 pt-3 justify-start border-4 rounded-[50%]  border-blue-600">
                           <div className="flex h-full w-full text-left p-3 pt-3 justify-start border-4  rounded-[50%] border-green-600">
                               <div className="flex h-full w-full text-left p-3 pt-3 justify-start border-4 rounded-[50%] border-yellow-600">
                                   <div className="flex h-full w-full text-left p-3 pt-3 justify-start border-4  rounded-[50%] border-orange-600">
                                       <div className="flex h-full w-full text-left p-3 pt-3 justify-start border-4 rounded-[50%]  border-red-600">
                                              
                                           {/* CENTER CONTAINER */}
                                           <div className="flex flex-col items-center h-full w-full p-20 border-4 border-white rounded-xl">
                                                <h1 className="flex text-white text-4xl mb-5">
                                                    Contact us
                                                </h1>

                                                {/* Text */}
                                                <div className="flex flex-wrap mb-10 h-full w-full items-center min-w-[280px] items-left p-4 ml-3 bg-ChocolateCosmos border-2 rounded-lg border-white shadow-xl shadow-gray-600">

                                                    
                                                </div>


                                                {/*QR SELECTOR */}
                                                <QRSelector 
                                                    qr={qr} 
                                                    setQr={setQr}
                                                 />

                                           </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                   </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;