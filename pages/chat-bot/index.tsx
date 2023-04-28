import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import styles from '@/styles/Home.module.css';
import { Message } from '@/types/chat';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import LoadingDots from '@/components/ui/LoadingDots';
import { Document } from 'langchain/document';
import { useUser } from '@clerk/nextjs';
import { useClerk } from '@clerk/clerk-react';
import Link from 'next/link';
import {
  BiLogOut,
  BiTone,
  BiRadar,
  BiXCircle,
  BiLinkExternal,
  BiDockLeft,
  BiCodeBlock,
  BiIntersect,
} from 'react-icons/bi';
import GuidlineBox from '@/src/components/GuidlineBox';

export default function Home() {
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [sourceDocs, setSourceDocs] = useState<Document[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [messageState, setMessageState] = useState<{
    messages: Message[];
    pending?: string;
    history: [string, string][];
    pendingSourceDocs?: Document[];
  }>({
    messages: [
      {
        message: 'Hi, what would you like to learn about this legal case?',
        type: 'apiMessage',
      },
    ],
    history: [],
    pendingSourceDocs: [],
  });
  const [mSidebar, setMSidebar] = useState(false);
  const [clickUser, setClickUser] = useState(false);

  const { signOut } = useClerk();

  const sidebar = () => {
    setMSidebar(!mSidebar);
  };
  const pageRefresh = () => {
    // Router.reload(window.location.pathname);
  };
  const { messages, pending, history, pendingSourceDocs } = messageState;
  const { user } = useUser();

  const messageListRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  //handle form submission
  async function handleSubmit(e: any) {
    e.preventDefault();

    setError(null);

    if (!query) {
      alert('Please input a question');
      return;
    }

    const question = query.trim();

    setMessageState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        {
          type: 'userMessage',
          message: question,
        },
      ],
      pending: undefined,
    }));

    setLoading(true);
    setQuery('');
    setMessageState((state) => ({ ...state, pending: '' }));

    const ctrl = new AbortController();

    try {
      fetchEventSource('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          history,
        }),
        signal: ctrl.signal,
        onmessage: (event) => {
          if (event.data === '[DONE]') {
            setMessageState((state) => ({
              history: [...state.history, [question, state.pending ?? '']],
              messages: [
                ...state.messages,
                {
                  type: 'apiMessage',
                  message: state.pending ?? '',
                  sourceDocs: state.pendingSourceDocs,
                },
              ],
              pending: undefined,
              pendingSourceDocs: undefined,
            }));
            setLoading(false);
            ctrl.abort();
          } else {
            const data = JSON.parse(event.data);
            if (data.sourceDocs) {
              setMessageState((state) => ({
                ...state,
                pendingSourceDocs: data.sourceDocs,
              }));
            } else {
              setMessageState((state) => ({
                ...state,
                pending: (state.pending ?? '') + data.data,
              }));
            }
          }
        },
      });
    } catch (error) {
      setLoading(false);
      setError('An error occurred while fetching the data. Please try again.');
      console.log('error', error);
    }
  }

  //prevent empty submissions
  const handleEnter = useCallback(
    (e: any) => {
      if (e.key === 'Enter' && query) {
        handleSubmit(e);
      } else if (e.key == 'Enter') {
        e.preventDefault();
      }
    },
    [query],
  );

  const chatMessages = useMemo(() => {
    return [
      ...messages,
      ...(pending
        ? [
            {
              type: 'apiMessage',
              message: pending,
              sourceDocs: pendingSourceDocs,
            },
          ]
        : []),
    ];
  }, [messages, pending, pendingSourceDocs]);

  //scroll to bottom of chat
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <>
      {/* sidebar start */}
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
            className="absolute right-4 top-6 inline-flex lg:hidden items-center justify-center w-3 h-3 p-3 ml-3 text-sm font-medium rounded-full"
          >
            <span className="-mt-[7px] text-2xl">
              <BiXCircle color="white" size="24px" />
            </span>
          </div>
          <div className="flex items-center justify-between flex-col h-[90vh]">
            <ul className="space-y-2">
              <li>
                <div className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg">
                  <div className="flex items-start justify-between w-64 flex-col">
                    <h1 className="mb-4 mx-2 text-center font-extrabold flex items-center justify-center text-gray-900 md:text-4xl lg:text-4xl">
                      <li>
                        <div
                          style={{
                            boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.18)',
                            borderRadius: '0px 16px 16px 0px',
                          }}
                          className={`flex items-center justify-center w-60 bg-black p-2 mt-10 lg:mt-0 hover:bg-black`}
                        >
                          <span className="text-[#EDF4F4] text-[20px]">
                            Tax Buddy AI
                          </span>
                        </div>
                      </li>
                    </h1>
                    <div className="flex items-start flex-col text-[#EDF4F4] mx-4 text-[18px] font-bold mt-10">
                      <span className="-ml-[5px] cursor-pointer">
                        <GuidlineBox />
                      </span>
                      <div className="flex items-start justify-start">
                        <div className="mt-0">
                          <BiLinkExternal color="white" size="24px" />
                        </div>
                        <div className="ml-2">
                          <p className="text-[16px] mb-0">
                            {` If you are looking to build AI solution or want to help building open-source AI models, please visit`}
                          </p>
                          <Link
                            href="https://unitaslink.com"
                            target="_blanck"
                            className="underline underline-offset-4 text-[16px]"
                          >
                            https://unitaslink.com
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
            <ul className="absolute bottom-8 lg:bottom-6 space-y-2">
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
                <Link
                  href="https://discord.com/invite/5CzBjMus"
                  className={`flex items-center text-[#EDF4F4] mx-6 text-[16px] font-bold cursor-pointer`}
                  target="_blanck"
                >
                  <div>
                    <BiIntersect color="white" size="26px" />
                  </div>
                  <span className="text-[white] pl-2">Join our discord</span>
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/UnitasLink/TaxBuddyAI"
                  className={`flex items-start text-[#EDF4F4] mx-6 text-[16px] font-bold cursor-pointer`}
                  target="_blanck"
                >
                  <div className="mt-[2px]">
                    <BiCodeBlock color="white" size="24px" />
                  </div>
                  <span className="text-[white] pl-2">
                    Contribute to our Open Source code
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/UnitasLink/TaxBuddyAI/tree/main/docs"
                  className={`flex items-start text-[#EDF4F4] mx-6 text-[16px] font-bold cursor-pointer`}
                  target="_blanck"
                >
                  <div className="mt-[2px]">
                    <BiDockLeft color="white" size="24px" />
                  </div>
                  <span className="text-[white] pl-2">
                    Contribute to training data set
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className={`flex items-center text-[#EDF4F4] mx-6 text-[16px] font-bold cursor-pointer`}
                  onClick={() => signOut()}
                >
                  <div>
                    <BiLogOut color="white" size="24px" />
                  </div>
                  <span className="text-[white] pl-2">Logout</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </aside>
      {/* sidebar end */}

      <div className="relative">
        {/* chatbot start */}
        <div className="bg-black relative lg:h-screen lg:ml-64 h-[94vh]">
          <div className=" bg-black p-[24px]">
            <div className="bg-[#2C2C2C] flex items-start rounded-[16px] p-[24px]">
              <div className="mt-[5px]">
                <BiTone color="white" />
              </div>
              <div className="text-white ml-2">
                {`I’m TaxBuddyAI, your AI powered tax assistant. I am developed by`}{' '}
                <Link
                  href="https://unitaslink.com"
                  target="_blank"
                  className="underline underline-offset-4"
                >
                  https://unitaslink.com.
                </Link>
              </div>
            </div>
            {chatMessages.map((message, idx) => {
              return (
                <div key={idx}>
                  {idx === 0 ? null : (
                    <>
                      <div className="bg-[#2C2C2C] rounded-[16px] p-[24px] mt-4">
                        <div className="text-white">
                          {idx % 2 !== 0 ? (
                            <div className="flex items-center">
                              <BiRadar color="white" className="mr-2" />
                              {message.message}
                            </div>
                          ) : null}
                          {idx % 2 == 0 ? (
                            <div className="text-[#A4B0B4;] bg-black rounded-[4px] p-2 mt-4">
                              {message.message}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
            <div className="h-16"></div>
          </div>

          {/* input ui start */}
          <div className="fixed bottom-0 w-[100%] xl:w-[calc(100%-16rem)]">
            <div className="border-y-2 border-[#717879]">
              <form onSubmit={handleSubmit}>
                <div className="relative">
                  <input
                    className="w-full text-white p-4 bg-black bottom-0"
                    disabled={loading}
                    onKeyDown={handleEnter}
                    autoFocus={false}
                    id="userInput"
                    name="userInput"
                    placeholder={
                      loading
                        ? 'Waiting for response.....'
                        : 'Enter a prompt here'
                    }
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className={`${styles.generatebutton} right-4`}
                  >
                    {loading ? (
                      <div className={styles.loadingwheel}>
                        <LoadingDots color="white" />
                      </div>
                    ) : (
                      // Send icon SVG in input field
                      <svg
                        viewBox="0 0 20 20"
                        className={styles.svgicon}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                      </svg>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
          {/* input ui end */}
        </div>
      </div>

      {/* chatbot end */}
    </>
  );
}
