import React, { useState } from 'react';
import Router from 'next/router';
import Send from '../img/send.png';
import Image from 'next/image';
import LogoutIcon from '../img/Shape.svg';
import FaqIcon from '../img/Vector.svg';
import ExaIcon from '../img/4.svg';
import { useClerk } from '@clerk/clerk-react';
import Link from 'next/link';

const Sidebar = () => {
  const [mSidebar, setMSidebar] = useState(false);
  const [clickUser, setClickUser] = useState(false);

  const { signOut } = useClerk();

  const sidebar = () => {
    setMSidebar(!mSidebar);
  };

  const pageRefresh = () => {
    // Router.reload(window.location.pathname);
  };

  const logout = () => {};
  return (
    <div>
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        onClick={sidebar}
        className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clip-rule="evenodd"
            fill-rule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="default-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          !mSidebar
            ? '-translate-x-full lg:translate-x-0'
            : 'translate-x-0 lg:-translate-x-full'
        }`}
        aria-label="Sidebar"
      >
        <div className="relative h-full px-3 py-4 overflow-hidden bg-[#2C2C2C]">
          <div
            onClick={sidebar}
            className="absolute right-4 top-6 inline-flex lg:hidden items-center justify-center w-3 h-3 p-3 ml-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full"
          >
            <span className="-mt-[7px] text-2xl">x</span>
          </div>
          <div className="flex items-center justify-between flex-col h-[90vh]">
            <ul className="space-y-2">
              <li>
                <div className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg">
                  <div className="flex items-center justify-between w-64">
                    <h1 className="mb-4 text-4xl font-extrabold text-gray-900 md:text-4xl lg:text-4xl">
                      <span className="text-[#EDF4F4] pl-8 text-[24px]">
                        Basic
                      </span>
                    </h1>
                  </div>
                </div>
              </li>
              <li>
                <div
                  onClick={pageRefresh}
                  style={{
                    boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.18)',
                    borderRadius: '0px 16px 16px 0px',
                  }}
                  className={`flex cursor-pointer items-center bg-black p-4 mr-8 hover:bg-black ${
                    clickUser && 'bg-gray-100'
                  }`}
                >
                  <span className="text-[#EDF4F4] pl-8 text-[16px]">
                    New Conversation
                  </span>
                </div>
              </li>
              <li>
                <div className={`flex items-center p-4 pl-8 mr-8`}>
                  <div>
                    <Image src={ExaIcon} alt="example" />
                  </div>
                  <span className="text-[#A4B0B4] pl-2 text-[16px]">
                    example 1
                  </span>
                </div>
              </li>
            </ul>
            <ul className="space-y-2">
              <li>
                <div className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg">
                  <div className="flex items-center justify-between w-64">
                    <h1 className="mb-4 text-4xl font-extrabold text-gray-900 md:text-4xl lg:text-4xl">
                      {/* <span className="text-[#EDF4F4] pl-8 text-[24px]">Basic</span> */}
                    </h1>
                  </div>
                </div>
              </li>

              <li>
                <div className={`flex items-center p-4 pl-8 mr-8`}>
                  <div>
                    <Image src={FaqIcon} alt="faq" />
                  </div>
                  <span className="text-[#A4B0B4] pl-2 text-[16px]">Faq</span>
                </div>
              </li>
              <li>
                <Link
                  href="/"
                  className={`flex cursor-pointer items-center p-4 pl-8 mr-8`}
                  onClick={() => signOut()}
                >
                  <div>
                    <Image src={LogoutIcon} alt="logout" />
                  </div>
                  <span className="text-[#A4B0B4] pl-2 text-[16px]">
                    Logout
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
