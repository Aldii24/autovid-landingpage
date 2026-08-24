import Image from 'next/image';
import {cn} from '../lib/utils';

export function Brand({className}: {className?: string}) {
  return <span className={cn('inline-flex items-center gap-2.5',className)}><span className="grid size-9 place-items-center overflow-hidden rounded-[11px] bg-white ring-1 ring-black/10"><Image src="/autovid-logo-v2.png" alt="" width={32} height={32} className="size-8 object-contain" /></span><b className="text-[18px] font-extrabold tracking-[-.045em]">AutoVid</b></span>;
}
