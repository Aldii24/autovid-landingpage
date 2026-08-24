'use client';

import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import {Plus} from 'lucide-react';
import {cn} from '../../lib/utils';

export const Accordion=AccordionPrimitive.Root;
export const AccordionItem=React.forwardRef<React.ElementRef<typeof AccordionPrimitive.Item>,React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>>(({className,...props},ref)=><AccordionPrimitive.Item ref={ref} className={cn('border-b border-black/10',className)} {...props}/>);AccordionItem.displayName='AccordionItem';
export const AccordionTrigger=React.forwardRef<React.ElementRef<typeof AccordionPrimitive.Trigger>,React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>>(({className,children,...props},ref)=><AccordionPrimitive.Header className="flex"><AccordionPrimitive.Trigger ref={ref} className={cn('group flex flex-1 items-center justify-between gap-5 py-6 text-left text-[17px] font-bold tracking-[-.025em] outline-none hover:text-[#e8562f]',className)} {...props}>{children}<Plus className="size-5 shrink-0 transition-transform group-data-[state=open]:rotate-45"/></AccordionPrimitive.Trigger></AccordionPrimitive.Header>);AccordionTrigger.displayName='AccordionTrigger';
export const AccordionContent=React.forwardRef<React.ElementRef<typeof AccordionPrimitive.Content>,React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>>(({className,children,...props},ref)=><AccordionPrimitive.Content ref={ref} className="overflow-hidden text-sm text-[#6b645c] data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down" {...props}><div className={cn('max-w-2xl pb-7 pr-8 leading-7',className)}>{children}</div></AccordionPrimitive.Content>);AccordionContent.displayName='AccordionContent';
