import {
  admin,
  adminAndOwnerOnly,
  adminOwnerAndStaffOnly,
  ownerAndStaffOnly,
} from '@/utils/auth-utils';
import { Routes } from '@/config/routes';

export const siteSettings = {
  name: 'PickBazar',
  description: '',
  logo: {
    url: '/logo.svg',
    alt: 'PickBazar',
    href: '/',
    width: 138,
    height: 70,
  },
  collapseLogo: {
    url: '/collapse-logo.svg',
    alt: 'P',
    href: '/',
    width: 32,
    height: 32,
  },
  defaultLanguage: 'en',
  author: {
    name: 'RedQ',
    websiteUrl: 'https://redq.io',
    address: '',
  },
  headerLinks: [],
  authorizedLinks: [
    {
      href: Routes.profileUpdate,
      labelTransKey: 'authorized-nav-item-profile',
      icon: 'UserIcon',
      permission: admin,
    },

    {
      href: Routes.settings,
      labelTransKey: 'authorized-nav-item-settings',
      icon: 'SettingsIcon',
      permission: admin,
    },
    {
      href: Routes.logout,
      labelTransKey: 'authorized-nav-item-logout',
      icon: 'LogOutIcon',
      permission: admin,
    },
  ],
  currencyCode: 'USD',
  sidebarLinks: {
    admin: {
      root: {
        href: Routes.dashboard,
        label: 'Main',
        icon: 'DashboardIcon',
        childMenu: [
          {
            href: Routes.dashboard,
            label: 'sidebar-nav-item-dashboard',
            icon: 'DashboardIcon',
          },
        ],
      },

      // analytics: {
      //   href: '',
      //   label: 'Analytics',
      //   icon: 'ShopIcon',
      //   childMenu: [
      //     {
      //       href: '',
      //       label: 'Shop',
      //       icon: 'ShopIcon',
      //     },
      //     {
      //       href: '',
      //       label: 'Product',
      //       icon: 'ProductsIcon',
      //     },
      //     {
      //       href: '',
      //       label: 'Order',
      //       icon: 'OrdersIcon',
      //     },
      //     // {
      //     //   href: '',
      //     //   label: 'Sale',
      //     //   icon: 'ShopIcon',
      //     // },
      //     {
      //       href: '',
      //       label: 'User',
      //       icon: 'UsersIcon',
      //     },
      //   ],
      // },

      // shop: {
      //   href: '',
      //   label: 'text-shop-management',
      //   icon: 'ShopIcon',
      //   childMenu: [
      //     {
      //       href: '',
      //       label: 'sidebar-nav-item-shops',
      //       icon: 'ShopIcon',
      //       childMenu: [
      //         {
      //           href: Routes.shop.list,
      //           label: 'text-all-shops',
      //           icon: 'MyShopIcon',
      //         },
      //         {
      //           href: Routes.shop.create,
      //           label: 'text-add-all-shops',
      //           icon: 'ShopIcon',
      //         },
      //         {
      //           href: Routes.newShops,
      //           label: 'text-inactive-shops',
      //           icon: 'MyShopIcon',
      //         },
      //       ],
      //     },
      //     {
      //       href: Routes.adminMyShops,
      //       label: 'sidebar-nav-item-my-shops',
      //       icon: 'MyShopIcon',
      //     },
      //   ],
      // },

      product: {
        href: '',
        label: 'text-product-management',
        icon: 'ProductsIcon',
        childMenu: [
          {
            href: '',
            label: 'sidebar-nav-item-products',
            icon: 'ProductsIcon',
            childMenu: [
              {
                href: Routes.product.list,
                label: 'text-all-products',
                icon: 'ProductsIcon',
              },
              // {
              //   href: Routes.product.create,
              //   label: 'Add new product',
              //   icon: 'ProductsIcon',
              // },
              {
                href: Routes.draftProducts,
                label: 'text-my-draft-products',
                icon: 'ProductsIcon',
              },
              {
                href: Routes.outOfStockOrLowProducts,
                label: 'text-all-out-of-stock',
                icon: 'ProductsIcon',
              },
            ],
          },
          {
            href: Routes.productInventory,
            label: 'text-inventory',
            icon: 'InventoryIcon',
          },
          {
            href: Routes.category.list,
            label: 'sidebar-nav-item-categories',
            icon: 'CategoriesIcon',
          },
          {
            href: Routes.tag.list,
            label: 'sidebar-nav-item-tags',
            icon: 'TagIcon',
          },
          {
            href: Routes.attribute.list,
            label: 'sidebar-nav-item-attributes',
            icon: 'AttributeIcon',
          },
          // {
          //   href: Routes.manufacturer.list,
          //   label: 'sidebar-nav-item-manufacturers',
          //   icon: 'ManufacturersIcon',
          // },
          // {
          //   href: Routes.author.list,
          //   label: 'sidebar-nav-item-authors',
          //   icon: 'AuthorIcon',
          // },
        ],
      },

      financial: {
        href: '',
        label: 'text-e-commerce-management',
        icon: 'WithdrawIcon',
        childMenu: [
          {
            href: Routes.tax.list,
            label: 'sidebar-nav-item-taxes',
            icon: 'TaxesIcon',
          },
          {
            href: Routes.shipping.list,
            label: 'sidebar-nav-item-shippings',
            icon: 'ShippingsIcon',
          },
          {
            href: Routes.withdraw.list,
            label: 'sidebar-nav-item-withdraws',
            icon: 'WithdrawIcon',
          },
          {
            href: '',
            label: 'sidebar-nav-item-refunds',
            icon: 'RefundsIcon',
            childMenu: [
              {
                href: Routes.refund.list,
                label: 'text-reported-refunds',
                icon: 'RefundsIcon',
              },
              {
                href: Routes.refundPolicies.list,
                label: 'sidebar-nav-item-refund-policy',
                icon: 'AuthorIcon',
              },
              {
                href: Routes.refundPolicies.create,
                label: 'text-new-refund-policy',
                icon: 'RefundsIcon',
              },
              {
                href: Routes.refundReasons.list,
                label: 'text-refund-reasons',
                icon: 'RefundsIcon',
              },
              {
                href: Routes.refundReasons.create,
                label: 'text-new-refund-reasons',
                icon: 'RefundsIcon',
              },
            ],
          },
        ],
      },

      layout: {
        href: '',
        label: 'text-page-control',
        icon: 'SettingsIcon',
        childMenu: [
          // {
          //   href: Routes.type.list,
          //   label: 'text-groups',
          //   icon: 'HomeIcon',
          // },
          {
            href: '',
            label: 'text-faqs',
            icon: 'FaqIcon',
            childMenu: [
              {
                href: Routes.faqs.list,
                label: 'text-all-faqs',
                icon: 'FaqIcon',
              },
              {
                href: Routes.faqs.create,
                label: 'text-new-faq',
                icon: 'TypesIcon',
              },
            ],
          },
          {
            href: '',
            label: 'text-terms-conditions',
            icon: 'TermsIcon',
            childMenu: [
              {
                href: Routes.termsAndCondition.list,
                label: 'text-all-terms',
                icon: 'TermsIcon',
              },
              {
                href: Routes.termsAndCondition.create,
                label: 'text-new-terms',
                icon: 'TermsIcon',
              },
            ],
          },
        ],
      },

      order: {
        href: Routes.order.list,
        label: 'text-order-management',
        icon: 'OrdersIcon',
        childMenu: [
          {
            href: Routes.order.list,
            label: 'sidebar-nav-item-orders',
            icon: 'OrdersIcon',
          },
          {
            href: Routes.transaction,
            label: 'text-transactions',
            icon: 'TransactionsIcon',
          },
          // {
          //   href: '',
          //   label: 'Order tracking',
          //   icon: 'OrderTrackingIcon',
          // },
          // {
          //   href: '',
          //   label: 'Delivery policies',
          //   icon: 'ShippingsIcon',
          // },
          // {
          //   href: '',
          //   label: 'Cancelation policies',
          //   icon: 'CancelationIcon',
          // },
        ],
      },

      user: {
        href: '',
        label: 'text-user-control',
        icon: 'SettingsIcon',
        childMenu: [
          {
            href: Routes.user.list,
            label: 'text-all-users',
            icon: 'UsersIcon',
          },
          // {
          //   href: Routes.adminList,
          //   label: 'text-admin-list',
          //   icon: 'AdminListIcon',
          // },
          // {
          //   href: '',
          //   label: 'text-vendors',
          //   icon: 'VendorsIcon',
          //   childMenu: [
          //     {
          //       href: Routes.vendorList,
          //       label: 'text-all-vendors',
          //       icon: 'UsersIcon',
          //     },
          //     {
          //       href: Routes.pendingVendorList,
          //       label: 'text-pending-vendors',
          //       icon: 'UsersIcon',
          //     },
          //   ],
          // },
          // {
          //   href: '',
          //   label: 'sidebar-nav-item-staffs',
          //   icon: 'StaffIcon',
          //   childMenu: [
          //     {
          //       href: Routes.myStaffs,
          //       label: 'sidebar-nav-item-my-staffs',
          //       icon: 'UsersIcon',
          //     },
          //     {
          //       href: Routes.vendorStaffs,
          //       label: 'sidebar-nav-item-vendor-staffs',
          //       icon: 'UsersIcon',
          //     },
          //   ],
          // },
          // {
          //   href: Routes.customerList,
          //   label: 'text-customers',
          //   icon: 'CustomersIcon',
          // },
          {
            href: Routes.contact.list,
            label: 'text-contact',
            icon: 'DiaryIcon',
          },
        ],
      },

      feedback: {
        href: '',
        label: 'text-feedback-control',
        icon: 'SettingsIcon',
        childMenu: [
          {
            href: Routes.reviews.list,
            label: 'sidebar-nav-item-reviews',
            icon: 'ReviewIcon',
          },
          {
            href: Routes.question.list,
            label: 'sidebar-nav-item-questions',
            icon: 'QuestionIcon',
          },
        ],
      },

      promotional: {
        href: '',
        label: 'text-promotional-management',
        icon: 'SettingsIcon',
        childMenu: [
          {
            href: '',
            label: 'sidebar-nav-item-coupons',
            icon: 'CouponsIcon',
            childMenu: [
              {
                href: Routes.coupon.list,
                label: 'text-all-coupons',
                icon: 'CouponsIcon',
              },
              {
                href: Routes.coupon.create,
                label: 'text-new-coupon',
                icon: 'CouponsIcon',
              },
            ],
          },
          {
            href: '',
            label: 'text-flash-sale',
            icon: 'FlashDealsIcon',
            childMenu: [
              {
                href: Routes.flashSale.list,
                label: 'text-all-campaigns',
                icon: 'FlashDealsIcon',
              },
              {
                href: Routes.flashSale.create,
                label: 'text-new-campaigns',
                icon: 'FlashDealsIcon',
              },
              // {
              //   href: Routes.vendorRequestForFlashSale.list,
              //   label: 'Vendor requests',
              //   icon: 'CouponsIcon',
              // },
            ],
          },
          // {
          //   href: '',
          //   label: 'Newsletter emails',
          //   icon: 'CouponsIcon',
          // },
        ],
      },

      feature: {
        href: '',
        label: 'text-feature-management',
        icon: 'SettingsIcon',
        childMenu: [
          {
            href: Routes.storeNotice.list,
            label: 'sidebar-nav-item-store-notice',
            icon: 'StoreNoticeIcon',
          },
          {
            href: Routes.broadcast.list,
            label: 'sidebar-nav-item-broadcast',
            icon: 'ChatIcon',
          },
        ],
      },

      settings: {
        href: '',
        label: 'text-site-management',
        icon: 'SettingsIcon',
        childMenu: [
          {
            href: Routes.settings,
            label: 'sidebar-nav-item-settings',
            icon: 'SettingsIcon',
            childMenu: [
              {
                href: Routes.settings,
                label: 'text-general-settings',
                icon: 'SettingsIcon',
              },
              {
                href: Routes.paymentSettings,
                label: 'text-payment-settings',
                icon: 'RefundsIcon',
              },
              {
                href: Routes.seoSettings,
                label: 'text-seo-settings',
                icon: 'StoreNoticeIcon',
              },
              {
                href: Routes.eventSettings,
                label: 'text-events-settings',
                icon: 'RefundsIcon',
              },
              {
                href: Routes.shopSettings,
                label: 'text-shop-settings',
                icon: 'RefundsIcon',
              },
              {
                href: Routes?.maintenance,
                label: 'text-maintenance-settings',
                icon: 'InformationIcon',
              },
              {
                href: Routes?.companyInformation,
                label: 'text-company-settings',
                icon: 'InformationIcon',
              },
              {
                href: Routes?.promotionPopup,
                label: 'text-popup-settings',
                icon: 'InformationIcon',
              },
              // {
              //   href: '',
              //   label: 'Social settings',
              //   icon: 'RefundsIcon',
              // },
            ],
          },
          // {
          //   href: '',
          //   label: 'Company Information',
          //   icon: 'InformationIcon',
          // },
          // {
          //   href: '',
          //   label: 'Maintenance',
          //   icon: 'MaintenanceIcon',
          // },
        ],
      },

      // license: {
      //   href: '',
      //   label: 'Main',
      //   icon: 'DashboardIcon',
      //   childMenu: [
      //     {
      //       href: Routes.domains,
      //       label: 'sidebar-nav-item-domains',
      //       icon: 'DashboardIcon',
      //     },
      //   ],
      // },
    },

    shop: {
      root: {
        href: '',
        label: 'text-main',
        icon: 'DashboardIcon',
        childMenu: [
          {
            href: (shop: string) => `${Routes.dashboard}${shop}`,
            label: 'sidebar-nav-item-dashboard',
            icon: 'DashboardIcon',
            permissions: adminOwnerAndStaffOnly,
          },
        ],
      },

      // analytics: {
      //   href: (shop: string) => `/${shop}${Routes.product.list}`,
      //   label: 'Analytics',
      //   icon: 'ShopIcon',
      //   permissions: adminAndOwnerOnly,
      //   childMenu: [
      //     {
      //       href: (shop: string) => `/${shop}${Routes.product.list}`,
      //       label: 'Shop',
      //       icon: 'ShopIcon',
      //       permissions: adminAndOwnerOnly,
      //     },
      //     {
      //       href: (shop: string) => `/${shop}${Routes.product.list}`,
      //       label: 'Product',
      //       icon: 'ProductsIcon',
      //       permissions: adminAndOwnerOnly,
      //     },
      //     {
      //       href: (shop: string) => `/${shop}${Routes.product.list}`,
      //       label: 'Order',
      //       icon: 'OrdersIcon',
      //       permissions: adminAndOwnerOnly,
      //     },
      //     {
      //       href: (shop: string) => `/${shop}${Routes.product.list}`,
      //       label: 'Sale',
      //       icon: 'ShopIcon',
      //       permissions: adminAndOwnerOnly,
      //     },
      //   ],
      // },

      product: {
        href: '',
        label: 'text-product-management',
        icon: 'ProductsIcon',
        permissions: adminOwnerAndStaffOnly,
        childMenu: [
          {
            href: (shop: string) => `/${shop}${Routes.product.list}`,
            label: 'sidebar-nav-item-products',
            icon: 'ProductsIcon',
            childMenu: [
              {
                href: (shop: string) => `/${shop}${Routes.product.list}`,
                label: 'text-all-products',
                icon: 'ProductsIcon',
                permissions: adminOwnerAndStaffOnly,
              },
              {
                href: (shop: string) => `/${shop}${Routes.product.create}`,
                label: 'text-new-products',
                icon: 'ProductsIcon',
                permissions: adminOwnerAndStaffOnly,
              },
              {
                href: (shop: string) => `/${shop}${Routes.draftProducts}`,
                label: 'text-my-draft',
                icon: 'ProductsIcon',
                permissions: adminOwnerAndStaffOnly,
              },
              {
                href: (shop: string) =>
                  `/${shop}${Routes.outOfStockOrLowProducts}`,
                label: 'text-all-out-of-stock',
                icon: 'ProductsIcon',
                permissions: adminOwnerAndStaffOnly,
              },
            ],
          },
          {
            href: (shop: string) => `/${shop}${Routes.productInventory}`,
            label: 'text-inventory',
            icon: 'InventoryIcon',
            permissions: adminOwnerAndStaffOnly,
          },
          {
            href: (shop: string) => `/${shop}${Routes.attribute.list}`,
            label: 'sidebar-nav-item-attributes',
            icon: 'AttributeIcon',
            permissions: adminOwnerAndStaffOnly,
          },
          {
            href: (shop: string) => `/${shop}${Routes.manufacturer.list}`,
            label: 'sidebar-nav-item-manufacturers',
            icon: 'DiaryIcon',
            permissions: adminAndOwnerOnly,
          },
          {
            href: (shop: string) => `/${shop}${Routes.author.list}`,
            label: 'sidebar-nav-item-authors',
            icon: 'FountainPenIcon',
            permissions: adminAndOwnerOnly,
          },
        ],
      },

      financial: {
        href: '',
        label: 'text-financial-management',
        icon: 'WithdrawIcon',
        childMenu: [
          {
            href: (shop: string) => `/${shop}${Routes.withdraw.list}`,
            label: 'sidebar-nav-item-withdraws',
            icon: 'AttributeIcon',
            permissions: adminAndOwnerOnly,
          },
          {
            href: (shop: string) => `/${shop}${Routes.refund.list}`,
            label: 'sidebar-nav-item-refunds',
            icon: 'RefundsIcon',
            permissions: adminOwnerAndStaffOnly,
          },
        ],
      },

      order: {
        href: '',
        label: 'text-order-management',
        icon: 'OrdersIcon',
        childMenu: [
          {
            href: (shop: string) => `/${shop}${Routes.order.list}`,
            label: 'sidebar-nav-item-orders',
            icon: 'OrdersIcon',
            permissions: adminOwnerAndStaffOnly,
          },
          {
            href: (shop: string) => `/${shop}${Routes.transaction}`,
            label: 'text-transactions',
            icon: 'CalendarScheduleIcon',
            permissions: adminAndOwnerOnly,
          },
        ],
      },

      feature: {
        href: '',
        label: 'text-feature-management',
        icon: 'ProductsIcon',
        childMenu: [
          {
            href: (shop: string) => `/${shop}${Routes.storeNotice.list}`,
            label: 'sidebar-nav-item-store-notice',
            icon: 'StoreNoticeIcon',
            permissions: adminAndOwnerOnly,
          },
          {
            href: (shop: string) => `${Routes.ownerDashboardMessage}`,
            label: 'sidebar-nav-item-message',
            icon: 'ChatIcon',
            permissions: adminAndOwnerOnly,
          },
        ],
      },

      feedback: {
        href: '',
        label: 'text-feedback-control',
        icon: 'SettingsIcon',
        childMenu: [
          {
            href: (shop: string) => `/${shop}${Routes.reviews.list}`,
            label: 'sidebar-nav-item-reviews',
            icon: 'ReviewIcon',
            permissions: adminAndOwnerOnly,
          },
          {
            href: (shop: string) => `/${shop}${Routes.question.list}`,
            label: 'sidebar-nav-item-questions',
            icon: 'QuestionIcon',
            permissions: adminAndOwnerOnly,
          },
        ],
      },

      user: {
        href: '',
        label: 'text-user-control',
        icon: 'SettingsIcon',
        childMenu: [
          {
            href: (shop: string) => `/${shop}${Routes.staff.list}`,
            label: 'sidebar-nav-item-staffs',
            icon: 'UsersIcon',
            permissions: adminAndOwnerOnly,
          },
        ],
      },

      promotional: {
        href: '',
        label: 'text-promotional-control',
        icon: 'SettingsIcon',
        childMenu: [
          {
            href: (shop: string) => `/${shop}${Routes.coupon.list}`,
            label: 'Coupons',
            icon: 'CouponsIcon',
            permissions: adminAndOwnerOnly,
          },
          {
            href: (shop: string) => `/${shop}${Routes.flashSale.list}`,
            label: 'text-flash-sale',
            icon: 'UsersIcon',
            childMenu: [
              {
                href: (shop: string) => `/${shop}${Routes.flashSale.list}`,
                label: 'text-available-flash-deals',
                icon: 'ProductsIcon',
                permissions: adminOwnerAndStaffOnly,
              },
              {
                href: (shop: string) =>
                  `/${shop}${Routes.myProductsInFlashSale}`,
                label: 'text-my-products-in-deals',
                icon: 'ProductsIcon',
                permissions: adminOwnerAndStaffOnly,
              },
              {
                href: (shop: string) =>
                  `/${shop}${Routes.vendorRequestForFlashSale.list}`,
                label: 'Ask for enrollment',
                icon: 'ProductsIcon',
                permissions: adminOwnerAndStaffOnly,
              },
            ],
          },
        ],
      },

      layout: {
        href: '',
        label: 'text-page-management',
        icon: 'SettingsIcon',
        childMenu: [
          {
            href: (shop: string) => `/${shop}${Routes.faqs.list}`,
            label: 'text-faqs',
            icon: 'TypesIcon',
            permissions: adminOwnerAndStaffOnly,
          },
          {
            href: (shop: string) => `/${shop}${Routes.termsAndCondition.list}`,
            label: 'Terms And Conditions',
            icon: 'TypesIcon',
            permissions: adminAndOwnerOnly,
          },
        ],
      },
    },

    staff: {
      root: {
        href: '',
        label: 'text-main',
        icon: 'DashboardIcon',
        childMenu: [
          {
            href: (shop: string) => `${Routes.dashboard}${shop}`,
            label: 'sidebar-nav-item-dashboard',
            icon: 'DashboardIcon',
            permissions: adminOwnerAndStaffOnly,
          },
        ],
      },

      // analytics: {
      //   href: (shop: string) => `/${shop}${Routes.product.list}`,
      //   label: 'Analytics',
      //   icon: 'ShopIcon',
      //   permissions: adminAndOwnerOnly,
      //   childMenu: [
      //     {
      //       href: (shop: string) => `/${shop}${Routes.product.list}`,
      //       label: 'Shop',
      //       icon: 'ShopIcon',
      //       permissions: adminAndOwnerOnly,
      //     },
      //     {
      //       href: (shop: string) => `/${shop}${Routes.product.list}`,
      //       label: 'Product',
      //       icon: 'ProductsIcon',
      //       permissions: adminAndOwnerOnly,
      //     },
      //     {
      //       href: (shop: string) => `/${shop}${Routes.product.list}`,
      //       label: 'Order',
      //       icon: 'OrdersIcon',
      //       permissions: adminAndOwnerOnly,
      //     },
      //     {
      //       href: (shop: string) => `/${shop}${Routes.product.list}`,
      //       label: 'Sale',
      //       icon: 'ShopIcon',
      //       permissions: adminAndOwnerOnly,
      //     },
      //   ],
      // },

      product: {
        href: '',
        label: 'text-product-management',
        icon: 'ProductsIcon',
        permissions: adminOwnerAndStaffOnly,
        childMenu: [
          {
            href: (shop: string) => `/${shop}${Routes.product.list}`,
            label: 'sidebar-nav-item-products',
            icon: 'ProductsIcon',
            childMenu: [
              {
                href: (shop: string) => `/${shop}${Routes.product.list}`,
                label: 'text-all-products',
                icon: 'ProductsIcon',
                permissions: adminOwnerAndStaffOnly,
              },
              {
                href: (shop: string) => `/${shop}${Routes.product.create}`,
                label: 'text-new-products',
                icon: 'ProductsIcon',
                permissions: adminOwnerAndStaffOnly,
              },
              {
                href: (shop: string) => `/${shop}${Routes.draftProducts}`,
                label: 'text-my-draft',
                icon: 'ProductsIcon',
                permissions: adminOwnerAndStaffOnly,
              },
              {
                href: (shop: string) =>
                  `/${shop}${Routes.outOfStockOrLowProducts}`,
                label: 'text-low-out-of-stock',
                icon: 'ProductsIcon',
                permissions: adminOwnerAndStaffOnly,
              },
            ],
          },
          {
            href: (shop: string) => `/${shop}${Routes.productInventory}`,
            label: 'text-inventory',
            icon: 'InventoryIcon',
            permissions: adminOwnerAndStaffOnly,
          },
          {
            href: (shop: string) => `/${shop}${Routes.attribute.list}`,
            label: 'sidebar-nav-item-attributes',
            icon: 'AttributeIcon',
            permissions: adminOwnerAndStaffOnly,
          },
          {
            href: (shop: string) => `/${shop}${Routes.manufacturer.list}`,
            label: 'sidebar-nav-item-manufacturers',
            icon: 'DiaryIcon',
            permissions: adminAndOwnerOnly,
          },
          {
            href: (shop: string) => `/${shop}${Routes.author.list}`,
            label: 'sidebar-nav-item-authors',
            icon: 'FountainPenIcon',
            permissions: adminAndOwnerOnly,
          },
        ],
      },

      financial: {
        href: '',
        label: 'text-financial-management',
        icon: 'WithdrawIcon',
        childMenu: [
          // {
          //   href: (shop: string) => `/${shop}${Routes.withdraw.list}`,
          //   label: 'sidebar-nav-item-withdraws',
          //   icon: 'AttributeIcon',
          //   permissions: adminAndOwnerOnly,
          // },
          {
            href: (shop: string) => `/${shop}${Routes.refund.list}`,
            label: 'sidebar-nav-item-refunds',
            icon: 'RefundsIcon',
            permissions: adminOwnerAndStaffOnly,
          },
        ],
      },

      order: {
        href: '',
        label: 'text-order-management',
        icon: 'OrdersIcon',
        childMenu: [
          {
            href: (shop: string) => `/${shop}${Routes.order.list}`,
            label: 'sidebar-nav-item-orders',
            icon: 'OrdersIcon',
            permissions: adminOwnerAndStaffOnly,
          },
          // {
          //   href: (shop: string) => `/${shop}${Routes.transaction}`,
          //   label: 'Transactions',
          //   icon: 'CalendarScheduleIcon',
          //   permissions: adminAndOwnerOnly,
          // },
        ],
      },

      // feature: {
      //   href: '',
      //   label: 'Features Management',
      //   icon: 'ProductsIcon',
      //   childMenu: [
      //     {
      //       href: (shop: string) => `/${shop}${Routes.storeNotice.list}`,
      //       label: 'sidebar-nav-item-store-notice',
      //       icon: 'StoreNoticeIcon',
      //       permissions: adminAndOwnerOnly,
      //     },
      //     {
      //       href: (shop: string) => `${Routes.message.list}`,
      //       label: 'sidebar-nav-item-message',
      //       icon: 'ChatIcon',
      //       permissions: adminAndOwnerOnly,
      //     },
      //   ],
      // },

      // feedback: {
      //   href: '',
      //   label: 'Feedback control',
      //   icon: 'SettingsIcon',
      //   childMenu: [
      //     {
      //       href: (shop: string) => `/${shop}${Routes.reviews.list}`,
      //       label: 'sidebar-nav-item-reviews',
      //       icon: 'ReviewIcon',
      //       permissions: adminAndOwnerOnly,
      //     },
      //     {
      //       href: (shop: string) => `/${shop}${Routes.question.list}`,
      //       label: 'sidebar-nav-item-questions',
      //       icon: 'QuestionIcon',
      //       permissions: adminAndOwnerOnly,
      //     },
      //   ],
      // },

      // user: {
      //   href: '',
      //   label: 'User control',
      //   icon: 'SettingsIcon',
      //   childMenu: [
      //     {
      //       href: (shop: string) => `/${shop}${Routes.staff.list}`,
      //       label: 'sidebar-nav-item-staffs',
      //       icon: 'UsersIcon',
      //       permissions: adminAndOwnerOnly,
      //     },
      //   ],
      // },

      promotional: {
        href: '',
        label: 'text-promotional-control',
        icon: 'SettingsIcon',
        childMenu: [
          {
            href: (shop: string) => `/${shop}${Routes.coupon.list}`,
            label: 'Coupons',
            icon: 'CouponsIcon',
            permissions: adminOwnerAndStaffOnly,
          },
          {
            href: (shop: string) => `/${shop}${Routes.flashSale.list}`,
            label: 'text-flash-sale',
            icon: 'UsersIcon',
            childMenu: [
              {
                href: (shop: string) => `/${shop}${Routes.flashSale.list}`,
                label: 'text-available-flash-deals',
                icon: 'ProductsIcon',
                permissions: adminOwnerAndStaffOnly,
              },
              {
                href: (shop: string) =>
                  `/${shop}${Routes.myProductsInFlashSale}`,
                label: 'text-my-products-in-deals',
                icon: 'ProductsIcon',
                permissions: adminOwnerAndStaffOnly,
              },
              {
                href: (shop: string) =>
                  `/${shop}${Routes.vendorRequestForFlashSale.list}`,
                label: 'See all enrollment request',
                icon: 'ProductsIcon',
                permissions: adminOwnerAndStaffOnly,
              },
            ],
          },
        ],
      },

      layout: {
        href: '',
        label: 'text-page-management',
        icon: 'SettingsIcon',
        childMenu: [
          {
            href: (shop: string) => `/${shop}${Routes.faqs.list}`,
            label: 'text-faqs',
            icon: 'TypesIcon',
            permissions: adminOwnerAndStaffOnly,
          },
          // {
          //   href: (shop: string) => `/${shop}${Routes.termsAndCondition.list}`,
          //   label: 'Terms And Conditions',
          //   icon: 'TypesIcon',
          //   permissions: adminAndOwnerOnly,
          // },
        ],
      },
    },

    ownerDashboard: [
      {
        href: Routes.dashboard,
        label: 'sidebar-nav-item-dashboard',
        icon: 'DashboardIcon',
        permissions: ownerAndStaffOnly,
      },
      {
        href: Routes?.ownerDashboardMyShop,
        label: 'common:sidebar-nav-item-my-shops',
        icon: 'MyShopOwnerIcon',
        permissions: ownerAndStaffOnly,
      },
      {
        href: Routes?.ownerDashboardMessage,
        label: 'common:sidebar-nav-item-message',
        icon: 'ChatOwnerIcon',
        permissions: ownerAndStaffOnly,
      },
      {
        href: Routes?.ownerDashboardNotice,
        label: 'common:sidebar-nav-item-store-notice',
        icon: 'StoreNoticeOwnerIcon',
        permissions: ownerAndStaffOnly,
      },
    ],
  },
  product: {
    placeholder:
      'data:image/jpeg;base64,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',
  },
  avatar: {
    placeholder: '/avatar-placeholder.svg',
  },
};

export const socialIcon = [
  {
    value: 'FacebookIcon',
    label: 'Facebook',
  },
  {
    value: 'InstagramIcon',
    label: 'Instagram',
  },
  {
    value: 'TwitterIcon',
    label: 'Twitter',
  },
  {
    value: 'YouTubeIcon',
    label: 'Youtube',
  },
];
