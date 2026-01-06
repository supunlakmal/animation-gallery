"use client";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="hero grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8 items-center">
      <div className="hero__left px-4 text-center lg:text-left">
        {/* <div className="hero__stats flex justify-center lg:justify-start gap-8 mb-6">
          <div className="stat text-left">
            <div className="text-2xl font-semibold text-[var(--stat)]">+20</div>
            <div className="text-sm text-[var(--text-muted)]">Project completed</div>
          </div>
          <div className="stat text-left">
            <div className="text-2xl font-semibold text-[var(--stat)]">+4</div>
            <div className="text-sm text-[var(--text-muted)]">Startup raised</div>
          </div>
        </div> */}

        <h1 className="hero__heading">
          <div className="glitch-container">
            <span className="glitch glitch-text-1" data-text="Hello">
              Hello
            </span>
            <span className="glitch glitch-text-2" data-text="I'm Supun Lakmal">
              I&#39;m Supun Lakmal
            </span>
            <span className="glitch glitch-text-3" data-text="Full Stack Developer">
              Full Stack Developer
            </span>
            <span className="glitch glitch-text-4" data-text="Vibe Coder">
              Vibe Coder
            </span>
          </div>
        </h1>
        {/* <p className="hero__sub mt-4 text-[var(--text-muted)]">— It&#39;s Supun Lakmal</p> */}

        {/* <div className="mt-8 flex justify-center lg:justify-start gap-4">
          <a href="#projects" className="inline-block bg-[var(--accent)] text-white px-6 py-3 rounded-full hover:opacity-90">
            View Work
          </a>
          <a href="#contact" className="inline-block border border-[var(--divider)] text-[var(--text-primary)] px-6 py-3 rounded-full">
            Book A Call
          </a>
        </div> */}
      </div>

      <div className="hero__right px-4 flex justify-center lg:justify-end">
        <div className="w-full max-w-md lg:max-w-full">
          <Image src="/supunlakmal.png" alt="Supun Lakmal" width={1200} height={1200} className="hero__portrait rounded-lg bg-transparent" priority />
        </div>
      </div>
    </div>
  );
}
