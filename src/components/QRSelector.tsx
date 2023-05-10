import images from "@/Assets";
import Image from "next/image";
import { type Dispatch, type SetStateAction } from "react";

interface CustomPageProps {
    qr: string,
    setQr: Dispatch<SetStateAction<string>>
}

export default function QRSelector(props:CustomPageProps) {
    const { qr, setQr } = props;
    if(!qr) return null;

    return (
         <div className="flex flex-col h-56 w-56 items-center">
                                                   
           {/* HEADER SELECTOR */}
           <div className="flex w-56 bg-blue-300 items-center">
               <span 
                    onClick={()=> setQr("Insta")}    
                    className = { 
                        qr === "Insta" ? (
                           "flex w-full justify-center bg-pink-600 text-white cursor-pointer"
                        ): qr === "Wechat" ? (
                           "flex w-full justify-center bg-gray-200 text-black cursor-pointer"
                        ): undefined}
                >
                        Insta
                </span>

                <span 
                   onClick={()=> setQr("Wechat")}
                   className = { 
                       qr === "Insta" ? (
                           "flex w-full justify-center bg-gray-200 text-black cursor-pointer"
                       ): qr === "Wechat" ? (
                           "flex w-full justify-center bg-green-600 text-white cursor-pointer"
                       ): undefined}
                >
                   
                   Wechat
               </span>
           </div>

           <div className="h-56 w-56">
                {qr === "Insta" ? (
                    <Image
                        src={images.InstaQR}
                        alt="Item Image"
                        height={225}
                        width={225}
                    />
                ): qr === "Wechat" ? (
                    <Image
                        src={images.WechatQR}
                        alt="Item Image"
                        height={225}
                        width={225}
                    />
                ): null}
                
           </div>
       </div>
    );
}