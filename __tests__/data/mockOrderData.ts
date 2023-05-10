import { v4 as uuidV4 } from "uuid";
import { mockOrderItems, mockGalleryItem } from "./mockItemData";
import { type CreateOrderInputParams, type ICartItem, type ICart } from "@/types";
import { CalcOrderTotal } from "../helpers/OrderMath";

export interface OrderFormInputs {
  label: string
  value?: string
}

export const orderFormInputValues:OrderFormInputs[] = [{
    label: "FIRST NAME *",
    value: "Corey",
  }, {
    label: "LAST NAME *",
    value: "Trautman",
  },{
    label: "EMAIL ADDRESS *",
    value: "adamantspinner@protonmail.com",
  }, {
    label: "PHONE NUMBER *",
    value: "212312313",
  }, {
    label: "COUNTRY *",
    value: "United States",
  }, {
    label: "STATE/PROVINCE *",
    value: "Pennsylvania",
  }, {
    label: "CITY *",
    value: "Pittsburgh",
  }, {
    label: "ADDRESS ONE *",
    value: "3001 Marshall Road",
  }, {
    label: "ADDRESS TWO *",
    value: "apt 305",
  }, {
    label: "ZIPCODE *",
    value: "15214",
  }]


export const mockOrderInput:CreateOrderInputParams = {
  shippingInfo: {
    email: "adamantspinner@protonmail.com",
    firstName: "first",
    lastName: "last",
    country: "United States",
    stateProvince: "Pennsylvania",
    city: "Pittsburgh",
    addressOne: "3001 Marshallroad",
    addressTwo: "Apt 305",
    zipCode: "15212",
    phoneNumber: "412-123-4567",
  },
  items: mockOrderItems,
  customerId: uuidV4(),
}

export const mockOrder = {
  email: "adamantspinner@protonmail.com",
  firstName: "first",
  lastName: "last",
  country: "United States",
  stateProvince: "Pennsylvania",
  city: "Pittsburgh",
  addressOne: "3001 Marshallroad",
  addressTwo: "Apt 305",
  zipCode: "15212",
  phoneNumber: "412-123-4567",
  items: { connect: [mockOrderItems[0]?.item?.id, mockOrderItems[1]?.item?.id] },
  totalPrice: CalcOrderTotal(mockOrderItems),
  customerId: mockOrderInput.customerId,
}

export const mockCartItem: ICartItem = {
  item: mockGalleryItem,
  quantity: mockGalleryItem.quantity,
}

export const mockdefaultCart:ICart = {
  items: [ mockCartItem ],
  totalPrice: mockGalleryItem.price * mockGalleryItem.quantity,
  paymentIntent: null
}

