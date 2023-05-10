{/* PAYMENT OPTION SELECT */ }
<div className="w-[575px] py-6 p-6 my-4 bg-MintGreen rounded-lg border-Grape">
    <h1 className="my-2 text-2xl font-bold">
        Select Payment Method
    </h1>

    {/* PAYMENT OPTIONS CONTAINER */}
    <div className="flex flex-col flex-wrap w-full h-full mx-3 my-9 justify-start gap-y-4">

        <div className="flex items-center">
            {/* STRIPE */}
            <input
                type="radio"
                name="payoutMethod"
                data-testid="SELECT STRIPE *"
                onChange={() => (ShippingForm.setValue("paymentMethod", paymentType.stripe))}
                className="flex w-6 h-6 mx-1 rounded-lg mr-4 border-2 border-black cursor:pointer"
            />

            <Image
                src={images.Stripe}
                alt="Stripe_Logo"
                height={30}
                width={30}
            />

            {/*Stripe LOGO*/}
            <label
                className="flex text-xl h-full w-20 items-center justify-start rounded-lg"
            >
                tripe
            </label>
        </div>

        {/* PAYPAL */}
        <div className="flex items-center">
            <input
                data-testid="SELECT PAYPAL *"
                type="radio"
                name="payoutMethod"
                onChange={() => (ShippingForm.setValue("paymentMethod", paymentType.paypal))}
                className="flex w-6 h-6 mx-1 rounded-lg mr-4 border-2 border-black cursor:pointer"
            />

            <Image
                src={images.Paypal}
                alt="Paypal_Logo"
                height={25}
                width={25}
            />

            {/*PayPal LOGO*/}
            <label
                className="flex text-xl h-full w-20 items-center justify-start rounded-lg"
            >
                aypal
            </label>
        </div>
    </div>

    <button
        className={
            paymentMethod === "PayPal" || paymentMethod === "Stripe" ? (
                "flex text-2xl mt-3 p-3 h-full w-full items-center justify-center cursor-pointer rounded-lg text-white bg-blue-500 hover:bg-blue-400"
            ) :
                "flex text-2xl mt-3 p-3 h-full w-full items-center justify-center cursor-pointer rounded-lg bg-gray-500"
        }
        disabled={Object.keys(errors).length > 0 || paymentMethod === ""}
        data-testid="#SUBMIT_SHIPPING"
        type="submit"
    >
        Proceed to payment
    </button>

</div>