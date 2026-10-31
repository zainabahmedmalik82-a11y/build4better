import BilingualText from './BilingualText'

export default function FeatureCard({
  icon: Icon, titleEn, titleUr, descEn, descUr, ctaEn, ctaUr, onClick,
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6 shadow-sm">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-mint-strong text-primary">
        <Icon size={30} aria-hidden="true" />
      </div>
      <BilingualText en={titleEn} ur={titleUr} enClass="text-xl font-semibold text-primary" urClass="text-xl font-semibold text-primary" />
      <BilingualText en={descEn} ur={descUr} enClass="text-muted" urClass="text-muted" />
      <button
        onClick={onClick}
        className="mt-auto min-h-12 rounded-xl bg-action px-5 py-3 font-semibold text-white hover:bg-primary"
      >
        <BilingualText as="span" center en={ctaEn} ur={ctaUr} />
      </button>
    </div>
  )
}