import { useContext } from "react";
import { useForm} from "react-hook-form";

import { OrderContext } from "@/context/OrderContext";
import { CartContext } from "@/context/CartContext";

import CountryList from "@/utils/constants/Countries";
import { validRegex, validEmail, validZip, validNumberSimple, validNumberComplex } from "@/utils/constants/ValidInput";

import { type IShippingForm } from "@/types";

/**
 * TODO: 
 *     Complete form
 *     make a button on the bottom of this page
 *     it is grayed out by default but becomes blue when the user select a payment option
 *     upon clicking the button, validate all data in form before allowing user to proceed to entering payment information
 * 
 * Stripe Testing: 
 *  Card: 4242 4242 4242 4242.
 *  date: 12/34
 *  cvc: any three-digit CVC
 *  others; andy
 */
export default function ShippingInfo() {

    const {
        prepStripeCheckout,
        setShippingInfo,
    } = useContext(OrderContext);
    const { cart } = useContext(CartContext);

    const ShippingForm = useForm(); //imported in checkoutForm
    const { register, handleSubmit, formState:{ errors } } = ShippingForm;
     
    /**
     * This button extracts values from shipping info form,
     * && triggers the generation of stripe payment intent
     */ 
    const submitForm = (formData) => {
        if(Object.keys(errors).length > 0) return;

        // destructure form values
        const formValues = ShippingForm.getValues() as IShippingForm;
        for(const value in formValues){
            if (!value || typeof value !== "string") return;
        }

        setShippingInfo({ 
            email: formValues.email, 
            firstName: formValues.firstName, 
            lastName: formValues.lastName,
            country: formValues.country,
            stateProvince: formValues.stateProvince,
            city: formValues.city,
            addressOne: formValues.addressOne,
            addressTwo: formValues.addressTwo,
            zipCode: formValues.zipCode,
            phoneNumber: formValues.phoneNumber,
        });
 
        prepStripeCheckout(cart);
        return;
    }

    return (
            <form 
                className="flex flex-col items-center justify-center h-full w-full p-3"
                onSubmit={handleSubmit(submitForm)}
            >

                {/* CONTACT INFO */}
                <div className="flex justify-center w-[575px] flex-col py-10 p-6 my-4 bg-MintGreen rounded-lg border-Grape">

                    <h1 className="mb-6 text-3xl font-bold font-CocoBiker text-black">
                        Contact Info
                    </h1>


                    {/* FIRST NAME */}
                    <div className="flex w-full pb-3 items-center">
                        <label className="text-2xl font-CocoBiker">First name:</label>
                        <input
                            data-testid="FIRST NAME *"
                            className={`p-2 mx-14 mt-2 h-12 w-56 border-2 border-gray-300 rounded-lg
                            ${
                                errors.firstName?.type === "required" ||
                                errors.firstName?.type === "pattern" ? "border-red-300" : "border-gray-300"
                            }`}
                            placeholder="First name..."
                            type="text"
                            {...register("firstName", {
                              required: true,
                              pattern: validRegex,
                            })}   
                        />
                    </div>

                    {/* LAST NAME */}
                    <div className="flex w-full pb-3 items-center">
                    <label className="text-2xl font-CocoBiker">Last name:</label>
                        <input
                            data-testid="LAST NAME *"
                            className={`p-2 mx-16 mt-2 h-12 w-56 border-2 border-gray-300 rounded-lg
                              ${
                                errors.lastName?.type === "required" ||
                                  errors.lastName?.type === "pattern" ? "border-red-300" : "border-gray-300"
                              }`}
                            placeholder="Last name..."
                            type="text"
                            {...register("lastName", {
                              required: true,
                              pattern: validRegex,
                            })}                             
                        />
                    </div>

                    {/* EMAIL */}
                    <div className="flex w-full pb-3 items-center">
                        <label className="text-2xl font-CocoBiker">Email Address:</label>
                        <input
                        data-testid="EMAIL ADDRESS *"
                            className={`p-2 mx-5 mt-2 h-12 w-56 border-2 border-gray-300 rounded-lg
                           ${
                                errors.email?.type === "required" ||
                                errors.email?.type === "pattern" ? "border-red-300" : "border-gray-300"
                            }`}
                          placeholder="Email address..."
                            type="email"
                            {...register("email", {
                                required: true,
                                pattern: validEmail,
                            })}
                        />
                    </div>

                    {/* PHONE NUMBER */}
                    <div className="flex w-full pb-3 items-center">
                        <label className="text-2xl font-CocoBiker">Phone Number:</label>
                        <input
                          data-testid="PHONE NUMBER *"
                          className={`p-2 mx-2 mt-2 h-12 w-56 border-2 border-gray-300 rounded-lg
                          ${
                            errors.phoneNumber?.type === "required" ||
                            errors.phoneNumber?.type === "pattern" ? "border-red-300" : "border-gray-300"
                            }`}
                            placeholder="Phone number..."
                            type="text"
                            {...register("phoneNumber", {
                                required: true,
                                pattern: validNumberSimple || validNumberComplex,
                            })}
                        />
                    </div>
                </div>


                {/* SHIPPING DETAILS CONTAINER */}
                <div className="flex flex-col w-[575px] h-full p-6 py-10 gap-y-2 my-4 bg-MintGreen rounded-lg border-Grape">
                    <h1 className="mb-6 text-3xl font-bold font-CocoBiker text-black">
                        Shipping Address
                    </h1>


                    {/* STATE|PROVINCE */}
                    <div className="flex w-full pb-3 items-center">
                        <label className="text-2xl font-CocoBiker">State/Province:</label>
                        <input
                            data-testid="STATE/PROVINCE *"
                            className={`p-2 mx-10 mt-2 h-12 w-56 border-2 border-gray-300 rounded-lg
                            ${
                                errors.stateProvince?.type === "required" ||
                                errors.stateProvince?.type === "pattern" ? "border-red-300" : "border-gray-300"
                            }`}
                            placeholder="State/Province"
                            type="text"
                            {...register("stateProvince", {
                                required: true,
                                pattern: validRegex,
                            })}
                        />
                    </div>

                    {/* CITY */}
                    <div className="flex w-full pb-3 items-center">
                        <label className="text-2xl font-CocoBiker">City:</label>
                        <input
                            data-testid="CITY *"
                            className={`p-2 mx-40 mt-2 h-12 w-56 border-2 border-gray-300 rounded-lg
                            ${errors.city?.type === "required" ||
                                    errors.city?.type === "pattern" ? "border-red-300" : "border-gray-300"
                                }`}
                            placeholder="City"
                            type="text"
                            {...register("city", {
                                required: true,
                                pattern: validRegex,
                            })}
                        />
                    </div>

                    {/* ADDRESS 1 */}
                    <div className="flex w-full pb-3 items-center">
                        <label className="text-2xl font-CocoBiker">Address Line One:</label>
                        <input
                            data-testid="ADDRESS ONE *"
                            className={`p-2 mx-5 mt-2 h-12 w-56 border-2 border-gray-300 rounded-lg
                            ${
                              errors.addressOne?.type === "required" ||
                              errors.addressOne?.type === "pattern" ? "border-red-300" : "border-gray-300"
                            }`}
                            placeholder="Address line 1"
                            type="text"
                            {...register("addressOne",{
                                required: true,
                                pattern: validRegex,
                            })}
                        />
                    </div>
    
                    {/* ADDRESS 2 */}
                    <div className="flex w-full pb-3 items-center">
                        <label className="text-2xl font-CocoBiker">Address Line Two:</label>
                        <input
                            data-testid="ADDRESS TWO *"
                            className={`p-2 mx-5 mt-2 h-12 w-56 border-2 border-gray-300 rounded-lg
                            ${
                              errors.addressTwo?.type === "required" ||
                              errors.addressTwo?.type === "pattern" ? "border-red-300" : "border-gray-300"
                            }`}
                            placeholder="apt, room, (etc)"
                            type="text"
                            {...register("addressTwo",{
                                required: true,
                                pattern: validRegex,
                            })}
                        />
                    </div>

                    {/* ZIPCODE */}
                    <div className="flex w-full pb-3 items-center">
                        <label className="text-2xl font-CocoBiker mr-24">Zipcode:</label>
                        <input
                            data-testid="ZIPCODE *"
                            className={`p-2 ml-5 mt-2 h-12 w-56 border-2 border-gray-300 rounded-lg
                            ${
                                errors.zipCode?.type === "required" ||
                                errors.zipCode?.type === "pattern" ? "border-red-300" : "border-gray-300"
                            }`}
                            placeholder="zipcode"
                            type="text"
                            {...register("zipCode",{
                                required: true,
                                pattern: validZip,
                            })}         
                        />
                    </div>

                    {/* COUNTRY */}
                    <div className="flex w-full pb-3 items-top">
                        <label className="text-2xl font-CocoBiker mr-24">Country:</label>
                        <select
                            data-testid="COUNTRY *"
                            className={`h-12 w-56 bg-white ml-3 px-4 border-2 border-gray-300 rounded-lg
                                ${
                                    errors.country?.type === "required" 
                                    ?  "border-red-300" 
                                    :  "border-gray-300"
                                }`}
                            defaultValue=""
                            {...register("country", {
                                required: true,
                            })}
                        >
                            <option value="" disabled hidden>Country</option>
                            { CountryList.map((
                                    el: { name: string, label: string },
                                    index: number
                                ) => (
                                    <option value={el.name} key={index}>
                                        {el.label}
                                    </option>
                            ) ) }
                        </select>
                    </div>
                </div>

            <div className="flex flex-col flex-wrap w-full h-full mx-3 justify-end">
                <button
                    className={"flex text-2xl mt-3 p-3 h-full w-full items-center justify-center cursor-pointer rounded-lg text-white bg-blue-500 hover:bg-blue-600"}
                    disabled={Object.keys(errors).length > 0}
                    data-testid="#SUBMIT_SHIPPING"
                    type="submit"
                >
                    Proceed with Stripe
                </button>
            </div>
        </form>
    );
}