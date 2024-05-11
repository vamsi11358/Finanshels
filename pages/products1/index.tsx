"use client"
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../navBar";
import { Fragment } from 'react'
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'

  const sortOptions = [
    { name: 'Most Popular', href: '#', current: true, value:" " },
    { name: 'Price: Low to High', href: '#', current: false,value:" " },
    { name: 'Price: High to Low', href: '#', current: false,value:" " },
  ]
  interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: {
      rate: number;
      count: number;
    };
  }
  
  const initialProducts: Product[] = [
    {
      "id": 1,
      "title": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
      "price": 109.95,
      "description": "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
      "category": "men's clothing",
      "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
      "rating": {
          "rate": 3.9,
          "count": 120
      }
    },
  ];
  
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
  }


  export default function ProductDetails1() {
    const DEBOUNCE_DELAY = 2000;
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    const [products1, setProducts1] = useState<Product[]>(initialProducts);
   
    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true); 
          const res = await axios.get("https://fakestoreapi.com/products");
          const filteredProducts = res.data.filter((product: Product) =>
            product.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setProducts1(filteredProducts);
          setLoading(false); 
        } catch (error) {
          console.error('Error fetching data:', error);
          setLoading(false); 
        }
      };
  
      const debounceFetchData = setTimeout(() => {
        fetchData();
      }, DEBOUNCE_DELAY);
  
      return () => clearTimeout(debounceFetchData);
    }, [searchQuery]);
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    };
  
    const sortProducts = (option: string) => {
      setLoading(true);
  
      setTimeout(() => {
        setLoading(false);
      }, 1000);
  
      if (option === 'Price: Low to High') {
        setProducts1([...products1].sort((a, b) => a.price - b.price));
      } else if (option === 'Price: High to Low') {
        setProducts1([...products1].sort((a, b) => b.price - a.price));
      }
      else{
        setProducts1([...products1]);
      }
    };
   
    return (
        <>
            {!loading && (
                <>
                 <NavBar/>
        <div className="flex items-baseline justify-between border-b border-gray-200 pb-5 pt-2 pl-5 pr-5">
            <input className="shadow appearance-none border rounded w-1/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="search" type="text" placeholder="Search" 
            onChange={(e)=>handleInputChange(e)}
            value={searchQuery}
            />
             <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sort
                    <ChevronDownIcon
                      className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <Menu.Item key={option.name}>
                          {({ active }) => (
                            <a
                              onClick={() => sortProducts(option.name)}
                              href={option.href}
                              className={classNames(
                                option.current ? 'font-medium text-gray-900' : 'text-gray-500',
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm'
                              )}
                            >
                              {option.name}
                            </a>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
              <button
                type="button"
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                //onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products1.map((product:Product) => (
            <div key={product.id} className="group relative">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                <img
                  src={product.image}
                  alt={'image'}
                  className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <a href={`productDetails1/${product.id}`}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.title}
                    </a>
                  </h3>
                 
                </div>
                <p className="text-sm font-medium text-gray-900">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
                </>
            )}
            {loading && (
                <>
                    <div className="flex items-center justify-center h-screen">
                        <svg className="animate-spin h-8 w-8 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 4.418 3.582 8 8 8v-4c-1.65 0-3.173-.64-4.299-1.709l-1.414 1.414z"></path>
                        </svg>
                    </div>
                </>
            )}
 </>



    )
  }
  