/**
 * Placeholder brand lockup, recreated in markup.
 *
 * Deliberately NOT the institution's real logo file — the layout slot is
 * rebuilt from a generic circular mark plus initials so no copied asset ships
 * with this clone.
 */
export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex select-none items-center gap-1.5" aria-label="CU IMS">
      <span
        className={[
          'flex shrink-0 items-center justify-center rounded-full bg-cu-red font-black leading-none text-white',
          compact ? 'h-[30px] w-[30px] text-[13px]' : 'h-[38px] w-[38px] text-[16px]',
        ].join(' ')}
      >
        CU
      </span>
      <span className="leading-none">
        <span
          className={[
            'block font-black tracking-tight text-[#3A3A3A]',
            compact ? 'text-[17px]' : 'text-[22px]',
          ].join(' ')}
        >
          IMS
        </span>
        {/* The tagline is dropped on phones so the topbar's icons still fit. */}
        {!compact && (
          <span className="mt-0.5 block text-[5.5px] font-medium uppercase leading-tight tracking-[0.02em] text-[#8A8A8A]">
            Placeholder University
            <br />
            Information Management System
          </span>
        )}
      </span>
    </span>
  )
}
