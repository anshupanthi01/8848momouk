export default function SectionTitle({ kicker, title }) {
  return (
    <div>
      <div className="text-xs font-extrabold tracking-[0.3em] text-[#de1d3d]">
        {kicker}
      </div>
      <h2 className="mt-2 text-3xl font-black tracking-tight text-[#21408e] md:text-4xl">
        {title}
      </h2>
    </div>
  )
}