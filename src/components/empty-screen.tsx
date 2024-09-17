import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'

export function EmptyScreen() {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="flex flex-col gap-2 rounded-lg   bg-background p-8 items-center">
        {/* <h1 className="text-lg font-semibold">
          
        </h1> */}
        <img src='/graphics/logo.png' className='max-w-sm' />
      </div>
    </div>
  )
}
