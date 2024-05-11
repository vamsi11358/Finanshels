
import { useEffect, useState } from 'react'
import { StarIcon } from '@heroicons/react/20/solid'
import { RadioGroup } from '@headlessui/react'
import { useRouter } from 'next/router';
import useStore from "../../store";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import NavBar from '@/pages/navBar';



function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
interface ProductOverviewProps {
    params: {
      id: string;
    };
  }
  interface Product {
    id: number;
    title: string[];
    price: number;
    description: string;
    category: string;
    image: string;
    rating: {
      rate: number;
      count: number;
    };
  }
  
  const initialProduct: Product = {
    id: 1,
    title: ["Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops"],
    price: 109.95,
    description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    rating: {
      rate: 3.9,
      count: 120
    }
  };
export default function ProductDetails1() {
  const {updateCartData ,cartData} = useStore();
  const [addedToBag, setAddedToBag] = useState(false);
  const [data, setData] = useState<Product>(initialProduct);
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const router = useRouter();
  const { id } = router.query; 

  let ID: number;
  useEffect(() => {
    const fetchData = async () => {
      if (id && typeof id === 'string') {
        const ID = parseInt(id, 10);
        try {
          const res = await axios.get(`https://fakestoreapi.com/products/${ID}`);
          setData(res.data);
        } catch (error) {
          console.error('Error fetching product data:', error);
        }
      }
    };

    fetchData();
  }, [id]);


  //
  const product = {
    name: `${data.title}`,
    price: `${data.price}`,
    href: '#',
    breadcrumbs: [
      { id: 1, name: 'Men', href: '#' },
      { id: 2, name: 'Clothing', href: '#' },
    ],
    images: [
      {
        src: `${data.image}`,
        alt: 'Two each of gray, white, and black shirts laying flat.',
      },
      {
        src: `${data.image}`,
        alt: 'Model wearing plain black basic tee.',
      },
      {
        src: `${data.image}`,
        alt: 'Model wearing plain gray basic tee.',
      },
      {
        src: `${data.image}`,
        alt: 'Model wearing plain white basic tee.',
      },
    ],
    colors: [
      { name: 'White', class: 'bg-white', selectedClass: 'ring-gray-400' },
      { name: 'Gray', class: 'bg-gray-200', selectedClass: 'ring-gray-400' },
      { name: 'Black', class: 'bg-gray-900', selectedClass: 'ring-gray-900' },
    ],
    sizes: [
      { name: 'XXS', inStock: false },
      { name: 'XS', inStock: true },
      { name: 'S', inStock: true },
      { name: 'M', inStock: true },
      { name: 'L', inStock: true },
      { name: 'XL', inStock: true },
      { name: '2XL', inStock: true },
      { name: '3XL', inStock: true },
    ],
    description:
      `${data.description}`,
    highlights: [
      'Hand cut and sewn locally',
      'Dyed with our proprietary colors',
      'Pre-washed & pre-shrunk',
      'Ultra-soft 100% cotton',
    ],
    details:
     `${data.category}`,
  }
  const reviews = { href: '#', average: parseFloat(`${data.rating.rate}`), totalCount: parseFloat(`${data.rating.count}`) }
  //

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
    const filteredPrice =  data.price;
      const filteredName =  data.title;

    const uniqueId = uuidv4();
    let obj = {
        id:uniqueId,
        name: filteredName,
        href: '#',
        color: '',
        price: filteredPrice,
        quantity: selectedQuantity,
        imageSrc: data.image,
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
            {product.breadcrumbs.map((breadcrumb) => (
              <li key={breadcrumb.id}>
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
              <a href={product.href} aria-current="page" className="font-medium text-gray-500 hover:text-gray-600">
                {product.name}
              </a>
            </li>
          </ol>
        </nav>

        {/* Image gallery */}
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
          <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
            <img
              src={product.images[0].src}
              alt={product.images[0].alt}
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg">
            <img
              src={product.images[3].src}
              alt={product.images[3].alt}
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>

        {/* Product info */}
        <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{product.name}</h1>
          </div>

          {/* Options */}
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl tracking-tight text-gray-900">{'$'}{product.price}</p>

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
                onClick={handleSubmit}
                type="submit"
                className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Add to bag
              </button>
            </form>
          </div>

          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
            {/* Description and details */}
            <div>
              <h3 className="sr-only">Description</h3>

              <div className="space-y-6">
                <p className="text-base text-gray-900">{product.description}</p>
              </div>
            </div>

            {/* <div className="mt-10">
              <h3 className="text-sm font-medium text-gray-900">Highlights</h3>

              <div className="mt-4">
                <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                  {product.highlights.map((highlight) => (
                    <li key={highlight} className="text-gray-400">
                      <span className="text-gray-600">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div> */}

            <div className="mt-10">
              <h2 className="text-sm font-medium text-gray-900">Details</h2>

              <div className="mt-4 space-y-6">
                <p className="text-sm text-gray-600">{product.details}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
