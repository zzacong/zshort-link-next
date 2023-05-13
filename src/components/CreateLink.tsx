import type { ChangeEventHandler, FormEventHandler } from 'react';
import { useCallback, useState } from 'react';

import clsx from 'clsx';
import random from 'random-words';
import debounce from 'lodash/debounce';
import { ClipboardIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { Popover } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import copy from 'copy-to-clipboard';

import { api } from '$lib/api';

type Form = {
  slug: string;
  url: string;
};

export default function CreateLinkForm() {
  const [form, setForm] = useState<Form>({ slug: '', url: '' });
  const url = `${window.location.origin}/r`;

  const slugCheck = api.slug.slugCheck.useQuery(
    { slug: form.slug },
    {
      refetchOnReconnect: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
  const createSlug = api.slug.createSlug.useMutation();

  const onChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    e => {
      setForm({
        ...form,
        slug: e.target.value,
      });
      debounce(slugCheck.refetch, 100);
    },
    [form, slugCheck.refetch]
  );

  const onRandom = useCallback(() => {
    const slug = random({ min: 1, max: 2, join: '-' });
    setForm({
      ...form,
      slug,
    });
    void slugCheck.refetch();
  }, [form, slugCheck]);

  const onSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    e => {
      e.preventDefault();
      createSlug.mutate({ ...form });
    },
    [createSlug, form]
  );

  const onCopy = useCallback(
    (close: () => void) => {
      setTimeout(() => close(), 1200);
      copy(`${url}/${form.slug}`);
    },
    [form.slug, url]
  );

  return (
    <div className="w-full max-w-xl md:w-2/3 xl:w-1/2">
      <h1 className="mb-20 text-center text-4xl font-extrabold tracking-wider xl:text-6xl">
        Link Shortner
      </h1>

      {createSlug.status === 'success' ? (
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 md:gap-4">
            <h2 className="flex-grow break-all rounded bg-white/90 px-4 py-2 font-mono text-lg text-gray-800 lg:text-xl">{`${url}/${form.slug}`}</h2>

            <Popover className="relative flex">
              {({ open, close }) => (
                <>
                  <Popover.Button onClick={() => onCopy(close)} className="button copy-btn">
                    <ClipboardIcon className="h-6 w-6" />
                  </Popover.Button>

                  <AnimatePresence>
                    {open && (
                      <Popover.Panel
                        static
                        as={motion.div}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-full right-1/2 z-10 -translate-y-4 translate-x-1/2 whitespace-nowrap rounded-lg bg-white/90 px-4 py-2 text-sm text-gray-800"
                      >
                        <span
                          className={clsx(
                            'relative',
                            "after:absolute after:left-1/2 after:top-[calc(100%+10px)] after:h-0 after:w-0 after:-translate-x-1/2 after:border-x-8 after:border-t-8 after:border-x-transparent after:border-t-white/90  after:content-['']"
                          )}
                        >
                          Copied successfully
                        </span>
                      </Popover.Panel>
                    )}
                  </AnimatePresence>
                </>
              )}
            </Popover>
          </div>

          <button
            className="cursor-pointer rounded bg-blue-500 px-4 py-2 font-bold hover:bg-blue-600"
            onClick={() => {
              createSlug.reset();
              setForm({ slug: '', url: '' });
            }}
          >
            Reset
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {slugCheck.data?.used && (
            <span className="text-center font-medium text-red-400">Slug already in use.</span>
          )}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center md:gap-4">
            <span className="break-all font-mono font-medium">{url}/</span>
            <div className="flex flex-1 flex-wrap gap-2 md:gap-4">
              <input
                type="text"
                onChange={onChange}
                minLength={1}
                placeholder="rothaniel"
                className={clsx(
                  'input',
                  slugCheck.isFetched && slugCheck.data?.used && 'border-red-500 text-red-500'
                )}
                value={form.slug}
                pattern={'^[-a-zA-Z0-9]+$'}
                title="Only alphanumeric characters and hypens are allowed. No spaces."
                required
              />
              <button type="button" className="button" onClick={onRandom}>
                <ArrowPathIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center md:gap-4">
            <span className="text-lg font-medium">Link</span>
            <input
              type="url"
              onChange={e => setForm({ ...form, url: e.target.value })}
              placeholder="https://google.com"
              className="input"
              required
            />
          </div>

          <button
            type="submit"
            className="button bg-blue-500 hover:bg-blue-600"
            disabled={slugCheck.isFetched && slugCheck.data?.used}
          >
            Create
          </button>
        </form>
      )}
    </div>
  );
}
