"use client"
import { AwaitedReactNode, JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useEffect, useState } from 'react'
import { StarIcon } from '@heroicons/react/20/solid'
// import { RadioGroup } from '@headlessui/react'

import NavBar from "../../navBar"
import Details from "../../productOverView.json"
import { useRouter } from 'next/router';
import useStore from "../../store";
import { v4 as uuidv4 } from 'uuid';


const reviews = { href: '#', average: 5, totalCount: 117 }

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
interface ProductOverviewProps {
  params: {
    id: string;
  };
}

export default function productDetails({params}: ProductOverviewProps) {
    const {updateCartData ,cartData} = useStore();
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [addedToBag, setAddedToBag] = useState(false);
  const [itemData, setItemData] = useState<Array<{
    name: string[];
    href: string;
    color: string;
    price: string[];
    quantity: number;
    imageSrc: string;
    imageAlt: string;
  }>>([]);
  const router = useRouter();
  const { id } = router.query; 

  let ID: number;
  if (typeof id === 'string') {
    ID = parseInt(id, 10);
  } else {
    ID = 1;
  }
  const handleChange = (e:any)=>{
    setSelectedQuantity(e.target.value)
  }
  const arraysEqual = (a: any[], b: any[]): boolean => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
};
  const handleSubmit = ()=>{
    const filteredPrice =  Details[0].price
      .filter((item: { id: number }) => item.id === ID)
      .map((item: { price: string }) => item.price)
      const filteredName =  Details[0].name
      .filter((item: { id: number }) => item.id === ID)
      .map((item: { name: string }) => item.name)

    const uniqueId = uuidv4();
    let obj = {
        id:uniqueId,
        name: filteredName,
        href: '#',
        color: '',
        price: filteredPrice,
        quantity: selectedQuantity,
        imageSrc: Details[0].images[ID-1].src,
        imageAlt: 'image',
    }
    const existingCartData = localStorage.getItem("cartTest");
    let updatedCartData = [];

    if (existingCartData) {
       
        updatedCartData = JSON.parse(existingCartData);
        const existingItemIndex = updatedCartData.findIndex((item: any) => arraysEqual(item.name, obj.name));
        
        if (existingItemIndex !== -1) {
            updatedCartData[existingItemIndex].quantity = obj.quantity;
        } else {
            updatedCartData.push(obj);
        }
    } else {
        updatedCartData.push(obj);
    }
    localStorage.setItem("cartTest", JSON.stringify(updatedCartData));
    updateCartData(updatedCartData);
    setAddedToBag(true);
    setTimeout(()=>{
     setAddedToBag(false);
    },5000)
  }
 
  
  return (
    <>
     <NavBar/>
     {addedToBag && (
     <>
          <div id="success-modal" className="fixed inset-0 z-50 overflow-auto bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg w-96 p-6">

              <svg className="w-12 h-12 mx-auto mb-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>

              <p className="text-lg text-center text-gray-800">Your item has been successfully added to the bag!</p>

              <button onClick={()=>setAddedToBag(false)} id="close-success-modal" className="block mx-auto mt-4 px-4 py-2 bg-green-500 text-white rounded-lg focus:outline-none">Close</button>
            </div>
          </div>
      </>
     )}
     <div className="bg-white">
      <div className="pt-6">
      <nav aria-label="Breadcrumb">
      <ol role="list" className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            {Details[0].breadcrumbs.map((breadcrumb,index) => (
              <li key={breadcrumb.id+index}>
                <div className="flex items-center">
                  <a href={breadcrumb.href} className="mr-2 text-sm font-medium text-gray-900">
                    {breadcrumb.name}
                  </a>
                  <svg
                    width={16}
                    height={20}
                    viewBox="0 0 16 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-5 w-4 text-gray-300"
                  >
                    <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                  </svg>
                </div>
              </li>
            ))}
           
            <li className="text-sm">
              <a href={"#"} aria-current="page" className="font-medium text-gray-500 hover:text-gray-600">
                {Details[0].name.filter((item: { id: number; })=>item.id === ID ).map((name: { name: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; },index: any)=> (
                  <h1>{name.name}</h1>
                ))}
              </a>
            </li>
          </ol>
      </nav>
      {/* Image gallery */}
       <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
          <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
            <img
              src={Details[0].images[ID-1].src}
              alt={Details[0].images[ID-1].alt}
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
            <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
              <img
                src={Details[0].images1[ID-1].src}
                alt={Details[0].images[ID-1].alt}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
              <img
                src={Details[0].images2[ID-1].src}
                alt={Details[0].images2[ID-1].alt}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
          <div className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg">
            <img
             src={Details[0].images3[ID-1].src}
             alt={Details[0].images3[ID-1].alt}
              className="h-full w-full object-cover object-center"
            />
          </div>
      </div>

       {/* Product info */}
       <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
           <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <span className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{Details[0].name.filter((item: { id: number; })=>item.id === ID ).map((name: { name: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; },index: any)=> (
                  <h1>{name.name}</h1>
            ))}</span>
            </div>

          {/* Options */}
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl tracking-tight text-gray-900">
              {Details[0].price.filter((item: { id: number; })=>item.id === ID ).map((price: { price: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; },index: any)=> (
                <span>{"$"}{price.price}</span>
              ))}
            </p>

            {/* Reviews */}
            <div className="mt-6">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        reviews.average > rating ? 'text-gray-900' : 'text-gray-200',
                        'h-5 w-5 flex-shrink-0'
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="sr-only">{reviews.average} out of 5 stars</p>
                <a href={reviews.href} className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  {reviews.totalCount} reviews
                </a>
              </div>
            </div>

            <form className="mt-10" onSubmit={(e) => { e.preventDefault(); }}>
              <div className="mt-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
                </div>
                  <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
                  <input type="number" min="1" className="block w-full py-2 px-4 mt-3 border border-gray-600 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    onChange={(e)=>handleChange(e)}
                    value={selectedQuantity}
                  />
                  </div>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Add to bag
              </button>
            </form>
          </div>

          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
           
            <div>
              <h3 className="sr-only">Description</h3>

              <div className="space-y-6">
                <p className="text-base text-gray-900">{Details[0].description.filter((item: { id: number; })=>item.id === ID ).map((description: { description: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; },index: any)=> (
                <span>{description.description}</span>
              ))}</p>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-sm font-medium text-gray-900">Highlights</h3>

              <div className="mt-4">
                <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                  {Details[0].highlights.map((highlight:any) => (
                    <li key={highlight} className="text-gray-400">
                      <span className="text-gray-600">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-sm font-medium text-gray-900">Details</h2>

              <div className="mt-4 space-y-6">
                <p className="text-sm text-gray-600">{Details[0].details}</p>
              </div>
            </div>
          </div>


        </div>

      </div>
     </div>

    </>
  )
}
