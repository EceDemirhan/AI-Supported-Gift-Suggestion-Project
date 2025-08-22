/* eslint-disable prettier/prettier */
import React, { Fragment, useEffect, useState } from "react";

import { Popover, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-scroll";

import config from "../config/index.json";

const Menu = () => {
  const { navigation, company } = config;
  const { name: companyName, logo } = company;

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loginStatus);
  }, []);

  const handleFavoriClick = () => {
    if (isLoggedIn) {
      window.dispatchEvent(new CustomEvent("show-favori-modal"));
    } else {
      window.dispatchEvent(new CustomEvent("show-login-modal"));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    window.location.reload();
  };

  return (
    <>
      <svg
        className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-background transform translate-x-1/2"
        fill="currentColor"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polygon points="50,0 100,0 50,100 0,100" />
      </svg>

      <Popover>
        <div className="relative pt-6 pl-2 sm:pl-4 lg:pl-6 pr-0 lg:pr-0 xl:pr-0 lg:ml-[-42px]">
          <nav
            className="relative flex items-center justify-between sm:h-10 lg:justify-start w-full"
            aria-label="Global"
          >
            
            <div className="flex items-center">
              <div className="flex items-center gap-4">
                <a href="#" className="logo-link">
                  <span className="sr-only">{companyName}</span>
                  <img alt="logo" className="h-40 w-auto sm:h-36 lg:h-48" src={logo} />
                </a>

              
 <div className="md:hidden absolute right-3 top-12">
  <Popover.Button className="bg-background rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-secondary">
    <span className="sr-only">Open main menu</span>
    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
  </Popover.Button>
</div>
              </div>
            </div>

           
            <div className="hidden md:flex md:items-center text-sm lg:text-base flex-nowrap whitespace-nowrap">
            
              <div className="flex items-center space-x-3">
                {navigation.map((item) =>
                  item.href === "favorimodal" ? (
                    <span
                      key={item.name}
                      onClick={handleFavoriClick}
                      className="cursor-pointer font-medium text-gray-500 hover:text-red-600"
                    >
                      {item.name}
                    </span>
                  ) : (
                    <Link
                      spy={true}
                      active="active"
                      smooth={true}
                      duration={1000}
                      key={item.name}
                      to={item.href}
                      className="cursor-pointer font-medium text-gray-500 hover:text-red-600 border-b-0 hover:!border-b-0"
                    >
                      {item.name}
                    </Link>
                  )
                )}
              </div>

              <div className="flex items-center space-x-2 pl-8 ml-auto
+                 mr-[-0.5rem] sm:mr-[-1rem] lg:mr-[-2rem] xl:mr-[-3rem]">
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="text-sm text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-100"
                  >
                    Çıkış Yap
                  </button>
                ) : (
                  <>
                    {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                    <a
                      href="/login"
                      className="text-sm text-white bg-gradient-to-r from-red-600 to-red-400 hover:from-red-700 hover:to-red-500 px-3 py-1 rounded transition disabled:opacity-60"
                    >
                      Giriş Yap
                    </a>
                    {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                    <a
                      href="/register"
                      className="text-sm text-red-600 border border-red-600 bg-white px-3 py-1 rounded hover:bg-red-50 active:bg-red-100 transition"
                    >
                      Kayıt Ol
                    </a>
                  </>
                )}
              </div>
            </div>
          </nav>
        </div>

        {/* Mobile Panel */}
        <Transition
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            focus
            className="absolute z-10 top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
          >
            <div className="rounded-lg shadow-md bg-background ring-1 ring-black ring-opacity-5 overflow-hidden">
              <div className="px-5 pt-4 flex items-center justify-between">
                <div>
                  <img className="h-16 w-auto" src={logo} alt="" />
                </div>
                <div className="-mr-2">
                  <Popover.Button className="bg-background rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-secondary">
                    <span className="sr-only">Close main menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>

              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) =>
                  item.href === "favorimodal" ? (
                    <span
                      key={item.name}
                      onClick={handleFavoriClick}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </span>
                  ) : (
                    <Link
                      spy={true}
                      active="active"
                      smooth={true}
                      duration={1000}
                      key={item.name}
                      to={item.href}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </Link>
                  )
                )}

                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-100"
                  >
                    Çıkış Yap
                  </button>
                ) : (
                  <>
                    {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                    <a
                      href="/login"
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-100"
                    >
                      Giriş Yap
                    </a>
                    
                    {/* <a href="/register" className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-100">Kayıt Ol</a> */}
                  </>
                )}
              </div>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
    </>
  );
};

export default Menu;