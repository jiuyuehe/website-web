import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Yliyun Website'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
