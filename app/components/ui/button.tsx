'use client';

import * as React from 'react';
import {Slot} from '@radix-ui/react-slot';
import {cva, type VariantProps} from 'class-variance-authority';
import {cn} from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold tracking-[-0.01em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6338] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-45',
  {variants:{variant:{default:'bg-[#191816] text-white hover:-translate-y-0.5 hover:bg-[#ff6338]',accent:'bg-[#ff6338] text-white shadow-[0_8px_24px_rgba(255,99,56,.22)] hover:-translate-y-0.5 hover:bg-[#e95129]',outline:'border border-[#d6d0c5] bg-white/70 text-[#191816] hover:border-[#191816] hover:bg-white',ghost:'text-[#4f4a43] hover:bg-black/5 hover:text-[#191816]'},size:{default:'h-12 px-6',sm:'h-10 px-4 text-xs',lg:'h-14 px-7 text-[15px]'}},defaultVariants:{variant:'default',size:'default'}}
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {asChild?: boolean}

export function Button({className, variant, size, asChild=false, ...props}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return <Comp className={cn(buttonVariants({variant,size,className}))} {...props} />;
}

export {buttonVariants};
