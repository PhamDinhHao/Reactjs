export const adminMenu = [
    { //quan ly nuoi dung
        name: 'menu.admin.manage-user', menus: [
            {
                name: 'menu.admin.crud', link: '/system/user-manage',

            },
            {
                name: 'menu.admin.crud-redux', link: '/system/user-redux',

            },
            {

                name: 'menu.admin.manage-docter', link: '/system/manage-doctor',
                // subMenus: [
                //     { name: 'menu.system.system-administrator.user-manage', link: '/system/user-manage' },
                //     { name: 'menu.system.system-administrator.product-manage', link: '/system/user-redux' },

                // ]
            },
            { //quan ly nuoi dung

                name: 'menu.doctor.manage-doctor', link: '/doctor/manage-schedule',







            },
            // {
            //     name: 'menu.admin.manage-admin', link: '/system/user-admin',

            // },



        ]
    },
    { //quan ly phong kham
        name: 'menu.admin.clinic', menus: [
            {
                name: 'menu.admin.manage-clinic', link: '/system/manage-clinic'

            }

        ]
    },
    { //quan ly chuyen khoa
        name: 'menu.admin.specialty', menus: [
            {
                name: 'menu.admin.manage-specialty', link: '/system/manage-clinic'

            }

        ]
    },
    { //quan ly cam nang
        name: 'menu.admin.handbook', menus: [
            {
                name: 'menu.admin.manage-handbook', link: '/system/manage-clinic'

            }

        ]
    },
];
export const doctorMenu = [
    { //quan ly nuoi dung
        name: 'menu.admin.manage-user',
        menus: [
            {
                name: 'menu.doctor.manage-doctor', link: '/doctor/manage-schedule',

            }





        ]

    },

];