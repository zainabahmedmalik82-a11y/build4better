export default function BilingualText({
  en, ur, as: Tag = 'div', center = false, enClass = '', urClass = '',
}) {
  return (
    <Tag className={`flex flex-col ${center ? 'items-center text-center' : ''}`}>
      <span lang="en" dir="ltr" className={enClass}>{en}</span>
      <span lang="ur" dir="rtl" className={`urdu ${urClass}`}>{ur}</span>
    </Tag>
  )
}