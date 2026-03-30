import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 300 300" fill="currentColor" aria-hidden="true">
      <path d="M178.57 127.15 290.27 0h-26.46l-97.03 110.38L89.34 0H0l117.13 166.93L0 300.1h26.46l102.4-116.59 81.8 116.59h89.34M36.01 19.54H76.66l187.13 262.13h-40.66" />
    </svg>
  );
}

export default function Home() {
  const posts = getAllPosts();

  return (
    <main className="max-w-[640px] mx-auto px-6 py-20">
      {/* Header */}
      <div className="mb-16">
        <h1 className="text-[22px] font-semibold tracking-tight text-[#111] mb-3">
          Shiv Patel
        </h1>
        <p className="text-[15px] text-[#555] leading-relaxed mb-8 max-w-[480px]">
          Software engineer. Sharing engineering notes, opinions, product thinking,
          and lessons learned along the way.
        </p>
        <div className="flex items-center gap-5">
          <a
            href="https://github.com/shivpatel"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[13px] text-[#888] hover:text-[#111] transition-colors duration-150"
          >
            <GitHubIcon />
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/0x1100"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[13px] text-[#888] hover:text-[#111] transition-colors duration-150"
          >
            <LinkedInIcon />
            LinkedIn
          </a>
          <a
            href="https://x.com/shivpatel"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[13px] text-[#888] hover:text-[#111] transition-colors duration-150"
          >
            <XIcon />
            X
          </a>
        </div>
      </div>

      {/* Thoughts list */}
      <div>
        <p className="text-[11px] font-medium tracking-widest text-[#bbb] uppercase mb-6">
          Thoughts
        </p>

        {posts.length === 0 ? (
          <p className="text-[14px] text-[#999]">Nothing here yet.</p>
        ) : (
          <ul>
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/thoughts/${post.slug}/`}
                  className="group flex items-baseline justify-between py-4 border-b border-[#f0f0f0] first:border-t"
                >
                  <span className="text-[15px] text-[#111] group-hover:text-[#888] transition-colors duration-150 leading-snug pr-8">
                    {post.title}
                  </span>
                  {post.date && (
                    <span className="text-[12px] text-[#ccc] shrink-0 tabular-nums">
                      {new Date(post.date + "T00:00:00").toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
