import BilingualText from './BilingualText'

export default function FeatureCard({
  icon: Icon, titleEn, titleUr, descEn, descUr, ctaEn, ctaUr, onClick,
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 shadow-xs">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-mint-strong text-primary">
        <Icon size={24} aria-hidden="true" />
      </div>
      <BilingualText en={titleEn} ur={titleUr} enClass="text-lg font-bold text-primary" urClass="text-lg font-bold text-primary" />
      <BilingualText en={descEn} ur={descUr} enClass="text-sm text-muted font-medium" urClass="text-sm text-muted font-medium" />
      <button
        onClick={onClick}
        className="mt-auto min-h-10 rounded-xl bg-action px-4 py-2 font-bold text-white hover:bg-primary active:scale-[0.98] transition-colors"
      >
        <BilingualText as="span" center en={ctaEn} ur={ctaUr} />
      </button>
    </div>
  )
}
