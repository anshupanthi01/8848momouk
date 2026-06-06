import GallerySection from "@/pages/home/sections/GallerySection"
import HeroReplica from "@/pages/home/sections/HeroReplica"
import FaqAndCta from "@/pages/home/sections/FaqAndCta"
import InstagramSection from "@/pages/home/sections/InstagramSection"
import MomosteSection from "@/pages/home/sections/MomosteSection"
import RootsSection from "@/pages/home/sections/RootsSection"
import UpdatesSection from "@/pages/home/sections/UpdatesSection"
import YakClubSection from "@/pages/home/sections/YakClubSection"

export default function Home() {
  return (
    <div className="bg-white">
      <HeroReplica />
      <MomosteSection />
      <RootsSection />
      <GallerySection />
      <UpdatesSection />
      {/* <FaqAndCta/> */}
      <InstagramSection />
      <YakClubSection />
    </div>
  )
}
