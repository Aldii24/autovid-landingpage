'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {ChevronDown, Download} from 'lucide-react';
import {usePathname} from 'next/navigation';
import type {Locale} from '../content';
import {path} from '../content';
import {Brand} from './Brand';
import {Button} from './ui/button';

export function HeaderV2({locale}: {locale: Locale}) {
  const pathname=usePathname();
  const clean=pathname.replace(/^\/en(?=\/|$)/,'')||'/';
  const enPath=`/en${clean==='/'?'':clean}`;
  const labels=locale==='id'?{features:'Fitur',faq:'FAQ',guide:'Panduan'}:{features:'Features',faq:'FAQ',guide:'Guide'};
  return <header className="sticky top-0 z-50 border-b border-black/[.07] bg-[#f5f2ec]/90 backdrop-blur-xl">
    <div className="mx-auto flex h-[72px] w-[min(1180px,calc(100%-32px))] items-center justify-between">
      <a href={path(locale)} aria-label="AutoVid home"><Brand /></a>
      <nav className="hidden items-center gap-8 text-[13px] font-semibold text-[#686159] md:flex"><a className="hover:text-black" href={path(locale,'/features')}>{labels.features}</a><a className="hover:text-black" href={path(locale,'/faq')}>{labels.faq}</a><a className="hover:text-black" href={path(locale,'/installation')}>{labels.guide}</a></nav>
      <div className="flex items-center gap-2">
        <DropdownMenu.Root><DropdownMenu.Trigger className="inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-xs font-bold text-[#5f5952] outline-none hover:bg-black/5" aria-label="Language">{locale==='id'?'ID':'EN'}<ChevronDown className="size-3.5" /></DropdownMenu.Trigger><DropdownMenu.Portal><DropdownMenu.Content align="end" sideOffset={8} className="z-[60] min-w-32 rounded-xl border border-black/10 bg-white p-1.5 shadow-xl"><DropdownMenu.Item asChild><a href={clean} className="block cursor-pointer rounded-lg px-3 py-2 text-xs font-semibold outline-none hover:bg-[#f2eee6]">🇮🇩 Indonesia</a></DropdownMenu.Item><DropdownMenu.Item asChild><a href={enPath} className="block cursor-pointer rounded-lg px-3 py-2 text-xs font-semibold outline-none hover:bg-[#f2eee6]">🇬🇧 English</a></DropdownMenu.Item></DropdownMenu.Content></DropdownMenu.Portal></DropdownMenu.Root>
        <Button asChild size="sm" variant="accent"><a href={path(locale,'/download')}><span className="hidden sm:inline">Download</span><Download className="size-4" /></a></Button>
      </div>
    </div>
  </header>;
}
