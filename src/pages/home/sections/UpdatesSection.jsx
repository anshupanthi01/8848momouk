import { useState } from "react"
import { getPageSectionContent, useHomePage } from "@/lib/cms"
import { useTranslation } from "react-i18next"

export default function UpdatesSection() {
  const { t, i18n } = useTranslation("home")
  const homePage = useHomePage()
  const fallback = {
    title: t("updates.title"),
    readMore: t("updates.readMore"),
    showLess: "Show Less",
    posts: t("updates.posts", { returnObjects: true }) || [],
  }
  const updates = getPageSectionContent(homePage, "updates", fallback, i18n.language)
  const posts = Array.isArray(updates.posts) ? updates.posts : fallback.posts

  // Track expanded cards
  const [expanded, setExpanded] = useState(null)

  return (
    <section className="overflow-x-hidden bg-white au-body-font">
      <div className="mx-auto max-w-[1180px] px-5 pb-6 pt-14 md:px-10 md:pb-8 md:pt-20">
        <h2 className="shoem-font text-[clamp(2rem,5vw,3.5rem)] font-bold uppercase leading-none text-[#21408e]">
          {updates.title || fallback.title}
        </h2>

        <div className="grid gap-10 mt-10 md:grid-cols-3 md:gap-10">
          {posts.map((post, index) => (
            <article
              key={post.key || `${post.title}-${index}`}
              className="flex flex-col h-full min-w-0 group au-reveal"
            >
              <a
                href={post.href || "#"}
                className="block w-full overflow-hidden bg-[#edf2ff]"
              >
                <img
                  src={post.img}
                  alt={post.alt || post.title}
                  className="aspect-[1.53/1] w-full max-w-full object-cover transition duration-500 ease-out group-hover:scale-[1.04]"
                  loading="lazy"
                />
              </a>

              {/* Title */}
              <h3 className="mt-6 min-w-0 text-[1.42rem] font-extrabold leading-[1.22] text-[#de1d3d] md:text-[1.55rem]">
                <a
                  href={post.href || "#"}
                  className="block truncate transition-colors hover:text-[#21408e] min-w-0"
                  title={post.title}
                >
                  {post.title}
                </a>
              </h3>

              <div className="min-w-0 pt-4 mt-auto">
                {/* Description */}
                <p
                  className={`text-[0.9rem] font-normal leading-[1.55] text-[#21408e] min-w-0 break-words ${
                    expanded === index ? "" : "line-clamp-2"
                  }`}
                >
                  {post.excerpt}
                </p>

                {/* Read More */}
                <button
                  onClick={() =>
                    setExpanded(expanded === index ? null : index)
                  }
                  className="mt-3 inline-block text-[0.78rem] font-extrabold uppercase tracking-[0.04em] text-[#de1d3d] transition-colors hover:text-[#21408e]"
                >
                  {expanded === index
                    ? updates.showLess || fallback.showLess
                    : updates.readMore || fallback.readMore}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}