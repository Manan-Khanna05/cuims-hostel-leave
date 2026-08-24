export default function Footer() {
  return (
    <footer className="mt-8 bg-cu-dark text-white safe-bottom">
      <div className="relative mx-auto flex max-w-[1500px] flex-col items-center gap-2 px-4 py-5 text-center text-[13px] md:flex-row md:justify-center md:gap-3 md:text-[15px]">
        <span className="font-bold">
          Chandigarh University, Gharuan, Mohali (Punjab)
        </span>
        <span className="hidden text-white/50 md:inline">|</span>
        <span>
          <span className="font-bold">Helpline:</span> 1800 257 1800
        </span>
        <span className="hidden text-white/50 md:inline">|</span>
        <span>
          <span className="font-bold">Email:</span> studentcare@cumail.in
        </span>
        <a
          href="mailto:studentcare@cumail.in?subject=Report%20a%20Bug"
          className="font-semibold text-[#FF6B6B] hover:underline md:absolute md:right-6"
        >
          Report a Bug
        </a>
      </div>
    </footer>
  )
}
