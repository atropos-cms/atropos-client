export const SIDEBAR_MODULES = [
  {
    type: 'item',
    name: 'modules-blog-articles',
    icon: 'subject',
  },
  {
    type: 'item',
    name: 'modules-blog-categories',
    icon: 'local_offer',
  },
  {
    type: 'item',
    name: 'modules-content-blocks',
    icon: 'filter_none'
  },
  {
    type: 'item',
    name: 'modules-content-galleries',
    icon: 'photo_library',
    permission: 'modules-content-galleries'
  },
  {
    type: 'item',
    name: 'modules-files',
    icon: 'dns',
    permission: 'modules-files-objects'
  },
  {
    type: 'item',
    name: 'modules-media-files',
    icon: 'photo',
    permission: 'modules-media-files'
  },
  {
    type: 'item',
    name: 'modules-mails-send',
    icon: 'mail_outline',
    permission: 'modules-mails-send'
  }
]

export const SIDEBAR_ADMINISTRATION = [
  {
    type: 'submenu',
    name: 'administration-settings',
    link: 'administration-settings-general',
    icon: 'settings',
    open: false,
    children: [
      {
        type: 'item',
        name: 'administration-settings-general',
        permission: 'administration-settings'
      },
      {
        type: 'item',
        name: 'administration-settings-statistics',
        permission: 'administration-settings'
      },
      {
        type: 'item',
        name: 'administration-settings-developer',
        permission: 'administration-settings'
      }
    ]
  },
  {
    type: 'item',
    name: 'administration-users',
    icon: 'person'
  },
  {
    type: 'item',
    name: 'administration-roles',
    icon: 'group'
  }
]

export const SIDEBAR_ROOT = [
  {
    type: 'item',
    title: 'index',
    name: 'index',
    icon: 'dashboard',
    permission: 'login'
  },
  {
    type: 'group',
    title: 'modules',
    visible: true,
    children: SIDEBAR_MODULES
  },
  {
    type: 'group',
    title: 'administration',
    visible: true,
    children: SIDEBAR_ADMINISTRATION
  }
]
