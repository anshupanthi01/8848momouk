export default function BrevoContactForm() {
  const src =
    "https://e6dfc53b.sibforms.com/serve/MUIFAPfJwuy6xhjaBLQgTEg8rtdBkCKW5opXK9dSiAi9Rwm3WRNAet29oPVR2ZVrDQIjqBHDuxIt2K3OCA_ZzaFngkVKtBL04x2AAO8CdekdAYk0BynOtXtFl9XvjLhbodA0AeTztY-aMX4ky6jPcrh7r4jPDP4JHMNYcHTAhKTzOfUV60HOxG-EIlMeazIykO8xvopwV7uoEDNLVg=="

  return (
    <div className="w-full max-w-[560px] overflow-hidden rounded-2xl bg-white shadow-2xl">
      <iframe
        title="Momoste Club form"
        src={src}
        className="block w-full"
        style={{ height: "400px", border: 0 }}
        scrolling="no"
      />
    </div>
  )
}